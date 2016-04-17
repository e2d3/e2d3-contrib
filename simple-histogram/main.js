//# require=d3
var margin = { top: 20, right: 30, bottom: 30, left: 40 };
var width = root.clientWidth - margin.left - margin.right;
var height = root.clientHeight - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()

var chart = d3.select(root).append('svg')
    .attr('width', root.clientWidth)
    .attr('height', root.clientHeight)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


function update(data) {
  var list = data.transpose();
  var header = data.header;
  var key = list[1][0];
  target = list[1];
  target.splice(0, 1)
  target = target.map(function(d) {return Math.log10(parseInt(d))});
  console.log(target);

  if (!env.colors()) env.colors(d3.scale.category10().range());
  var color = d3.scale.ordinal().range(env.colors());
  var values = target;
  


  x.domain([0, d3.max(target, function(d) { return d; })])
  var list = d3.layout.histogram()
      .bins(x.ticks(100))
      (values);
  var y = d3.scale.linear()
    .domain([0, d3.max(list, function(d) { return d.y; })])
    .range([height, 0]);

  console.log(d3.max(list, function(d) { return d.x; }));

  var setup = function (selection) {
    selection
        .attr('class', 'bar')
        .attr('x', function (d) { return x(d.x); })
        .attr('y', function (d) { return y(d.y); })
        .attr('height', function (d) { return height - y(d.y); })
        .attr('width', x(list[0].dx) - 1)
        .style('fill', function (d) { return color(d.name); });
  }

  chart.selectAll('.axis').remove();

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');

  chart.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);


  var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')

  chart.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
    .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text(key);

  rect = chart.selectAll('.bar').data(list);

  rect.transition().duration(500).call(setup);

  rect.enter().append('rect').call(setup);

  rect.exit().remove();
}
