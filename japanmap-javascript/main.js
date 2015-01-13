define(['d3', 'topojson'], function (d3, topojson) {
  return function (node, baseUrl) {
    /*
     * private variable
     */
    var _data = null;

    /*
     * constructor
     */
    var _initialize = function () {
      var width = node.clientWidth;
      var height = node.clientHeight;

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
        if (_data) {
          exports.update(_data);
        }
      });
    };

    /*
     * destructor
     */
    var _dispose = function () {
      d3.select(node).select('svg').remove();
    };

    /*
     * execute
     */
    _initialize()

    /*
     * export
     */
    var exports = {
      /**
       * (Required) called on data updated.
       *
       * @param data: ChartData
       */
      update: function (data) {
        _data = data;

        var map = data.toMap();
        var values = map.values();

        var color = d3.scale.linear()
          .domain([d3.min(values), d3.max(values)])
          .range(['#ffffff', '#ff0000'])
          .interpolate(d3.interpolateLab);

        var initLabel = '2011年';

        d3.select(node)
          .selectAll('svg .states')
          .attr('fill', function (d) {
            if (map[d.properties.nam_ja] && $.isNumeric(map[d.properties.nam_ja][initLabel])) {
              return color(+map[d.properties.nam_ja][initLabel]);
            } else {
              return '#ffffff';
            }
          });
      },
      /**
       * (Optional) called on window resized.
       */
      resize: function() {
        _initialize();
        _dispose();
      }
    };

    return exports;
  };
});
