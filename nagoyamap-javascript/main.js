//# require=d3,topojson,jquery

var width = root.clientWidth;
var height = root.clientHeight;

var svg = d3.select(root).append('svg')
  .attr('width', width)
  .attr('height', height)
  .attr('style', 'display: block; margin: auto;');

svg.append('g')
  .attr('id', 'legend_group');

d3.json('nakaku.geojson', function (error, json) {
  var projection = d3.geo.mercator()
    .center(d3.geo.centroid(json))
    .scale(320000)
    .translate([width / 2, height / 2]);

    console.log(3000);

  var path = d3.geo.path()
    .projection(projection);

  svg.selectAll('path')
    .data(json.features)
    .enter().append('path')
    .attr('stroke', 'gray')
    .attr('stroke-width', '0.5')
    .attr('class', 'states')
    .attr('fill', '#ffffff')
    .attr('d', path);

  var zoom = d3.behavior.zoom().on('zoom', function(){
      projection.scale(scale * d3.event.scale);
      map.attr('d', path)
   });
  svg.call(zoom);

  reload();
});

function update(data) {
  var map = data.toMap({typed: true});
  var key = map.header[8];
  var values = map.values(key);

  if (!env.colors()) env.colors(['#ffffff', '#ff0000']);
  var color = d3.scale.linear()
    .domain(env.colorsDomain(0, d3.max(values)))
    .range(env.colors())
    .interpolate(d3.interpolateLab);

  if (svg.selectAll('path').empty())
    return false;

  svg.selectAll('path')
    .attr('fill', function (d) {
      if (map[d.properties.KEY_CODE] && $.isNumeric(map[d.properties.KEY_CODE][key])) {
        return color(+map[d.properties.KEY_CODE][key]);
      } else {
        return '#ffffff';
      }
    });
}
