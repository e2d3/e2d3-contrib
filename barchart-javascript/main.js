//# require=d3

var width = 400;
var height = 300;

var svg = d3.select(root)
  .append('svg')
  .attr('width', width)
  .attr('height', height);

function update(data) {
  var list = data.transpose().toList(['name', 'value']);

  var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .2)
    .domain(list.map(function (d) { return d.name; }));
  var y = d3.scale.linear()
    .rangeRound([height, 0])
    .domain([0, d3.max(list.values())]);
  var color = d3.scale.category10()
    .domain(list.map(function (d) { return d.name; }))

  var setup = function (selection) {
    selection
      .attr('width', x.rangeBand())
      .attr('height', function (d) { return height - y(d.value); })
      .attr('x', function (d) { return x(d.name); })
      .attr('y', function (d) { return y(d.value); })
      .style('fill', function (d) { return color(d.name); });
  }

  rect = svg.selectAll('rect').data(list);

  rect.transition().duration(500).call(setup);

  rect.enter().append('rect').call(setup);

  rect.exit().remove();
}
