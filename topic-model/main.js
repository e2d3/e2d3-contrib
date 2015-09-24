//# require=d3
// var xMetrics = 'x-axis';
// var yMetrics = 'y-axis';

// var margin = { top: 20, right: 30, bottom: 30, left: 40 };
// var width = root.clientWidth - margin.left - margin.right;
// var height = root.clientHeight - margin.top - margin.bottom;

// var x = d3.scale.linear()
//   .rangeRound([0, width]);

// var y = d3.scale.linear()
//   .rangeRound([height, 0]);

// var color = d3.scale.category10();

// var xAxis = d3.svg.axis()
//     .scale(x)
//     .orient('bottom');

// var yAxis = d3.svg.axis()
//     .scale(y)
//     .orient('left')

// var chart = d3.select(root).append('svg')
//     .attr('width', root.clientWidth)
//     .attr('height', root.clientHeight)
//   .append('g')
//     .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

function update(data) {
  var list = data.toList();
  // var key = yMetrics;

  // console.log(d3.min(list, function (d) {
  //     // console.log(d);
  //     // console.log(d[xMetrics]);
  //       return parseInt(d[xMetrics], 10) - 10;
  //     }));
  // console.log(d3.max(list, function (d) {
  //     // console.log(d);
  //     // console.log(d[xMetrics]);
  //       return d[xMetrics];
  //     }));

  // x.domain([0, list.length]);

  // y.domain([0, 100]);

  
  // color.domain(list.map(function (d) { return d.name; }))

  // var setup = function (selection) {
  //   console.log('setup');
  //   console.log(selection);

  //   selection
  //       .attr('class', 'bubble')
  //       .attr('cx', function (d) {
  //         // console.log(d);
  //         // console.log(d[xMetrics]);
  //         return x(d[xMetrics]);
  //       })
  //       .attr('cy', function (d) {
  //         // console.log(d);
  //         // console.log(d[yMetrics]);
  //         return y(d[yMetrics]);
  //       })
  //       .style('fill', function (d) { return color(d.name); })
  //       .attr('r', 0)
  //       .transition()
  //       .duration(1000)
  //       .delay(function(d, i) {
  //           return  i * 20;
  //       })
  //       .ease('bounce')
  //       .attr('r', function (d) {
  //         return 30 + 'px';
  //       });
  // }

  var setText = function (selection) {
    console.log('setText');
    console.log(selection);

    // selection
    //     .data(function (d) {
    //       console.log(d);
    //       return {
    //         'text': d.text.split(" "),
    //         'topic': d.topic.split(" ")
    //       }
    //     })
    //     .append('span')
    //     .attr('class', function (d) {
    //       return 'topic' + d.topic;
    //     })
    //     .text( function (d) {
    //         // console.log(d);
    //         // console.log(d.text);
    //         return d;
    //      })
    //     .attr("width", "100px")
    //     .attr("font-family", "sans-serif")
    //     .attr("font-size", "10px")
    //     .attr("fill", "gray");
  }

  // chart.selectAll('.axis').remove();

  // chart.append('g')
  //     .attr('class', 'x axis')
  //     .attr('transform', 'translate(0,' + height + ')')
  //     .call(xAxis);

  // chart.append('g')
  //     .attr('class', 'y axis')
  //     .call(yAxis)
  //   .append('text')
  //     .attr('transform', 'rotate(-90)')
  //     .attr('y', 6)
  //     .attr('dy', '.71em')
  //     .style('text-anchor', 'end')
  //     .text(key);

  var topic = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  // rect = chart.selectAll('.bubble').data(list);
  var text = d3.select(root).selectAll('.div').data(list);

  // rect.transition().duration(500).call(setup);
  text.transition().duration(500).call(setText);

  // text.data(topic).enter().append('div').text(function(d){ return d});

  text.enter()
    .append('div')
    .style('display', 'flex')
    .append('div')
      .style('border', 'solid 2px #444')
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

  text
      .selectAll('select')
      .data(list)
      .enter()
      .append('div')
      .data(function (d) {
          console.log(d);
          console.log(d['text'].split(" "));
          console.log(d['topic'].split(" "));
          var strText = String(d.text).split(" ");
          var strTopic = String(d.topic).split(" ");

          str = d['text'].split(" ");
          top = d['topic'].split(" ");

          var array = d3.map(str, function (d, i) {
            return {
              'num': i,
              'text': d,
              'topic': top[i]
            }
          });

          console.log(array);

          return array
        })
      .selectAll('span')
        .enter()
        .append('span')
        .attr('class', function (d) {
          console.log(d);
          return 'topic' + d.topic;
        })
        .text( function (d) {
            // console.log(d);
            // console.log(d.text);
            return d;
         })

  text.exit().remove();
}
