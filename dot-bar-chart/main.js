define(['d3', 'original'], function (d3, original) {
  return function (node, baseUrl) {
    return {
      update: function (data) {
        d3.selectAll("#g-axis-layer g g").remove();
        d3.selectAll("#g-graph-layer *").remove();
        d3.selectAll("#g-input-layer *").remove();
        show(data.toMap());
      }
    };
  };
});
