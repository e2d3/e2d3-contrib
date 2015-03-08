define(['jquery', 'topojson', 'original'], function ($, topojson, original) {
  return function (node, baseUrl) {
    var _data = null;

    var _initialize = function () {
      console.log("Begin e2d3Show.");
      $('#chart-labels').remove();
      $(colorButtons).append([buttonBrue, buttonRed, buttonMix]);
      $('#e2d3-chart-area').append(colorButtons);

      d3.json(baseUrl + "/japan.topojson", function (error, o) {
        svg.selectAll(".states")
          .data(topojson.feature(o, o.objects.japan).features)
          .enter().append("path")
          .attr("stroke", "gray")
          .attr("stroke-width", "0.5")
          .attr("id", function(d) {return "state_" + d.properties.id; })
          .attr("class", 'states')
          .attr("fill","#fff")
          .attr("d", path);
        topo = o;

        if (_data) {
          exports.update(_data);
        }
      });
    };

    _initialize();

    var exports = {
      update: function (data) {
        _data = data;

        show(data.toMap(), topojson);
      }
    };

    return exports;
  };
});
