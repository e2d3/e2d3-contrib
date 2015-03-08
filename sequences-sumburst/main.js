define(['d3', 'e2d3old', 'original'], function (d3, e2d3old, original) {
  return function (node, baseUrl) {
    return {
      update: function (data) {
        show(e2d3old.nested(data));
      }
    };
  };
});
