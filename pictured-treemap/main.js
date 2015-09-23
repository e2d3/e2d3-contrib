//# require=d3

var labels = [];
var selected = "2011";
var margin = { top: 20, right: 100, bottom: 20, left: 100 },
    width = root.clientWidth - margin.left - margin.right,
    height = 350;

var color = d3.scale.category20c();

var treemap = d3.layout.treemap()
    .size([width, height])
    .value(function(d) {
     return d[selected];
   });

var div = d3.select(root).append("div")
    .style("position", "relative")
    .style("width", (width) + "px")
    .style("height", (height) + "px")
    .style('margin','20px auto')
    .attr("id", "main_chart");

var LD = d3.select(root).append("div")
        .style("position", "relative")
            .style("width", (width) + "px")
            .style("height", "100px")
            .style("margin","30px auto")
            .attr("id", "main_chart_area")
            .append('ul')
            .attr('class','list-inline');

function update(org) {
  div.selectAll('.node').remove();
  div.selectAll('.labels').remove();

  var list = org.toList();
  labels = org[0].slice(1,6);

  var labelCount = labels.length;
  var labelWidth = width/labelCount;
  console.log(labels);
  console.log(labelWidth);

  LD.selectAll('li')
    .data(labels)
    .enter()
    .append('li')
    .attr('class','labels')
    .style("width",labelWidth-20 + "px")
    .append('a')
    .style({
      "padding": "20px 0",
      "color"  : "#999999",
      "font-size": "48px"
    })
    .text(function(d){
      return d;
    }).on("click", function(d){
        selected = this.innerText;
        div.selectAll(".node")
        .data(treemap.nodes)
        .call(position)
        .text(function(d) { return d['Term']; });
    });

  var data  = { children: list };
  var node = div.datum(data).selectAll(".node")
      .data(treemap.nodes)
    .enter().append("div")
      .attr("class", "node")
      .call(position);
}

function position() {
  this.transition().style("left", function(d) { return d.x + "px"; })
    .style("top", function(d) {
      return d.y + "px";
    })
    .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
    .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; })
    .style("background-color", function(d) {
          return color(d['Term']);
      })
      .style("background-image", function(d){
        console.log(d.jpg)
         return 'url("' + baseUrl + '/images/' + d['jpg'] + '")'
      })
      .style("background-size", "cover")
      .style("background-position","center")
      .style("line-height", function(d){
        return d.dy + "px";
      })
      .text(function(d) { return d['Term']; })
    .duration(1000);
}
function colorPick() {
  var array = ["‪#‎F39E8E‬","‪#‎FBD2DA‬","‪#‎FDCC92‬","‪#‎F9E282‬","‪#‎C7E571‬","‪#‎9EE7D0‬","‪#‎C0E4E2‬","‪#‎A5E7ED‬","‪#‎A7C7ED‬","‪#‎D3D2FF‬"];
  var num = 1;

  var a = array;
  var t = [];
  var r = [];
  var l = a.length;
  var n = num < l ? num : l;   while (n-- > 0) {
    var i = Math.random() * l | 0;
    r[n] = t[i] || a[i];
    --l;
    t[i] = t[l] || a[l];
  }
  console.log(r[0] + '//')
  return r[0];
}

