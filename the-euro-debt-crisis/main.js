// Chart dimensions.
var w = root.clientWidth / 2,
    h = root.clientHeight,
    r1 = Math.min(w, h) / 2 - 4,
    r0 = r1 - 20,
    format = d3.format(",.3r");

// Square matrices, asynchronously loaded; credits is the transpose of debits.
var debits = [],
    credits = [];

// The chord layout, for computing the angles of chords and groups.
var layout = d3.layout.chord()
    .sortGroups(d3.descending)
    .sortSubgroups(d3.descending)
    .sortChords(d3.descending)
    .padding(.04);

// The color scale, for different categories of "worrisome" risk.
var fill = d3.scale.ordinal()
    .domain([0, 1, 2])
    .range(["#DB704D", "#D2D0C6", "#ECD08D", "#F8EDD3"]);

// The arc generator, for the groups.
var arc = d3.svg.arc()
    .innerRadius(r0)
    .outerRadius(r1);

// The chord generator (quadratic Bézier), for the chords.
var chord = d3.svg.chord()
    .radius(r0);

// Load our data file…
function update(data) {
  d3.select(root).selectAll("*").remove();

  data = data.toList();

  var countries = {},
      array = [],
      n = 0;

  // Compute a unique id for each country.
  data.forEach(function(d) {
    d.creditor = country(d.creditor);
    d.debtor = country(d.debtor);
    d.debtor.risk = d.risk;
    d.valueOf = value; // convert object to number implicitly
  });

  // Initialize a square matrix of debits and credits.
  for (var i = 0; i < n; i++) {
    debits[i] = [];
    credits[i] = [];
    for (var j = 0; j < n; j++) {
      debits[i][j] = 0;
      credits[i][j] = 0;
    }
  }

  // Populate the matrices, and stash a map from id to country.
  data.forEach(function(d) {
    debits[d.creditor.id][d.debtor.id] = d;
    credits[d.debtor.id][d.creditor.id] = d;
    array[d.creditor.id] = d.creditor;
    array[d.debtor.id] = d.debtor;
  });

  // Add an SVG element for each diagram, and translate the origin to the center.
  var svg = d3.select(root).selectAll("div")
      .data([debits, credits])
    .enter().append("div")
      .style("display", "inline-block")
      .style("width", w + "px")
      .style("height", h + "px")
    .append("svg:svg")
      .attr("width", w)
      .attr("height", h)
    .append("svg:g")
      .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

  // For each diagram…
  svg.each(function(matrix, j) {
    var svg = d3.select(this);

    // Compute the chord layout.
    layout.matrix(matrix);

    // Add chords.
    svg.selectAll("path.chord")
        .data(layout.chords)
      .enter().append("svg:path")
        .attr("class", "chord")
        .style("fill", function(d) { return fill(d.source.value.risk); })
        .style("stroke", function(d) { return d3.rgb(fill(d.source.value.risk)).darker(); })
        .attr("d", chord)
      .append("svg:title")
        .text(function(d) { return d.source.value.debtor.name + " owes " + d.source.value.creditor.name + " $" + format(d.source.value) + "B."; });

    // Add groups.
    var g = svg.selectAll("g.group")
        .data(layout.groups)
      .enter().append("svg:g")
        .attr("class", "group");

    // Add the group arc.
    g.append("svg:path")
        .style("fill", function(d) { return fill(array[d.index].risk); })
        .attr("id", function(d, i) { return "group" + d.index + "-" + j; })
        .attr("d", arc)
      .append("svg:title")
        .text(function(d) { return array[d.index].name + " " + (j ? "owes" : "is owed") + " $" + format(d.value) + "B."; });

    // Add the group label (but only for large groups, where it will fit).
    // An alternative labeling mechanism would be nice for the small groups.
    g.append("svg:text")
        .attr("x", 6)
        .attr("dy", 15)
        .filter(function(d) { return d.value > 110; })
      .append("svg:textPath")
        .attr("xlink:href", function(d) { return "#group" + d.index + "-" + j; })
        .text(function(d) { return array[d.index].name; });
  });

  // Memoize the specified country, computing a unique id.
  function country(d) {
    return countries[d] || (countries[d] = {
      name: d,
      id: n++
    });
  }

  // Converts a debit object to its primitive numeric value.
  function value() {
    return +this.amount;
  }
}
