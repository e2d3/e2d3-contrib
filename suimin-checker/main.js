//# require=d3

var today = '';
var days = [];
var names = [];
var dateformat = d3.time.format('%m/%d/%Y');
var timeformat = d3.time.format('%H:%M');
var data = [];

// Various accessors that specify the four dimensions of data to visualize.
function x(d) { return d[dateScale(today)].name; }
function y(d) { return d[dateScale(today)].sleep; }
function radius(d) { return d[dateScale(today)].duration; }
function color(d) { return d[dateScale(today)]; }
function key(d) { return d[dateScale(today)].name; }

// Chart dimensions.
var margin = {top: 24.5, right: 24.5, bottom: 44.5, left: 84.5},
    width = root.clientWidth - margin.right - margin.left,
    height = root.clientHeight - margin.top - margin.bottom;

// Various scales. These domains make assumptions of data, naturally.
var xScale = d3.scale.ordinal().rangePoints([0,width],0.7);
var yScale = d3.time.scale().range([height, 0]);
var radiusScale = d3.scale.sqrt().range([0.05*height, 0.2*height]);
var colorScale = function(d)
{
  if ( d['sleep'] >= timeformat.parse('23:00'))
  {
    return '#FB6189';
  }
  if ( d['duration'] < (timeformat.parse('09:00')-timeformat.parse('0:00')))
  {
    return '#FB6189';
  }
  if ( d['duration'] >= (timeformat.parse('10:30')-timeformat.parse('0:00')))
  {
    return '#FEC233';
  }
  return '#4189C1';
}

var dateScale = d3.scale.ordinal();

// The x & y axes.
var xAxis = d3.svg.axis().orient("bottom").scale(xScale).ticks(12, d3.format(",d"));
var yAxis = d3.svg.axis().scale(yScale).orient("left").tickFormat(timeformat);

// Create the SVG container and set the origin.
var svg = d3.select(root).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Add the x-axis.
var xAxisSelection = svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

// Add the y-axis.
var yAxisSelection = svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);


// Add the year label; the value is set on transition.
var label = svg.append("text")
    .attr("class", "year label")
    .attr("text-anchor", "end")
    .attr("y", height - 16)
    .attr("x", width)
    .text('');

  // Load the data.
function update(data)
{
  raw = data.toList();
  // A bisector since many nation's data is sparsely-defined.
  var bisect = d3.bisector(function(d) { return d[0]; });
  raw.forEach(function(d)
  {
    d['日付'] = dateformat(dateformat.parse(d['日付']));
    d['就寝時間'] = timeformat(timeformat.parse(d['就寝時間']));
    d['起床時間'] = timeformat(timeformat.parse(d['起床時間']));
  });

  days = raw.map(function(d){return d['日付'];}).filter(function(d,i,self){return i==self.indexOf(d);});
  names = raw.map(function(d){return d['名前'];}).filter(function(d,i,self){return i==self.indexOf(d);});
  today = days[0];

  data = [];
  names.forEach(function(name)
  {
    var datum = [];
    var hisData = raw.filter(function(d){return d['名前']==name;});
    days.forEach(function(day)
    {
      var row = hisData.filter(function(d){return d['日付']==day});
      if (row.length > 0)
      {
        row = row[0];
        var duration = (timeformat.parse('24:00')-timeformat.parse(row['就寝時間'])) + (timeformat.parse(row['起床時間']) - timeformat.parse('0:00'));
        var sleep = timeformat.parse(row['就寝時間']);
        var date = dateformat(dateformat.parse(day));
        var wellness = 'good';  // @@ define wellness
        datum.push({name:name,duration:duration,sleep:sleep,wellness:wellness});
      }
    })
    data.push(datum);
  });

  xScale.domain(names);
  yScale.domain(d3.extent(raw.map(function(d){return timeformat.parse(d['就寝時間']);})));
  radiusScale.domain([d3.min(
    data.map(function(d){return d3.min(d3.values(d).map(function(dd){return dd.duration;}));})
  ),d3.max(
    data.map(function(d){return d3.max(d3.values(d).map(function(dd){return dd.duration;}));})
  )]);
  dateScale.domain(days).range(d3.range(0,days.length));

  xAxisSelection.call(xAxis);
  yAxisSelection.call(yAxis);


  // Add a dot per nation. Initialize the data at 1800, and set the colors.

  var dot = svg.append("g")
    .attr("class", "dots")
    .selectAll(".dot")
      .data(data)
      .enter().append("circle")
        .attr("class", "dot")
        .style('stroke','none')
        .style("fill", function(d) { return colorScale(color(d)); })
        .call(position);

  // Add a title.
  dot.append("title")
    .text(function(d) { return d.name; });
  label.text(today);

  // Add an overlay for the year label.
  var box = label.node().getBBox();

  var overlay = svg.append("rect")
      .attr("class", "overlay")
      .attr("x", box.x)
      .attr("y", box.y)
      .attr("width", box.width)
      .attr("height", box.height);
  label.text(today);

  var interactionScale = d3.scale.linear()
    .domain(d3.extent(days.map(function(d){return dateformat.parse(d);})))
    .range([box.x + 10, box.x + box.width - 10])
    .clamp(true);

  svg.transition().duration(10);


  overlay
    .on("mouseover", mouseover)
    .on("mouseout", mouseout)
    .on("mousemove", mousemove)
    .on("touchmove", mousemove);

  function mouseover() {
    label.classed("active", true);
  }

  function mouseout() {
    label.classed("active", false);
  }

  function mousemove() {
    next = dateformat(new Date(interactionScale.invert(d3.mouse(this)[0])));
    if (next != today)
    {
      today = next;
      label.text(today);
      dot.transition().call(position);
    }
  }

  // Positions the dots based on data.
  function position(dot) {
    dot .attr("cx", function(d) { return xScale(x(d)); })
        .attr("cy", function(d) { return yScale(y(d)); })
        .style("fill", function(d) { return colorScale(color(d)); })
        .attr("r", function(d) { return radiusScale(radius(d)); });
  }

}

