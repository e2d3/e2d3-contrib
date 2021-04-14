
//＃require=d3

// d3.v3
// http:/www.thepaper.cn,
// date 2021-01
// By The Paper data news team

// var root = document.getElementById("root");

function radial() {
    var domain = [0, 1],
        range = [0, 1];

    function scale(x) {
        var r0 = range[0] * range[0],
            r1 = range[1] * range[1];
        return Math.sqrt((x - domain[0]) / (domain[1] - domain[0]) * (r1 - r0) + r0);
    }

    scale.domain = function (_) {
        return arguments.length ? (domain = [+_[0], +_[1]], scale) : domain.slice();
    };

    scale.range = function (_) {
        return arguments.length ? (range = [+_[0], +_[1]], scale) : range.slice();
    };

    scale.ticks = function (count) {
        return d3.scale.linear().domain(domain).ticks(count);
    };

    scale.nice = function (count) {
        return d3.scale.linear().domain(domain).nice();
    };


    scale.tickFormat = function (count, specifier) {
        return d3.scale.linear().domain(domain).tickFormat(count, specifier);
    };

    return scale;
}
(d3.scale || (d3.scale = {})).radial = radial;


//margin
var margin = {
    top: 50,
    right: 60,
    bottom: 50,
    left: 60
};

// console.log(margin);
//size
var width = root.clientWidth - margin.left - margin.right;
var height = root.clientHeight - margin.top - margin.bottom;
var radius = Math.min(width, height) * 0.4;
var innerRadius = 0;
var outerRadius = Math.min(width, height) / 2;

// d3.csv("data.csv", function (error, data) {
//     update(data);
// });


function update(data) {

    // console.log(data)
    //数据转置
    // var data_title = data[0];
    // console.log(data_title);
    var new_data = [];
    for( i = 1; i < data.length; i++){
        var temp = {};
        for( j = 0; j < data[i].length; j++){
            temp[data[0][j]] = data[i][j]
        }
        new_data.push(temp)
    }
    // console.log(new_data)
    data = new_data;

    d3.select(root).selectAll('*').remove();

    for (var i = 0; i < data.length; i++) {
        var arrTitle = Object.keys(data[0]);//获取数据当表头
    }
    
    // console.log(arrTitle)

    var svg = d3.select(root).append('svg')
        .attr({
            width: root.clientWidth,
            height: root.clientHeight
        });

    g = svg.append("g").attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height/2+margin.top) + ")");

    var dataIntermediate = arrTitle.slice(1).map(function (c) {
        return data.map(function (d) {
            return {x: d[arrTitle[0]], y: Number(d[c])};
        });
    });

    var dataStackLayout = d3.layout.stack()(dataIntermediate);

    var color = d3.scale.ordinal()
    .domain(arrTitle.slice(1))
    .range(["#4e79a7","#f28e2c","#e15759","#76b7b2","#59a14f","#edc949","#af7aa1","#ff9da7","#9c755f","#bab0ab"])

    // console.log(arrTitle)

    var x = d3.scale.ordinal()
        .domain(dataStackLayout[0].map(function (d) {
            return d.x;
        }))
        .rangeBands([0, 2 * Math.PI], 0.05);

    var y = d3.scale.radial()
        .domain([0,
            d3.max(dataStackLayout[dataStackLayout.length - 1],
                    function (d) { return d.y0 + d.y;})
            ])
        .nice()
        .range([innerRadius, outerRadius]); 


    var label = g.append("g")
        .attr("class", "x_Tick")
        .selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .attr("text-anchor", "middle")
        .attr("transform", function(d) { 
            // console.log(data)
            return "rotate(" + ((x(d.key) + x.rangeBand() / 2) * 180 / Math.PI - 90) + ")translate(" + outerRadius + ",0)"; });

    label.append("line")
        .attr("x2", -outerRadius)
        .attr("stroke", "#ccc")
        .attr("stroke-opacity", 0.5);

    label.append("text")
        .attr("transform", function(d) { return (x(d.key) + x.rangeBand() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "rotate(90)translate(0,-9)" : "rotate(-90)translate(0,18)"; })
        .text(function(d) { 
            return d.key; });


    var arc = d3.svg.arc()
            .innerRadius(function(d) { return y(d.y0); })
            .outerRadius(function(d) { return y(d.y+d.y0); })
            .startAngle(function(d) { return x(d.x); })
            .endAngle(function(d) { return x(d.x) + x.rangeBand(); })
            .padAngle(0.01)
            .padRadius(innerRadius);
            
    // console.log(dataStackLayout)
    var layer = g.selectAll(".layer")
        .data(dataStackLayout)
        .enter().append("g")
        .attr("class", "layer")
        .style("fill", function (d, i) {
            return color(arrTitle[i+1]);
        });
   
    layer.selectAll("path")
        .data(function (d) {
            return d;
        })
        .enter()
        .append("path")
        .attr("d", arc);

    

    //参考线
    var yAxis = g.append("g")
        .attr("class", "y_Tick")
      .attr("text-anchor", "middle");

    var yTick = yAxis
        .selectAll("g")
        .data(y.ticks(10).slice(1))
        .enter().append("g");

    yTick.append("circle")
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .attr("stroke-opacity", 0.5)
        .attr("r", y);

    yTick.append("text")
        .attr("y", function(d) { return -y(d); })
        .attr("dy", "0.35em")
        .attr("fill", "none")
        .attr("stroke", "#fff")
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
        .text(y.tickFormat(10, "s"));

    yTick.append("text")
        .attr("y", function(d) { return -y(d); })
        .attr("dy", "0.35em")
        .text(y.tickFormat(10, "s"));
    

    var legend = svg.selectAll(".title_legend")
      .data(arrTitle.slice(1))
        .enter().append("g")
        .attr("class", "title_legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", root.clientWidth - 10 - 18)
        .attr("y", 10)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d,i){
            return color(d)
        });

    legend.append("text")
        .attr("x", root.clientWidth - 10 - 24)
        .attr("y", 9+10)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });
    
}


