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

function createTargetSelector(targets, options) {
    var box = $("<div>").attr("id","e2d3-target-selector-box");
    var group;
    if (!targets) {
        return;
    }
    switch (options.type) {
        case "dropdown":
            group = $("<select>").attr("id", "e2d3-target-selector");
            targets.forEach(function (d) {
                var t = $("<option>").html(d).val(d);
                $(group).append(t);
            });
            if (options.value) $(group).val(options.value);
            break;
        case "vertical":
            group = $("<div>").addClass("btn-group-vertical");
            targets.forEach(function (d) {
                var l = $("<label>").addClass("btn btn-default");
                var t = $("<input>").attr({ type: "radio" }).val(d);
                if (options.value && d === options.value) $(t).prop("checked", true);
                $(l).append(t);
                $(group).append(l);
            });
            break;
        case "slider":

            break;
        default:
    }
    $(box).append(group);
    if (targets.length === 1) $(box).hide();
    $("#e2d3-chart-area").prepend(box);

}
