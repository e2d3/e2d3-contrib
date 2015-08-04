//# require=d3,crossfilter,dc

'use strict';

var margin = { top: 20, right: 30, bottom: 30, left: 40 };

var monthNames =  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function update(data) {
  d3.select(root).selectAll('*').remove();

  var list = data.toList({ typed: true });

  var cf = crossfilter(Array.prototype.slice.call(list, 0));

  var datename = list.header[0];

  createChart(['分布'], 'years', function (key) {
    var xKey = list.header[2];
    var yKey = list.header[1];

    var dimension = cf.dimension(function (d) { return d[datename].getFullYear(); });
    var group = dimension.group()
      .reduce(
        function(p, v) {
          ++p.count;
          p.x += v[xKey];
          p.y += v[yKey];
          return p;
        },
        function(p, v) {
          --p.count;
          p.x -= v[xKey];
          p.y -= v[yKey];
          return p;
        },
        function() { return { count: 0, x: 0, y: 0 }; }
      );

    var chart = dc.bubbleChart(this)
      .width(this.clientWidth)
      .height(this.clientHeight)
      .margins(margin)
      .dimension(dimension)
      .group(group)
      .colorAccessor(function (d) { return Math.floor((d.key - 1900) / 10); })
      .keyAccessor(function (d) { return d.value.count > 0 ? d.value.x / d.value.count : null; })
      .valueAccessor(function (d) { return d.value.count > 0 ? d.value.y / d.value.count : null; })
      .radiusValueAccessor(function (d) { return d.value.count; })
      .x(d3.scale.linear().domain(d3.extent(list, function (d) { return d[xKey]; })))
      .y(d3.scale.linear().domain(d3.extent(list, function (d) { return d[yKey]; })))
      .r(d3.scale.linear().domain([1, 12]))
      .elasticX(true)
      .elasticY(true)
      .xAxisPadding('5%')
      .yAxisPadding('5%')
      .minRadiusWithLabel(0)
      .maxBubbleRelativeSize('0.01')
      .renderHorizontalGridLines(true)
      .renderVerticalGridLines(true);

    return chart;
  });

  createChart(['データ数'], 'count', function (key) {
    var dimension = cf.dimension(function (d) {
      var m = d[datename].getMonth();
      return ('0' + m).slice(-2) + '.' + monthNames[m];
    });
    var group = dimension.group();

    var chart = dc.rowChart(this)
      .width(this.clientWidth)
      .height(this.clientHeight)
      .margins(margin)
      .dimension(dimension)
      .group(group)
      .label(function (d) { return d.key.split('.')[1]; })
      .labelOffsetY(12);

    chart.xAxis().ticks(4);

    return chart;
  });

  createChart(list.header.slice(1, 2), 'months', function (key) {
    var dimension = cf.dimension(function (d) {
      var m = d[datename].getMonth();
      return ('0' + m).slice(-2) + '.' + monthNames[m];
    });
    var group = dimension.group()
      .reduce(
        function(p, v) { ++p.count; p.total += v[key]; return p; },
        function(p, v) { --p.count; p.total -= v[key]; return p; },
        function() { return { count: 0, total: 0 }; }
      );

    var chart = dc.rowChart(this)
      .width(this.clientWidth)
      .height(this.clientHeight)
      .margins(margin)
      .dimension(dimension)
      .group(group)
      .valueAccessor(function (d) { return d.value.count > 0 ? d.value.total / d.value.count : null; })
      .label(function (d) { return d.key.split('.')[1]; })
      .labelOffsetY(12);

    chart.xAxis().ticks(4);

    return chart;
  });

  createChart(list.header.slice(1), 'dimension', function (key) {
    var extent = d3.extent(list, function (d) { return d[key]; });

    var scale = d3.scale.linear().domain(extent).nice(20);
    var ticks = scale.ticks(20);
    var step = ticks[1] - ticks[0];

    var rounding = function (d) { return  d[key] !== '' ? Math.round(d[key] / step) * step : Number.NEGATIVE_INFINITY; };

    var dimension = cf.dimension(rounding);
    var group = dimension.group().reduceSum(function (d) { return d[key] !== '' ? 1 : 0; });

    scale = d3.scale.linear().domain([scale.domain()[0] - step, scale.domain()[1] + step]);

    var chart = dc.barChart(this)
      .width(this.clientWidth)
      .height(this.clientHeight)
      .margins(margin)
      .dimension(dimension)
      .group(group)
      .elasticY(false)
      .centerBar(true)
      .gap(1)
      .round(rounding)
      .x(scale)
      .xUnits(function (start, end, xDomain) { return (end - start) / step; })
      .renderHorizontalGridLines(true);

    chart.xAxis().ticks(20);

    return chart;
  });

  dc.renderAll();

  // Default transition duration is 750ms
  // teke shot after 1sec
  setTimeout(onready, 1000);
  return false;
}

function filter(group, f) {
  return {
    all: function () {
      return group.all().filter(function (d) {
        return f(d.value);
      });
    }
  };
}

function createChart(names, classname, render) {
  var dim = d3.select(root).selectAll('.' + classname)
      .data(names)
    .enter().append('div')
      .attr('class', classname);

  dim.append('div')
      .attr('class', 'title')
      .text(function (d) { return d + ' '; })
    .append('a')
      .attr('href', 'javascript:')
      .text('reset');

  dim.append('div')
      .attr('id', function (d, i) { return 'chart' + Math.floor(Math.random() * 100); })
      .attr('class', 'chart')
      .each(function (d) {
        var chart = render.call(this, d);
        d3.select(this.parentNode).select('a')
            .on('click', function (d) {
              chart.filterAll();
              dc.redrawAll();
            });
      });
}
