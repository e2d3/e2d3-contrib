//# require=d3,numeric

'use strict';

var margin = { top: 20, right: 30, bottom: 30, left: 40 };
var width = root.clientWidth - margin.left - margin.right;
var height = root.clientHeight - margin.top - margin.bottom;

var x = d3.scale.linear()
  .range([0, width])

var y = d3.scale.linear()
  .range([height, 0])

var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');

var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left');

var svg = d3.select(root).append('svg')
    .attr('width', root.clientWidth)
    .attr('height', root.clientHeight)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

function update(data) {
  var list = data.toList({typed: true});
  var key = list.header[0];

  var matrix = data.slice(1).map(function (d) {
    return d.slice(1).map(parseFloat);
  });

  var pc = pca(scale(matrix, true, true));

  list.forEach(function (d, i) {
    d.pc1 = pc[i][0];
    d.pc2 = pc[i][1];
  });

  if (!env.colors()) env.colors(d3.scale.category10().range());
  var color = d3.scale.ordinal().range(env.colors());

  x.domain(d3.extent(list, function (d) { return d.pc1; })).nice();
  y.domain(d3.extent(list, function (d) { return d.pc2; })).nice();

  // render dots
  var setup = function (selection) {
    selection
        .attr('class', 'label')
        .attr('x', function(d) { return x(d.pc1); })
        .attr('y', function(d) { return y(d.pc2); })
        .text(function(d) { return d[key]; });
  }

  var dots = svg.selectAll('.label').data(list);
  dots.transition().duration(500).call(setup);
  dots.enter().append('text').call(setup);
  dots.exit().remove();

  // render axises
  svg.selectAll('.axis').remove();

  svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
    .append('text')
      .attr('class', 'label')
      .attr('x', width)
      .attr('y', -6)
      .style('text-anchor', 'end')
      .text('PC1');

  svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
    .append('text')
      .attr('class', 'label')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('PC2')
}

function mean(X){
    var T = numeric.transpose(X);
    return T.map(function (row) { return numeric.sum(row) / X.length; });
}

function std(X){
  var m = mean(X);
  return numeric.sqrt(mean(numeric.mul(X,X)), numeric.mul(m,m));
}

function scale(X, center, scale){
  // compatible with R scale()
  if (center){
      var m = mean(X);
      X = X.map(function(row){ return numeric.sub(row, m); });
  }

  if (scale){
      var s = std(X);
      X = X.map(function(row){ return numeric.div(row, s); });
  }
  return X;
}

function pca(X) {
  var USV = numeric.svd(X);
  var U = USV.U;
  var S = numeric.diag(USV.S);

  return numeric.dot(U, S);
}
