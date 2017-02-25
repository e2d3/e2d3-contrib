//# require=d3

/* global d3 */

var dim = { width: root.clientWidth, height: root.clientHeight };
var margin = { top: 30, bottom: 50, left: 50, right: 20 };
var inputHeight = 20;
dim.graphWidth = dim.width - margin.left - margin.right;
dim.graphHeight = dim.height - margin.top - margin.bottom;

var prev, next, trans;

d3.select('body').on('keydown', function () {
  if (d3.event.which === 39) {
    next();
  }
  if (d3.event.which === 37) {
    prev();
  }
});

var time = 0;

var optimizeArrange = function(m, x, y) {
  // [radius, NCol, Nrow]
  if (x * m <= y) {
    return [x/2, 1, m];
  }
  if (x/m > y) {
    return [y/2, m, 1];
  }
  var rng = [1, m];
  while (rng[1] - rng[0] > 1) {
    var mid = Math.floor((rng[1] + rng[0])/2);
    var d = x/mid;
    if (Math.ceil(m/mid) * d < y) {
      rng[1] = mid;
    } else {
      rng[0] = mid;
    }
  }
  return [x/rng[1] * 0.5, rng[1], Math.ceil(m/rng[1])];
};

function update(data) {
  d3.select(root).selectAll('*').remove();

  var svg = d3.select(root).append('svg')
    .attr({ width: dim.width, height: dim.height })
    .style({ padding: 0 });

  var axisLayer = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  var graphLayer = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  var inputLayer = svg.append('g')
    .attr('transform', 'translate(0,' + (dim.height - inputHeight) + ')');

  var labels = data[0].slice(1);
  var times = data.slice(1).map(function(v) {return v[0];});
  var inputScale = d3.scale.ordinal()
    .rangeBands([0, dim.width]).domain(d3.range(times.length));
  var cursor = inputLayer.append('rect')
    .attr('width', inputScale.rangeBand())
    .attr('height', inputHeight)
    .attr('x', 0).attr('y', 0)
    .style('fill', '#000');
  var timeButtonContainer = inputLayer.selectAll('g')
    .data(times).enter().append('g')
    .attr('transform', function(d, i) {
      return 'translate(' + inputScale(i) + ',0)';
    }).on('click', function(d, i) {
      trans(i);
    });
  timeButtonContainer.append('rect')
    .attr('width', inputScale.rangeBand())
    .attr('height', inputHeight)
    .attr('x', 0).attr('y', 0)
    .style('fill', 'rgba(0, 0, 0, 0)')
    .style('stroke-width', 1)
    .style('stroke', '#000');
  var buttonLabels = timeButtonContainer.append('text')
    .attr('x', inputScale.rangeBand()*0.5)
    .attr('y', inputHeight-2)
    .attr('text-anchor', 'middle')
    .style('fill', function(d, i) {
      return (i==time)?'#FFF':'000';
    }).style('font-size', inputHeight-4)
    .style('font', '"Lucida Grande", Helvetica, Arial, sans-serif')
    .text(function(d) {return d;});
  var counts = data.slice(1).map(function(v) {
    var obj = {};
    labels.forEach(function(label, i) {
      obj[label] = +v[i+1];
    });
    return obj;
  });
  var maxBar = d3.max(counts.map(function(tmp) {
    return d3.max(d3.values(tmp));
  }));

  var denominator = Math.ceil(maxBar / 500);
  if (denominator > 1) {
    counts = counts.map(function(v) {
      var obj = {};
      labels.forEach(function(label) {
        obj[label] = Math.ceil(v[label] / denominator);
      });
      return obj;
    });
    maxBar = Math.ceil(maxBar / denominator);
  }

  var colorScale = d3.scale.category10().domain(labels);
  var xScale = d3.scale.ordinal()
    .rangeBands([0, dim.graphWidth], 0.2)
    .domain(labels);
  var params = optimizeArrange(maxBar, xScale.rangeBand(), dim.graphHeight);
  var radius = params[0];
  var nCol = params[1];
  var nRow = params[2];
  var yScale = d3.scale.ordinal()
    .rangePoints([dim.graphHeight, dim.graphHeight - nRow * radius * 2], 0)
    .domain(d3.range(nRow));
  var xLocalScale = d3.scale.ordinal()
    .rangeBands([0, xScale.rangeBand()])
    .domain(d3.range(nCol));

  var xAxis = d3.svg.axis().orient('bottom').scale(xScale);
  var yAxis = d3.svg.axis().orient('left').scale(yScale)
    .tickValues(d3.range(nRow).filter(function(d) {return d%Math.ceil(nRow / (dim.graphHeight/14)) === 0;}))
    .tickFormat(function(d) {return denominator * (d*nCol);});

  axisLayer.append('g')
    .attr('transform', 'translate(' + 0 + ',' + dim.graphHeight + ')')
    .attr('class', 'axis')
    .call(xAxis);
  axisLayer.append('g')
    .attr('transform', 'translate(' + 0 + ',' + 0 + ')')
    .attr('class', 'axis')
    .call(yAxis);

  axisLayer.selectAll('.axis text')
    .style('font-size', 14)
    .style('font', '"Lucida Grande", Helvetica, Arial, sans-serif');
  axisLayer.selectAll('.axis path.domain')
    .style('fill', 'none')
    .style('stroke', '#000')
    .style('shape-rendering', 'crispEdges');
  axisLayer.selectAll('.axis line')
    .style('fill', 'none')
    .style('stroke', '#000')
    .style('shape-rendering', 'crispEdges');

  if (denominator > 1) {
    var legend = axisLayer.append('g')
      .attr('class', 'legend')
      .attr('transform', 'translate(-20,-10)');
    legend.append('circle')
      .attr({r: radius, fill: '#888', stroke: 'none'});
    legend.append('text')
      .attr({x: 5, y: 4, 'font-size': 12, 'font-family': '"Lucida Grande", Helvetica, Arial, sans-serif'})
      .text('=' + denominator);
  }
  var labelMax = {};
  labels.forEach(function(label) {
    labelMax[label] = d3.max(counts, function(d) {return d[label];});
  });

  var displayData = labels.map(function(label) {
    return {label: label, mat: d3.range(labelMax[label]).map(function(d) {
      return d3.range(times.length).map(function(t) {
        return [d, d < counts[t][label]];
      });
    })};
  });

  var dotContainers = graphLayer.selectAll('g')
    .data(displayData).enter().append('g')
    .attr('transform', function(d) {return 'translate(' + xScale(d.label) + ',0)';})
    .style('fill', function(d) {return colorScale(d.label);});
  var dots = dotContainers.selectAll('circle')
    .data(function(d) {return d.mat;})
    .enter().append('circle')
    .attr('r', function(d) {return d[time][1]?radius:0;})
    .attr('cx', function(d) {return xLocalScale(d[time][0] % nCol) + radius;})
    .attr('cy', function(d) {
      return d[time][1]?
        (yScale(Math.floor(d[time][0] / nCol))+yScale.rangeBand()-radius):
        (yScale(Math.floor(d[time][0] / nCol))+yScale.rangeBand()-radius - 16 * radius);
    });

  var delayMax = 500;
  var duration = 1000;
  trans = function(t) {
    var pastTime = time;
    time = t;
    dots.filter(function(d) {return d[time][1] && !d[pastTime][1];}).transition()
      .delay(function(){return Math.random() * delayMax;})
      .duration(duration)
      .attr('r', radius)
      .attr('cy', function(d) {
        return (yScale(Math.floor(d[time][0] / nCol))+yScale.rangeBand()-radius);
      });
    dots.filter(function(d) {return !d[time][1] && d[pastTime][1];}).transition()
      .delay(function(){return Math.random() * delayMax;})
      .duration(duration)
      .attr('r', 0)
      .attr('cy', function(d) {
        return (yScale(Math.floor(d[time][0] / nCol))+yScale.rangeBand()-radius - 16 * radius);
      });

    cursor.transition()
      .duration(duration + delayMax)
      .attr('x', inputScale(time));
    buttonLabels.transition()
      .duration(duration + delayMax)
      .style('fill', function(d, i) {return (i===time)?'#FFF':'#000';});
  };

  prev = function() {
    if (time - 1 < 0) {return;}
    trans((times.length + time - 1) % times.length);
  };
  next = function() {
    if ((time + 1) == times.length) {return;}
    trans((time + 1) % times.length) ;
  };
}

update;
