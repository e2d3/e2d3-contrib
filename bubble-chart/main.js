define(['e2d3bridge', 'original'], function (bridge, original) {
  return function (node, baseUrl) {
    return {
      update: function (data) {
        show(data.toList());
      }
    };
  };
});
