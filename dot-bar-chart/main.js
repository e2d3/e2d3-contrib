//# require=d3

var dim = { width: root.clientWidth, height: root.clientHeight };
var margin = { top: 10, bottom: 50, left: 50, right: 10 };
var inputHeight = 20;
var numberFormat = d3.format('.0f');
dim.graphWidth = dim.width - margin.left - margin.right;
dim.graphHeight = dim.height - margin.top - margin.bottom;


d3.select('body').on('keydown', function () {
    if (d3.event.which === 39) {
        next();
    }
    if (d3.event.which === 37) {
        prev();
    }
});

var svg = d3.select('#e2d3-chart-area').append('svg')
  .attr({ width: dim.width, height: dim.height })
  .style({ padding: 0 });

var axisLayer = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')').attr("id","g-axis-layer");
var graphLayer = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')').attr("id", "g-graph-layer");
var inputLayer = svg.append('g').attr('transform', 'translate(0,' + (dim.height - inputHeight) + ')').attr("id", "g-input-layer");

var xScale = d3.scale.ordinal().rangeBands([0, dim.graphWidth], 0.05);
var xLocalScale = d3.scale.ordinal();
var yScale = d3.scale.ordinal().rangePoints([dim.graphHeight, 0]);
var colorScale = d3.scale.category10();
var inputScale = d3.scale.ordinal().rangeBands([0, dim.width - margin.right]);

var xAxis = d3.svg.axis().orient('bottom').scale(xScale);
var yAxis = d3.svg.axis().orient('left').scale(yScale);

var xAxisObj = axisLayer.append('g')
  .attr('transform', 'translate(' + 0 + ',' + dim.graphHeight + ')')
  .attr('class', 'axis')
  .call(xAxis);
var yAxisObj = axisLayer.append('g')
  .attr('transform', 'translate(' + 0 + ',' + 0 + ')')
  .attr('class', 'axis')
  .call(yAxis);

axisLayer.selectAll('.axis text').style('font', '14px "Lucida Grande", Helvetica, Arial, sans-serif');
axisLayer.selectAll('.axis path.domain').style({ fill: 'none', stroke: '#000000', 'shape-rendering': 'crispEdges' });
axisLayer.selectAll('.axis line').style({ fill: 'none', stroke: '#000000', 'shape-rendering': 'crispEdges' });

var time = 0;
var radius = 3;
var mar = 0.6;
var barWidth = 16;

var auto = true;

var duration = 2000;
var delayMax = 1000;

var prev, next, trans;

prev = function () {
    trans(time - 1);
}

next = function () {
    trans(time + 1);
}

function update(data) {
    json = data.toMap({typed: true});

    var displaydata = [];
    var labels = json.keys;
    var parties = json.header;

    var partDict = {};
    parties.forEach(function (d, i) {
        partDict[d] = i;
    });
    var sums = {};
    var data = {};

    labels.forEach(function (label) {
        var r = [];
        parties.forEach(function (party) {
          r.push(+json[label][party]);
        });
        data[label] = r;
        sums[label] = d3.sum(data[label]);
    });

    var max = d3.max(labels.map(function (d) { return d3.max(data[d]); }));


    var nrow = Math.ceil(dim.graphHeight / (2 * (radius + mar)));
    barWidth = Math.ceil(max / nrow);
    yScale.domain(d3.range(nrow));
    yAxis.tickValues(d3.range(nrow).filter(function (d) { return d % 10 === 0; }));
    yAxis.tickFormat(function (d) { return (d * barWidth); });
    xScale.domain(parties.map(function (d, i) { return i; }));
    xAxis.tickFormat(function (d) { return parties[d]; });
    xAxisObj.call(xAxis);
    yAxisObj.call(yAxis);
    xLocalScale.rangeBands([0, xScale.rangeBand()]).domain(d3.range(barWidth));
    colorScale.domain(d3.range(parties.length));

    inputScale.domain(labels);
    var currentButton = inputLayer.append('rect')
      .attr('class', 'cursor')
      .attr({ x: 0, y: 0, height: inputHeight, width: inputScale.rangeBand() })
      .style('stroke', '#FFF')
      .style('stroke-width', 2)
      .style('fill', '#000');
    var buttons = inputLayer.selectAll('.button').data(labels).enter().append('g').attr('class', 'button')
      .attr('transform', function (d) { return 'translate(' + inputScale(d) + ',' + 0 + ')'; })
      .on('click', function () {
          var s = d3.select(this);
          trans(labels.indexOf(s.datum()));
      });
    buttons.append('rect')
      .attr({ x: 0, y: 0, height: inputHeight, width: inputScale.rangeBand() })
      .style('stroke', '#FFF')
      .style('stroke-width', 2)
      .style('fill', 'rgba(0,0,0,0.1)');
    buttons.append('text')
      .text(function (d) { return d; })
      .attr('x', function (d) { return inputScale.rangeBand() / 2; })
      .attr('y', 18)
      .style('fill', function (d, i) { return (i === 0) ? '#FFF' : '#000'; })
      .style('text-anchor', 'middle')
      .style('font', inputHeight + 'px "Lucida Grande", Helvetica, Arial, sans-serif');

    var summax = d3.max(labels.map(function (d) { return sums[d]; }));
    var displaydata = d3.range(summax).map(function (d) { return []; });
    var indexMargin = 0;
    parties.forEach(function (party, partyidx) {
        for (var i = 0; i < data[labels[0]][partyidx]; ++i) {
            displaydata[indexMargin + i].push({ label: partyidx, idx: i });
        }
        indexMargin += data[labels[0]][partyidx];
    });
    for (var i = indexMargin; i < summax; ++i) {
        displaydata[i].push({ label: null, idx: null });
    }

    d3.range(1, labels.length).forEach(function (idx) {
        var year = labels[idx];
        var lastyear = labels[idx - 1];
        var yearidx = idx;
        var pool = [];
        var unused = [];
        var keep = [];
        displaydata.forEach(function (d, i) {
            var copy = { label: d[yearidx - 1].label, idx: d[yearidx - 1].idx };
            d.push(copy);
            if (d[yearidx].label == null) {
                unused.push(i);
            }
            else {
                if (data[year][d[yearidx].label] <= d[yearidx].idx) {
                    pool.push(i);
                }
                else {
                    keep.push(i);
                }
            }
        });

        d3.shuffle(pool);
        if (sums[year] - sums[lastyear] > 0) {
            pool = pool.concat(unused.splice(0, sums[year] - sums[lastyear]));
            d3.shuffle(pool);
        }
        else {
            pool.splice(sums[year] - keep.length).forEach(function (d) {
                displaydata[d][yearidx] = { label: null, idx: null };
            });
            pool = pool.splice(0, sums[year] - keep.length);
        }
        var poolmargin = 0;

        parties.forEach(function (party) {
            if (data[year][partDict[party]] - data[lastyear][partDict[party]] > 0) {
                for (var i = 0; i < (data[year][partDict[party]] - data[lastyear][partDict[party]]) ; ++i) {
                    if (pool[poolmargin + i]) displaydata[pool[poolmargin + i]][yearidx] = { label: partDict[party], idx: i + data[lastyear][partDict[party]] };

                };
                poolmargin += data[year][partDict[party]] - data[lastyear][partDict[party]];
            }
        });

    });
    var votes = graphLayer.selectAll('.vote').data(displaydata).enter().append('circle')
      .attr('class', 'vote')
      .attr('r', radius)
      .attr('cx', function (d) { return ((d[time].label != null) ? (xScale(d[time].label) + xLocalScale(d[time].idx % barWidth) + radius + mar) : (dim.graphWidth / 2)); })
      .attr('cy', function (d) { return ((d[time].label != null) ? (yScale(Math.floor((d[time].idx + 0.1) / barWidth)) - radius - mar) : 0); })
      .style('opacity', function (d) { return (d[time].label != null) ? 0.8 : 0.0; })
      .style('fill', function (d) { return colorScale(d[time].label); });

    trans = function (to) {
        if (to === time || to < 0 || to >= labels.length) {
            return;
        }
        var current = time;
        time = to;
        yearTarget = labels[time];
        var votes = graphLayer.selectAll('.vote')
          .filter(function (d) { return d[current].label != d[time].label || d[current].idx != d[time].idx; })
          .transition()
          .duration(duration)
          .delay(function (d) { return Math.random() * delayMax; })
          .attr('cx', function (d) { return ((d[time].label != null) ? (xScale(d[time].label) + xLocalScale(d[time].idx % barWidth) + radius + mar) : (dim.graphWidth / 2)); })
          .attr('cy', function (d) { return ((d[time].label != null) ? (yScale(Math.floor((d[time].idx + 0.1) / barWidth)) - radius - mar) : 0); })
          .style('opacity', function (d) { return (d[time].label != null) ? 0.8 : 0.0; })
          .style('fill', function (d) { return colorScale(d[time].label); });

        inputLayer.select('.cursor').transition().duration(duration / 2)
          .attr('x', function (d) { return inputScale(labels[time]); });
        inputLayer.selectAll('.button text').transition().duration(duration / 2)
          .style('fill', function (d, i) { return (i === time) ? '#FFF' : '#000'; })
    }
};
