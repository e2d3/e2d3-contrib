//# require=d3

var margin = {top: 20, right: 80, bottom: 30, left: 50};
var width = root.clientWidth - margin.left - margin.right;
var height = root.clientHeight - margin.top - margin.bottom;


var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d[city]); });

var form = d3.select(root).append('form');

var chart = d3.select(root).append('svg')
    .attr('width', root.clientWidth)
    .attr('height', root.clientHeight)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var parseDate = d3.time.format("%Y%m%d").parse;
var city;

function update(data) {
  form.selectAll('*').remove();
  chart.selectAll('*').remove();

  var list = data.toList();
  var cities = list.header.filter(function (d) { return d != 'date'; });
  var label = form.selectAll('label')
      .data(cities)
    .enter().append('label')
      .text(function (d) { return d; })
    .insert('input')
      .attr({
          type:'radio',
          name:'city',
          value: function (d) { return d; }
        })
      .property('checked', function (d, i) { return i == 0; });

  city = cities[0];

  list.forEach(function(d) {
    d.date = parseDate(''+d.date);
    cities.forEach(function(c) {
      d[c] = + d[c];
    });
  });
  x.domain(d3.extent(list.map(function (d) { return d.date; })));
  y.domain(d3.extent(list, function (d) { return d[city]; }));

  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Temperature (ºF)");

  chart.append("path")
      .datum(list)
      .attr("class", "line")
      .attr("d", line);

  chart.append("text")
      .datum(list[list.length - 1])
      .attr("class", "label")
      .attr("transform", transform)
      .attr("x", 3)
      .attr("dy", ".35em")
      .text(city);

  d3.selectAll("input").on("change", change);

  var timeout = setTimeout(function() {
    d3.select("input[value=\"" + cities[1] + "\"]").property("checked", true).each(change);
  }, 2000);

  function change() {
    clearTimeout(timeout);

    city = this.value;

    // First transition the line & label to the new city.
    var t0 = chart.transition().duration(750);
    t0.selectAll(".line").attr("d", line);
    t0.selectAll(".label").attr("transform", transform).text(city);

    // Then transition the y-axis.
    y.domain(d3.extent(list, function(d) { return d[city]; }));
    var t1 = t0.transition();
    t1.selectAll(".line").attr("d", line);
    t1.selectAll(".label").attr("transform", transform);
    t1.selectAll(".y.axis").call(yAxis);
  }

  function transform(d) {
    return "translate(" + x(d.date) + "," + y(d[city]) + ")";
  }
}
