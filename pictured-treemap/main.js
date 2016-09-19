//# require=d3

var labels = [];
var selected = "2011";
var margin = { top: 20, right: 100, bottom: 20, left: 100 },
    width = root.clientWidth - margin.left - margin.right,
    height = 350,
    term,
    isImg = false;

var color = d3.scale.category10();

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
            .attr('class','list-inline')
            .style('width','100%');

function update(org) {
  div.selectAll('.node').remove();
  LD.selectAll('.labels').remove();

  var list = org.toList();
  var header = list.header;
  if (!header.some(function(value) { return value == selected; })) {
      selected = header[1];
  }
  term = header[0];
  if(header[header.length - 1] == 'image'){
    isImg = true;
  }
  if(isImg){
    labels = header.slice(1, header.length - 1);
  }else{
    labels = header.slice(1, header.length);
  }

  var labelCount = labels.length;
  var labelWidth = width/labelCount;
  var fontSize = (labelWidth*0.3 < 12) ? '12px' : labelWidth*0.3+'px';

  LD.selectAll('li')
    .data(labels)
    .enter()
    .append('li')
    .attr('class','labels')
    .style({
      "width": labelWidth-10 + "px",
      'float': "left"
    })
    .append('a')
    .style({
      "text-align": "center",
      "color"  : "#999999",
      "font-size": fontSize
    })
    .text(function(d){
      return d;
    }).on("click", function(d){
        LD.selectAll('li a').classed('active', false);
        selected = this.innerText;
        d3.select(this).classed('active', true);
        div.selectAll(".node")
        .data(treemap.nodes)
        .call(position)
        .text(function(d) { return d[term]; });
    })
    .classed('active', function(d){
        if(d == selected) return 'active';
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
          return color(d[term]);
      })
      .style("background-image", function(d){
        if(isImg && d['image']){
          var rgx = /^(http|https):/;
          var url = d['image'];
          if(rgx.test(d['image'])){
            return 'url("' + d['image'] + '")';
          }else{
            return 'url("' + baseUrl + '/images/' + d['image'] + '")';
          }
        }
        return '';
      })
      .style("background-size", "cover")
      .style("background-position","center")
      .style("line-height", function(d){
        return d.dy + "px";
      })
      .text(function(d) { return d[term]; })
    .duration(1000);
}
function colorPick() {
  var array = ["‪#ff1493","‪#14ff3c","‪#1463ff","‪#ffd814","‪#ff1414","‪#999999","‪#b3ffbf","‪#cc66ff","‪#80eaff","‪#ff8080"];
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
  return r[0];
}

