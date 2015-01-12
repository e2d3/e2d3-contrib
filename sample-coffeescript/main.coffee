define ['d3', 'topojson'], (d3, topojson) ->
  render: (node, data, baseUrl) ->
    width = node.clientWidth
    height = node.clientHeight

    map = data.toMap()
    values = map.values()

    color = d3.scale.linear()
      .domain [d3.min(values), d3.max(values)]
      .range ['#ffffff', '#ff0000']
      .interpolate d3.interpolateLab

    update = () ->
      initLabel = '2011年'

      svg = d3.select(node).select('svg')

      svg.selectAll(".states")
        .attr 'fill', (d) ->
          if (map[d.properties.nam_ja] && $.isNumeric(map[d.properties.nam_ja][initLabel]))
            color +map[d.properties.nam_ja][initLabel]
          else
            '#ffffff'

    if !d3.select(node).select('svg').empty()
      oldwidth = d3.select(node).select('svg').attr 'width'
      oldheight = d3.select(node).select('svg').attr 'height'
      if +width != +oldwidth || +height != +oldheight
        d3.select(node).select('svg').remove()

    if d3.select(node).select('svg').empty()
      svg = d3.select(node)
        .append 'svg'
          .attr 'width', width
          .attr 'height', height
          .attr 'style', 'display: block; margin: auto;'
      projection = d3.geo.mercator()
        .center [136, 35]
        .scale 1200
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
        update()
    else
      update()
