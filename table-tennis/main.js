//# require=d3

var margin = { top: 20, right: 30, bottom: 60, left: 80 };
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

var backgroundImage = d3.select(root)
  .append('div')
    .attr('class', 'background-image');

d3.select('.background-image')
  .append('img')
    .attr('src', baseUrl + '/man_left.png')
    .attr('class', 'man');

d3.select('.background-image')
  .append('img')
    .attr('src', baseUrl + '/table.png')
    .attr('class', 'table');

d3.select('.background-image')
  .append('img')
    .attr('src', baseUrl + '/man_right.png')
    .attr('class', 'man');

var chart = backgroundImage.append('svg')
    .attr('width', root.clientWidth)
    .attr('height', root.clientHeight)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

function update(data) {
    console.log(data);
}