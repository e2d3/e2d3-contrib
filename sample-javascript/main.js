define(['d3', 'topojson'], function (d3, topojson) {
  return {
    render: function (node, data, baseUrl) {
      var width = node.clientWidth;
      var height = node.clientHeight;

      if (!d3.select(node).select('svg').empty()) {
        var oldwidth = d3.select(node).select('svg').attr('width');
        var oldheight = d3.select(node).select('svg').attr('height');
        if (+width != +oldwidth || +height != +oldheight) {
          d3.select(node).select('svg').remove();
        }
      }

      if (d3.select(node).select('svg').empty()) {
        var svg = d3.select(node)
          .append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('style', 'display: block; margin: auto;');
        var projection = d3.geo.mercator()
          .center([136, 35])
          .scale(1200)
          .translate([width / 2, height / 2]);
        var path = d3.geo.path()
          .projection(projection);

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
        });
      }
    }
  }
});
