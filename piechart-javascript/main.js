//# require=d3

var width = root.clientWidth;
var height = root.clientHeight;
var radius = Math.min(width, height) * 0.4;

var color = d3.scale.ordinal()
  .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var arc = d3.svg.arc()
  .outerRadius(radius)
  .innerRadius(radius * 0.2);

var pie = d3.layout.pie()
  .sort(null)
  .value(function (d) { return d['age']; });

var chart = d3.select(root).append('svg')
    .attr('width', width)
    .attr('height', height)
  .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

function update(data) {
  var list = data.transpose().toList({header: ['name', 'age'], typed: true});

  var setup = function (path, text) {
    path
      .attr('d', arc)
      .style('fill', function (d, i) { return color(i); });
    text
      .attr('transform', function (d) { return 'translate(' + arc.centroid(d) + ')'; })
      .attr('dy', '.35em')
      .style('text-anchor', 'middle')
      .text(function (d) { return d.data.name + ': ' + d.data.age; });
  };

  var aa = chart.selectAll('.arc').data(pie(list));

  aa.transition().duration(500).call(function (selection) {
    setup(selection.select('path'), selection.select('text'));
  });

  aa.enter().append('g').attr('class', 'arc').call(function (selection) {
    setup(selection.append('path'), selection.append('text'));
  });

  aa.exit().remove();
}
