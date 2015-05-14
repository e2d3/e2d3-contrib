//# require=d3,d3_layout_cloud

var margin = {top: 80, right: 80, bottom: 80, left: 80};
var width = root.clientWidth - margin.left - margin.right;
var height = root.clientHeight - margin.top - margin.bottom;


var svg = d3.select(root).append('svg')
    .attr('width', root.clientWidth)
    .attr('height', root.clientHeight);


var fill = d3.scale.category20();

function draw(words) {
  svg.select('g.word_cloud').remove();
  svg.append("g")
    .attr('class','word_cloud')
    .attr("transform", "translate("+(width/2+margin.left)+','+(height/2+margin.top)+")")
    .selectAll("text")
      .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size+'px'; })
        .style("font-family", "sans-serif")
        .style("fill", function(d, i) { return fill(i); })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" +d.x+','+ d.y + ") rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
}

function update(data)
{
  if (data.length <= 0)
  {
    return;
  }
  var data = data.toList();
  var szScale = d3.scale.sqrt().domain(d3.extent(data.map(function(d){return +d.value;}))).range([10,100]);
  d3.layout.cloud().size([width, height])
      .words(data.map(function(d){
        return {text: d.name, size: szScale(d.value)};
      }))
      .padding(4)
      .rotate(function() { return ~~(Math.random()*2) * 90; })
      .font("sans-serif")
      .fontSize(function(d) { return d.size; })
      .on("end", draw)
      .start();
};
