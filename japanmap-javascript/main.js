//# require=d3,topojson

var width = root.clientWidth;
var height = root.clientHeight;

var svg = d3.select(root).append('svg')
  .attr('width', width)
  .attr('height', height)
  .attr('style', 'display: block; margin: auto;');
var projection = d3.geo.mercator()
  .center([136, 35])
  .scale(height * 2.0)
  .translate([width / 2, height / 2]);
var path = d3.geo.path()
  .projection(projection);

svg.append('g')
  .attr('id', 'legend_group');

d3.json(baseUrl + '/japan.topojson', function (error, json) {
  svg.selectAll('.states')
    .data(topojson.feature(json, json.objects.japan).features)
  .enter().append('path')
    .attr('stroke', 'gray')
    .attr('stroke-width', '0.5')
    .attr('id', function (d) { return 'state_' + d.properties.id})
    .attr('class', 'states')
    .attr('fill', '#ffffff')
    .attr('d', path);

  reload();
});

function update(data) {
  var map = data.toMap();
  var values = map.values();

  var color = d3.scale.linear()
    .domain([d3.min(values), d3.max(values)])
    .range(['#ffffff', '#ff0000'])
    .interpolate(d3.interpolateLab);

  var initLabel = map.header[2];

  svg.selectAll('.states')
    .attr('fill', function (d) {
      if (map[d.properties.nam_ja] && $.isNumeric(map[d.properties.nam_ja][initLabel])) {
        return color(+map[d.properties.nam_ja][initLabel]);
      } else {
        return '#ffffff';
      }
    });
}
