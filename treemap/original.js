var w = 550 - 10,
    h = 400 - 70,
    x = d3.scale.linear().range([0, w]),
    y = d3.scale.linear().range([0, h]),
    color = d3.scale.category20c(),
    root,
    node,
    target,
    treemap,
    svg;

function e2d3Show(updateFlag) {
    if (updateFlag) {
        e2d3.bind2Json(e2d3BindId, { dimension: "nested" }, show);
    } else {
        e2d3.addChangeEvent(e2d3BindId, e2d3Update, function () {
            e2d3.bind2Json(e2d3BindId, { dimension: "nested" }, show);
        });
    }
    
}
function e2d3Update(responce) {
    console.log("Begin e2d3Update");
    e2d3Show(true);
}

function show(data) {
    console.log("start show e");
    $("#e2d3-chart-area").empty();

    if (!target) {
        createTargetSelector(data.targets, { value: data.targets[0], type: "dropdown" });
        target = $("#e2d3-target-selector").val();
    } else {
        createTargetSelector(data.targets, { value: target, type: "dropdown" });
    }

    treemap = d3.layout.treemap()
    .round(false)
    .size([w, h])
    .sticky(true)
    .value(function (d) {return d.values[target]; });

    svg = d3.select("#e2d3-chart-area").append("div")
        .attr("class", "chart")
        .style("width", w + "px")
        .style("height", h + "px")
      .append("svg:svg")
        .attr("width", w)
        .attr("height", h)
      .append("svg:g")
        .attr("transform", "translate(.5,.5)");

    node = root = data.data;

    var nodes = treemap.nodes(root)
        .filter(function (d) { return !d.children; });

    var cell = svg.selectAll("g")
        .data(nodes)
      .enter().append("svg:g")
        .attr("class", "cell")
        .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
        .on("click", function (d) { return zoom(node == d.parent ? root : d.parent); });

    var colorChartUl;
    cell.append("svg:rect")
        .attr("width", function (d) { return d.dx - 1; })
        .attr("height", function (d) { return d.dy - 1; })
        .style("fill", function (d) {
            var colr = color((d.parent.parent && d.parent.parent.label == "root") ? d.parent.label : d.label);
            
            if ((d.parent.parent && d.parent.parent.label == "root")) {
                if (colorChartUl) {
                    var cc = [];
                    var clist = $(colorChartUl).children();
                    $(colorChartUl).children().each(function () {
                        cc.push($(this).html());
                    });
                    if (cc.indexOf(d.parent.label) == -1) {
                       $(colorChartUl).append($("<li>").addClass("color-chart-li").css({ "color": colr, "font-size": "1.2em" }).html(d.parent.label));
                    }
                } else {
                    colorChartUl = $("<ul>").addClass("list-inline");
                    $(colorChartUl).append($("<li>").addClass("color-chart-li").css({ "color": colr, "font-size": "1.2em" }).html(d.parent.label));
                    $("#e2d3-chart-area").append(colorChartUl);
                }
            }
            
            return colr;
        });

    cell.append("svg:text")
        .attr("x", function (d) { return d.dx / 2; })
        .attr("y", function (d) { return d.dy / 2; })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function (d) { return d.label; })
        .style("opacity", function (d) { d.w = this.getComputedTextLength(); return d.dx > d.w ? 1 : 0; });

    d3.select(window).on("click", function () { zoom(root); });

    d3.select("select").on("change", function () {
        treemap.value(size).nodes(root);
        zoom(node);
    });
};


function size(d) {
    return d.values[$("#e2d3-target-selector").val()];
}

function count(d) {
    return 1;
}

function zoom(d) {
    var kx = w / d.dx, ky = h / d.dy;
    x.domain([d.x, d.x + d.dx]);
    y.domain([d.y, d.y + d.dy]);

    var t = svg.selectAll("g.cell").transition()
        .duration(d3.event.altKey ? 7500 : 750)
        .attr("transform", function (d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

    t.select("rect")
        .attr("width", function (d) { return kx * d.dx - 1; })
        .attr("height", function (d) { return ky * d.dy - 1; })

    t.select("text")
        .attr("x", function (d) { return kx * d.dx / 2; })
        .attr("y", function (d) { return ky * d.dy / 2; })
        .style("opacity", function (d) { return kx * d.dx > d.w ? 1 : 0; });

    node = d;
    d3.event.stopPropagation();
}
