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
    });})
    .filter(function(v) {
      return !v.every(function(d) {return d===null;});
    });
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
      if (v[i] !== null) {
        if (tmp[v[i]] === void 0) {
          tmp[v[i]] = 0;
        }
        ++tmp[v[i]];
      }
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

  var cx = function(d) {
    if (d.indices[time] < 0) {return 0;}
    return xScale(d.labels[time]) +xLocalScale(d.indices[time]%nCol) + radius;
  };
  var cy = function(d) {
    if (d.indices[time] < 0) {return 0;}
    return yScale(Math.floor(d.indices[time]/nCol))+yScale.rangeBand()-radius;
  };

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

  mat = mat.map(function(v) {
    return {
      labels: v,
      indices: v.map(function(d) {return (d==null)?null:-1;})
    };
  });
  var matRef = [];
  mat.forEach(function(d) {matRef.push(d);});
  var matRefLock = null;
  var alterMatRef = function(f) {
    if (matRefLock === null) {
      matRefLock = f;
    }
    if (matRefLock === f) {
      f();
      matRefLock = null;
      return;
    } else {
      return setTimeout(function() {alterMatRef(f);}, 200);
    }
  };

  var optimize = function() {
    var fill_slots = function(label, idx, slots, mat) {
      if (slots.every(function(b) {return !b;})){return;}
      var focus = [];
      slots.forEach(function(b, j) {
        if (b) {
          focus.push(j);
        }
      });
      if (focus.length === 0) {return;}
      mat.forEach(function(d) {
        d.priority = 0.0;
        slots.forEach(function(b, j) {
          if (d.labels[j] == label && d._indices[j] == -1) {
            if (b) {
              d.priority += 1.0;
            } else {
              d.priority -= (0.99/slots.length);
            }
          }
        });
      });
      mat = mat.filter(function(d) {
        return !d._indices.every(function(dd) {return dd!==-1;});
      })
      .sort(function(a, b) {
        return (a.priority == b.priority)?0:((a.priority<b.priority)?1:-1);
      });
      for (var k in mat) {
        if (slots.every(function(b, j) {
          return (!b) || ((mat[k].labels[j] == label) && (mat[k]._indices[j] == -1));
        })) {
          slots.forEach(function(b, j) {
            if (b) {
              mat[k]._indices[j] = idx;
            }
          });
          return;
        }
      }
      slots.forEach(function(b, j) {
        if (b && mat[0].labels[j] == label && mat[0]._indices[j] == -1) {
          slots[j] = false;
          mat[0]._indices[j] = idx;
        }
      });
      fill_slots(label, idx, slots, mat);
    };
    mat.forEach(function(d) {
      d.priority = 0.0;
      d._indices = d.labels.map(function(d) {return (d==null)?null:-1;});
    });
    labels.forEach(function(label) {
      var totalIndices = times.map(function(t, i) {return counts[i][label]||0;});
      d3.range(d3.max(totalIndices)).forEach(function(idx) {
        var slots = totalIndices.map(function(i) {return i > idx;});
        fill_slots(label, idx, slots, mat);
      });
    });
    alterMatRef(function() {
      mat.forEach(function(d) {
        d.indices = d._indices;
        delete d.priority;
        delete d._indices;
      });
    });
  };

  var drawChart = function() {
    var dots = graphLayer.selectAll('circle')
      .data(matRef).enter().append('circle');
    dots.filter(function(d) {return d.labels[time] === null;})
      .attr('r', 0)
      .style('fill', '#FFF');
    dots.filter(function(d) {return d.labels[time] !== null;})
      .attr('r', radius)
      .attr('cx', cx)
      .attr('cy', cy)
      .style('fill', function(d) {return colorScale(d.labels[time]);});

    var delayMax = 500;
    var duration = 1000;
    trans = function(t) {
      time = t;
      dots.filter(function(d) {return d.labels[time] === null;}).transition()
        .delay(function(){return Math.random() * delayMax * 0.5;})
        .duration(duration * 0.5)
        .attr('r', 0)
        .style('fill', '#FFF');
      dots.filter(function(d) {return d.labels[time] !== null;}).transition()
        .delay(function(){return Math.random() * delayMax;})
        .duration(duration)
        .attr('r', radius)
        .attr('cx', cx)
        .attr('cy', cy)
        .style('fill', function(d) {return colorScale(d.labels[time]);});
      cursor.transition()
        .duration((duration + delayMax)/2)
        .attr('x', inputScale(time));
      buttonLabels.transition()
        .duration((duration + delayMax)/2)
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
  };

  if (mat.length * times.length > 2000) {
    alterMatRef(function() {
      times.forEach(function(t, i) {
        var indices = {};
        labels.forEach(function(label) {indices[label] = 0;});
        mat.forEach(function(d) {
          if (d.labels[i] !== null) {
            d.indices[i] = indices[d.labels[i]]++;
          }
        });
      });
    });
    setTimeout(optimize, 100);
    alterMatRef(drawChart);
  } else {
    optimize();
    drawChart();
  }
}

update;
