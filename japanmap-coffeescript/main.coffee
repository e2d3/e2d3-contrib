## require=d3,topojson,jquery

width = root.clientWidth
height = root.clientHeight

svg = d3.select(root)
  .append 'svg'
    .attr 'width', width
    .attr 'height', height
    .attr 'style', 'display: block; margin: auto;'
projection = d3.geo.mercator()
  .center [136, 35]
  .scale Math.min(width, height) * 2.0
  .translate [width / 2, height / 2]
path = d3.geo.path()
  .projection(projection)

d3.json baseUrl + '/japan.topojson', (error, json) ->
  svg.selectAll '.states'
      .data topojson.feature(json, json.objects.japan).features
    .enter().append 'path'
      .attr 'stroke', 'gray'
      .attr 'stroke-width', '0.5'
      .attr 'id', (d) -> 'state_' + d.properties.id
      .attr 'class', 'states'
      .attr 'fill', '#ffffff'
      .attr 'd', path
  reload()

update = (data) ->
  _data = data

  map = data.toMap typed: true
  key = map.header[2]
  values = map.values(key)

  color = d3.scale.linear()
    .domain [d3.min(values), d3.max(values)]
    .range ['#ffffff', '#ff0000']
    .interpolate d3.interpolateLab

  return false if svg.selectAll('.states').empty()

  svg.selectAll('.states')
    .attr 'fill', (d) ->
      if (map[d.properties.nam_ja] && $.isNumeric(map[d.properties.nam_ja][key]))
        color +map[d.properties.nam_ja][key]
      else
        '#ffffff'
