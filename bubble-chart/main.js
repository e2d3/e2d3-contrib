//# require=d3
var xMetrics = 'sunshine_duration';
var yMetrics = 'wind_speed';
var zMetrics = 'temperature';

var margin = { top: 20, right: 30, bottom: 30, left: 40 };
var width = root.clientWidth - margin.left - margin.right;
var height = root.clientHeight - margin.top - margin.bottom;

var x = d3.scale.linear()
  .rangeRound([0, width]);

var y = d3.scale.linear()
  .rangeRound([height, 0]);

var color = d3.scale.category10();

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
  var list = data.toList();
  console.log(list);

  var key = yMetrics;

  x.domain([
      d3.min(list, function (d) {
      // console.log(d);
      // console.log(d[xMetrics]);
        return d[xMetrics];
      }), 
      d3.max(list, function (d) {
      // console.log(d);
      // console.log(d[xMetrics]);
        return d[xMetrics];
      })
    ]);

  y.domain([
    d3.min(list.values(yMetrics)),
    d3.max(list.values(yMetrics))
  ]);

  zSizeMin = d3.min(list.values(zMetrics));
  zSizeMax = d3.max(list.values(zMetrics));

  color.domain(list.map(function (d) { return d.name; }))

  var setup = function (selection) {
    console.log('setup');
    console.log(selection);

    selection
        .attr('class', 'bubble')
        .attr('cx', function (d) {
          console.log(d);
          return x(d[xMetrics]);
        })
        .attr('cy', function (d) {
          console.log(d);
          return y(d[yMetrics]);
        })
        .style('fill', function (d) { return color(d.name); })
        .attr('r', 0)
        .transition()
        .duration(1000)
        .delay(function(d, i) {
            return  i * 20;
        })
        .ease('bounce')
        .attr('r', function (d) {
          return 30 * ((d[zMetrics] - zSizeMin) / zSizeMax) + 'px';
        });
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

  rect = chart.selectAll('.bubble').data(list);

  rect.transition().duration(500).call(setup);

  rect.enter().append('circle')
      .on('mouseover', function (d) {
            d3.select(this)
                .transition()
                .duration(500)
                .style('fill', 'orange')
        })
        .on('mouseout', function (d) {
            d3.select(this)
                .transition()
                .duration(500)
                .style('fill', function (d) { return color(d.name); });
        }).call(setup);

  rect.exit().remove();
}
