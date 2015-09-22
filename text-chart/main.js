//# require=d3
var xMetrics = 'x-axis';
var yMetrics = 'y-axis';

var margin = { top: 20, right: 30, bottom: 30, left: 40 };
var width = root.clientWidth - margin.left - margin.right;
var height = root.clientHeight - margin.top - margin.bottom;

var x = d3.scale.linear()
  .rangeRound([0, width]);

var y = d3.scale.linear()
  .rangeRound([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');

var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')

var chart = d3.select(root).append('svg')
    .attr('width', root.clientWidth)
    .attr('height', root.clientHeight)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

function update(data) {
  var list = data.toList();
  var key = yMetrics;

  console.log(d3.min(list, function (d) {
      // console.log(d);
      // console.log(d[xMetrics]);
        return parseInt(d[xMetrics], 10) - 10;
      }));
  console.log(d3.max(list, function (d) {
      // console.log(d);
      // console.log(d[xMetrics]);
        return d[xMetrics];
      }));

  x.domain([
      d3.min(list, function (d) {
      // console.log(d);
      // console.log(d[xMetrics]);
        return parseInt(d[xMetrics],10) - 10;
      }), 
      d3.max(list, function (d) {
      // console.log(d);
      // console.log(d[xMetrics]);
        return parseInt(d[xMetrics],10) + 10;
      })
    ]);

  y.domain([
    d3.min(list, function (d) {
      // console.log(d);
      // console.log(d[xMetrics]);
        return parseInt(d[yMetrics],10) - 10;
      }), 
      d3.max(list, function (d) {
      // console.log(d);
      // console.log(d[xMetrics]);
        return parseInt(d[yMetrics],10) + 10;
      })
  ]);

  
  color.domain(list.map(function (d) { return d.name; }))

  var setup = function (selection) {
    console.log('setup');
    console.log(selection);

    selection
        .attr('class', 'bubble')
        .attr('cx', function (d) {
          // console.log(d);
          // console.log(d[xMetrics]);
          return x(d[xMetrics]);
        })
        .attr('cy', function (d) {
          // console.log(d);
          // console.log(d[yMetrics]);
          return y(d[yMetrics]);
        })
        .style('fill', function (d) { return color(d.name); })
        .attr('r', 0)
        .transition()
        .duration(1000)
        .delay(function(d, i) {
            return  i * 20;
        })
        .ease('bounce')
        .attr('r', function (d) {
          return 30 + 'px';
        });
  }

  var setText = function (selection) {
    console.log('setText');
    console.log(selection);

    selection
        .attr('class', 'text')

        .attr("x", function(d,i) { return x(d[xMetrics]); })
        .attr("y", function(d) { return y(d[yMetrics]); })
        .text( function (d) {
            console.log(d);
            console.log(d['政治家名']);
            return d['政治家名'];
         })
        .attr("font-family", "sans-serif")
        .attr("font-size", "20px")
        .attr("fill", "gray");
  }

  chart.selectAll('.axis').remove();

  chart.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

  chart.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
    .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text(key);

  rect = chart.selectAll('.bubble').data(list);
  text = chart.selectAll('.text').data(list);

  rect.transition().duration(500).call(setup);
  text.transition().duration(500).call(setText);

  // rect.enter().append('circle')
  //     .on('mouseover', function (d) {
  //           d3.select(this)
  //               .transition()
  //               .duration(500)
  //               .style('fill', 'orange')
  //       })
  //       .on('mouseout', function (d) {
  //           d3.select(this)
  //               .transition()
  //               .duration(500)
  //               .style('fill', function (d) { return color(d.name); });
  //       }).call(setup);
  
  text.enter()
    .append('text')
      .on('mouseover', function (d) {
            d3.select(this)
                .transition()
                .duration(500)
                .style('fill', 'orange')
        })
        .on('mouseout', function (d) {
            d3.select(this)
                .transition()
                .duration(500)
                .style('fill', function (d) { return color(d.name); });
        }).call(setText);

  rect.exit().remove();
}
