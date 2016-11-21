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

  var times = data[0];
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
  var mat = data.slice(1)
    .map(function(v) {return v.map(function(d) {
      return (d.trim()=='' || d==null)?null:d;
    });});
  var labels = mat.map(function(d) {
    return d3.set(d.filter(function(dd) {
      return dd !== null;
    })).values();
  }).reduce(function(a, b) {
    return d3.set(a.concat(b)).values();
  }).sort();
  var counts = [];
  times.forEach(function(t, i) {
    var tmp = {};
    mat.forEach(function(v) {
      if (tmp[v[i]] === void 0) {
        tmp[v[i]] = 0;
      }
      ++tmp[v[i]];
    });
    counts.push(tmp);
  });
  var maxBar = d3.max(counts.map(function(tmp) {
    return d3.max(d3.values(tmp));
  }));

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
    .tickValues(d3.range(nRow).filter(function(d) {return d%1 === 0;}))
    .tickFormat(function(d) {return (d*nCol);});

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

  var countChanges = function(v) {
    var ret = 0;
    v.forEach(function(d, i) {
      if (d != v[(i+1) % v.length]) {
        ++ret;
      }
    });
    return ret;
  };
  mat = mat.map(function(d) {
    return {cc: countChanges(d), data: d};
  }).sort(function(a, b) {return (a.cc === b.cc)?0:((a.cc < b.cc)?-1:1);})
  .map(function(d) {return d.data;});

  var displayData = mat.map(function(d) {
    return times.map(function(t, i) {
      return {label: d[i]};
    });
  });

  times.forEach(function(t, i) {
    var indices = {};
    labels.forEach(function(label) {indices[label] = 0;});
    mat.forEach(function(d, j) {
      if (d[i] === null) {
        displayData[j][i].x = 0;
        displayData[j][i].y = 0;
        displayData[j][i].label = null;
      } else {
        var index = indices[d[i]]++;
        displayData[j][i].x = index % nCol;
        displayData[j][i].y = Math.floor(index / nCol);
      }
    });
  });
  var dots = graphLayer.selectAll('circle')
    .data(displayData).enter().append('circle');
  dots.filter(function(d) {return d[time].label === null;})
    .attr('r', 0)
    .style('fill', '#FFF');
  dots.filter(function(d) {return d[time].label !== null;})
    .attr('r', radius)
    .attr('cx', function(d) {return xScale(d[time].label) +xLocalScale(d[time].x) + radius;})
    .attr('cy', function(d) {return yScale(d[time].y)+yScale.rangeBand()-radius;})
    .style('fill', function(d) {return colorScale(d[time].label);});

  var delayMax = 500;
  var duration = 1000;
  trans = function(t) {
    time = t;
    dots.filter(function(d) {return d[time].label === null;}).transition()
      .delay(function(){return Math.random() * delayMax;})
      .duration(duration)
      .attr('r', 0)
      .style('fill', '#FFF');
    dots.filter(function(d) {return d[time].label !== null;}).transition()
      .delay(function(){return Math.random() * delayMax;})
      .duration(duration)
      .attr('r', radius)
      .attr('cx', function(d) {return xScale(d[time].label) +xLocalScale(d[time].x) + radius;})
      .attr('cy', function(d) {return yScale(d[time].y)+yScale.rangeBand()-radius;})
      .style('fill', function(d) {return colorScale(d[time].label);});
    cursor.transition()
      .duration(duration + delayMax)
      .attr('x', inputScale(time));
    buttonLabels.transition()
      .duration(duration + delayMax)
      .style('fill', function(d, i) {return (i===time)?'#FFF':'#000';});
  };

  prev = function() {
    trans((times.length + time - 1) % times.length);
  };
  next = function() {
    trans((time + 1) % times.length) ;
  };
}

update;
