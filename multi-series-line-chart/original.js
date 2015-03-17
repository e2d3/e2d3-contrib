/*
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
*/
var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y%m%d").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.temperature); });

var svg = d3.select("#e2d3-chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
//    $("#e2d3-chart-area").empty();

  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

  data.forEach(function(d) {
    d.date = parseDate(d.date);
  });

  var cities = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.date, temperature: +d[name]};
      })
    };
  });

  x.domain(d3.extent(data, function(d) { return d.date; }));

  y.domain([
    d3.min(cities, function(c) { return d3.min(c.values, function(v) { return v.temperature; }); }),
    d3.max(cities, function(c) { return d3.max(c.values, function(v) { return v.temperature; }); })
  ]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Temperature (ºF)");

  var city = svg.selectAll(".city")
      .data(cities)
    .enter().append("g")
      .attr("class", "city");

  city.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.name); });

  city.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
      .attr("x", 3)
      .attr("dy", ".35em")
      .text(function(d) { return d.name; });
};



/*

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
*/

