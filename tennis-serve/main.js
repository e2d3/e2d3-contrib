function update(data) {
    draw(data.toList());
}

function draw(data){
var w = 3000;
var h = 3000;

var dataset = [
   [700, 240], [800, 230], [900, 230], [850, 290], [830, 240],
   [810, 250], [675, 240], [850, 250], [850, 280], [720, 280],
   [900, 260], [737, 293], [779, 290], [841, 253], [737, 237],
   [863, 301], [888, 262], [719, 229], [765, 204], [872, 301]
];

var margin = {
    top: 20,
    right: 80,
    bottom: 30,
    left: 50
};
//size
var width = root.clientWidth - margin.left - margin.right;
var height = root.clientHeight - margin.top - margin.bottom;
//draw background-image (should be called before base-svg creation)
d3.select(root).append('img')
    .attr({
        width: width,
        height: height,
        src: baseUrl + '/tennis-court.jpg',
    })
    .style({
        position: 'absolute',
        top: 0, //margin.top,
        left: 0, //margin.left
    });
//create base-svg
var svg = d3.select(root).append('svg')
    .attr({
        width: width,
        height: height
    })
    .style({
        position: 'absolute',
        top: 0, //margin.top,
        left: 0, //margin.left
    });
//var svg = d3.select('body')
//      .append("svg")
//      .attr("width", width)
//      .attr("height", height);


svg.selectAll("circle")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("cx", function(d) {
         return d[0];
      })
      .attr("cy", function(d) {
         return d[1];
      })
      .attr("r", function(d) {
         return 10;
      });

svg.selectAll("text")
      .data(dataset)
      .enter()
      .append("text")
      .text(function(d) {
         return d[0] + "," + d[1];
      })
      .attr("x", function(d) {
         return d[0];
      })
      .attr("y", function(d) {
         return d[1];
      })
      .attr("font-family", "sans-serif")
      .attr("font-size", "11px")
      .attr("fill", "red");
}
