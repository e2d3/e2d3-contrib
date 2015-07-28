define([], function () {
  return {
    nested: function (data) {
      var nested = data.toNested();

      function convert(node) {
        node.label = node.name;
        node.values = node;
        if (node.children) {
          node.children.forEach(convert);
        }
      }

      convert(nested);

      return {
        targets: nested.header,
        data: nested
      };
    }
  };
});
