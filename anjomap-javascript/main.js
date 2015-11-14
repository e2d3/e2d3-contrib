//# require=d3,topojson,jquery

var width = root.clientWidth;
var height = root.clientHeight;

var svg = d3.select(root).append('svg')
  .attr('width', width)
  .attr('height', height)
  .attr('style', 'display: block; margin: auto;');
var projection = d3.geo.mercator()
  .center([136, 35])
  .scale(Math.min(width, height) * 2.0)
  .translate([width / 2, height / 2]);
var path = d3.geo.path()
  .projection(projection);

svg.append('g')
  .attr('id', 'legend_group');

//d3.json('japan.topojson', function (error, json) {
  d3.json('anjo.topojson', function (error, json) {
  svg.selectAll('.states')
    .data(topojson.feature(json, json.objects.japan).features)
  .enter().append('path')
    .attr('stroke', 'gray')
    .attr('stroke-width', '3')
    .attr('id', function (d) { return 'state_' + d.properties.id})
    .attr('class', 'states')
    .attr('fill', '#ffffff')
    .attr('d', path);

  reload();
});

function update(data) {
  var map = data.toMap({typed: true});
  var key = map.header[2];
  var values = map.values(key);

  if (!env.colors()) env.colors(['#ffffff', '#ff0000']);
  var color = d3.scale.linear()
    .domain(env.colorsDomain(0, d3.max(values)))
    .range(env.colors())
    .interpolate(d3.interpolateLab);

  if (svg.selectAll('.states').empty())
    return false;

  svg.selectAll('.states')
    .attr('fill', function (d) {
      if (map[d.properties.nam_ja] && $.isNumeric(map[d.properties.nam_ja][key])) {
        return color(+map[d.properties.nam_ja][key]);
      } else {
        return '#ffffff';
      }
    });
}
