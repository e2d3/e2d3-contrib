//# require=d3

var margin = { top: 20, right: 30, bottom: 30, left: 40 };
var width = root.clientWidth - margin.left - margin.right;
var height = root.clientHeight - margin.top - margin.bottom;

var x = d3.scale.ordinal()
  .rangeRoundBands([0, width], .1)

var y = d3.scale.linear()
  .rangeRound([height, 0])

var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');

var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')

var chart = d3.select(root).append('svg')
    .attr('width', root.clientWidth)
    .attr('height', root.clientHeight)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

function update(data) {
  var list = data.transpose().toList({header: ['name', 'age'], typed: true});

  var key = 'age';

  if (!env.colors()) env.colors(d3.scale.category10().range());
  var color = d3.scale.ordinal().range(env.colors());

  x.domain(list.map(function (d) { return d.name; }));
  y.domain([0, d3.max(list.values('age'))]);
  color.domain(list.map(function (d) { return d.name; }))

  var setup = function (selection) {
    selection
        .attr('class', 'bar')
        .attr('x', function (d) { return x(d.name); })
        .attr('y', function (d) { return y(d[key]); })
        .attr('height', function (d) { return height - y(d[key]); })
        .attr('width', x.rangeBand())
        .style('fill', function (d) { return color(d.name); });
  }

  chart.selectAll('.axis').remove();

  chart.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);


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
