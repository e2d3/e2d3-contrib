//# require=d3,jquery

var margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = root.clientWidth - margin.left - margin.right,
    height = root.clientHeight - margin.top - margin.bottom,
    imageSise = width * 0.2,
    images = ["pig","fish","cow","cabbage","bird"];
    chartWidth = width * 0.5
    chartHeight = 300;

var color = d3.scale.category10();
//image
var imageBox = d3.select(root).append("div")
    .style("display","table")
    .style("width", width + "px")
    .style("margin","10px auto");

d3.select(root).append("div")
    .attr("id","bigImageBox")
    .style("height", chartHeight + "px")
    .style("width", (width * 0.3) + "px");
d3.select(root).append("div")
    .attr("id", "chartBox")
    .style("height", chartHeight + "px")
    .style("width", chartWidth + "px");

images.forEach(function(d){
    imageBox.append("div")
    .style("display","table-cell")
    .style("width", imageSise + "px")
    .style("height", "100px")
    .style("background-image",'url("images/'+ d +'.svg")')
    .attr("class","imageBox hide " + d)
    .attr("id", d)
});

//chart
    var x = d3.scale.ordinal()
            .rangeRoundBands([0, chartWidth], .1);
    var y = d3.scale.linear()
      .rangeRound([chartHeight, 0]);

    var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left');

var chart = d3.select("#chartBox").append('svg')
    .attr('width', chartWidth)
    .attr('height', chartHeight)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

function update(json) {
    //view food-images
    var header = json[0];
    var foods = [];
    var data = json.toList();

    data.forEach(function(d){
        foods.push(d[header[3]]);
    });
    foods = foods.filter(function (x, i, self) {
            return self.indexOf(x) === i;
        });
    //console.log(foods);
    //if(!foods) return;
    foods.forEach(function(d){
        console.log(d3.select("." + d));
        $("." + d).removeClass('hide');
    });

    $(document).on("click", ".imageBox", function(){
        extract(this,data,header);
    });
}

function extract(food, data, header){
    var id = $(food).attr("id");
    var values = [];
    data = data.filter(function(d){
        return (d[header[3]] == id);
    })
    data.forEach(function(d){
        values.push(d[header[2]]);
    })

    if($("#bigImageBox").children().length > 0){
        $("#bigImageBox").empty().css({"left":'-300px'});
    }
    $("#bigImageBox").animate({left:'0px'}, {queue: false, duration: 500});
    $("#bigImageBox").append($("<img>").attr("src","images/"+ id +".svg"));

  x.domain(data.map(function (d) { return d[header[1]]; }));
  y.domain([0, d3.max(values)]);
  color.domain(data.map(function (d) { return d[header[1]]; }));

  var setup = function (selection) {
    selection
        .attr('class', 'bar')
        .attr('x', function (d) { return x(d[header[1]]); })
        .attr('y', function (d) { return y(d[header[2]]); })
        .attr('height', function (d) { console.log(d[header[2]]); return chartHeight - y(d[header[2]]); })
        .attr('width', x.rangeBand())
        .style('fill', function (d) { return color(d[header[1]]); });
  }

  chart.selectAll('.axis').remove();
  chart.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + chartHeight + ')')
      .call(xAxis);

  chart.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
    .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text(header[0]);

  rect = chart.selectAll('.bar').data(data);
  rect.transition().duration(500).call(setup);

  rect.enter().append('rect').call(setup);

  rect.exit().remove();

}