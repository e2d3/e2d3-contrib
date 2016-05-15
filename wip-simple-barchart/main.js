//# require=d3

var margin = { top: 30, right: 30, bottom: 40, left: 50 };
var width = 800//root.clientWidth - margin.left - margin.right;
var height = 500//root.clientHeight - margin.top - margin.bottom;

//window.resizeTo(1100, 600);

var x = d3.scale.ordinal()
  .rangeRoundBands([0, width], .6)

var y = d3.scale.linear()
  .rangeRound([height, 0])

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
  var list = data.toList({header: ['test', 'score'], typed: true});

  var key = 'score';

  if (!env.colors()) env.colors(d3.scale.category10().range());
  var color = d3.scale.ordinal().range(env.colors());

  x.domain(list.map(function (d) { return d.test; }));
  y.domain([0, d3.max(list.values('score'))]);
  color.domain(list.map(function (d) { return d.test; }))

  var setup = function (selection) {
    selection
        .attr('class', 'bar')
        .attr('x', function (d) { return x(d.test); })
        .attr('y', function (d) { return y(d[key]); })
        .attr('height', function (d) { return height - y(d[key]); })
        .attr('width', x.rangeBand())
        .style('fill', function (d) { return color(d.test); });


  }

  chart.selectAll('.axis').remove();



  chart.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
	  .append('text')
//      .attr('transform', 'rotate(-90)')
      .attr('x', 6)// x方向に移動。dx とすると相対位置。
      .style('text-anchor', 'start')
      .text(key);

  rect = chart.selectAll('.bar').data(list);

  rect.transition().call(setup);

  rect.enter().append('rect').call(setup);

  rect.exit().remove();
  
    chart.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);


	rect.enter()
		.append("text")	// text要素を追加
		.attr("class", "barNum")	// CSSクラスを指定
		.attr("x", function (d) { return x(d.test)+x.rangeBand()/2; })
				//"rangeBand" : https://github.com/d3/d3/wiki/Ordinal-Scales#ordinal_rangeBands
		.attr("y", function (d) { return y(d.score) + 20; })
		.text(function(d){	// データを表示する
			return d.score;
		});


}
