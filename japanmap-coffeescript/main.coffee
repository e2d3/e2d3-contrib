define ['d3', 'topojson'], (d3, topojson) ->
  (node, baseUrl) ->
    ###
    # constructor
    ###
    _initialize = (data) ->
      width = node.clientWidth
      height = node.clientHeight

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
        exports.update data if data

    ###
    # destructor
    ###
    _dispose = () ->
      d3.select(node).select('svg').remove()

    ###
    # execute
    ###
    _initialize()

    ###
    # export
    ###
    exports =
      ###*
      # (Required) called on data updated.
      #
      # @param data: ChartData
      ###
      update: (data) ->
        map = data.toMap()
        values = map.values()

        color = d3.scale.linear()
          .domain [d3.min(values), d3.max(values)]
          .range ['#ffffff', '#ff0000']
          .interpolate d3.interpolateLab

        initLabel = '2011年'

        d3.select(node)
          .selectAll('svg .states')
            .attr 'fill', (d) ->
              if (map[d.properties.nam_ja] && $.isNumeric(map[d.properties.nam_ja][initLabel]))
                color +map[d.properties.nam_ja][initLabel]
              else
                '#ffffff'

      ###*
      # (Optional) called on window resized.
      ###
      resize: (data) ->
        _dispose()
        _initialize(data)

    exports
