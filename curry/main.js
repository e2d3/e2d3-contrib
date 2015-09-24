//# require=d3

var margin = { top: 20, right: 30, bottom: 30, left: 40 };
var width = root.clientWidth - margin.left - margin.right;
var height = root.clientHeight - margin.top - margin.bottom;

var x = d3.scale.ordinal()
  .rangeRoundBands([0, width], .1)

var y = d3.scale.linear()
  .rangeRound([height, 0]);

var color = d3.scale.category10();

var chart = d3.select(root).append('svg')
    .attr('width', root.clientWidth)
    .attr('height', root.clientHeight)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var color = d3.scale.ordinal()
    .range(["#d6616b", "#3182bd", "transparent"]);

var cfg = {
    radius: 5,
    w: 300,
    h: 300,
    factor: 1,
    factorLegend: .85,
    levels: 3,
    maxValue: 0,
    radians: 2 * Math.PI,
    opacityArea: 0.2,
    ToRight: 5,
    TranslateX: 150,
    TranslateY: 30,
    ExtraWidthX: 100,
    ExtraWidthY: 120,
    color: color
};
var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);

function update(data) {
    var list = data.transpose().toList({header: ['axis', 'value'], typed: true});
    var key = 'value';
    var total = list.length;

    x.domain(list.map(function (d) {
        return d.name;
    }));
    y.domain([0, d3.max(list.values('axis'))]);


    cfg.maxValue = Math.max(cfg.maxValue, d3.max(list, function(i){
        return i.value;
    }));
    var g = chart.append('g');

    for(var j=0; j<cfg.levels-1; j++){
        var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
        g.selectAll(".levels")
            .data(list)
            .enter()
            .append("svg:line")
            .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
            .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
            .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
            .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
            .attr("class", "line")
            .style("stroke", "grey")
            .style("stroke-opacity", "0.75")
            .style("stroke-width", "0.3px")
            .attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
    }


    var axis = g.selectAll(".axis")
        .data(list)
        .enter()
        .append("g")
        .attr("class", "axis");
    axis.append("line")
        .attr("x1", cfg.w/2)
        .attr("y1", cfg.h/2)
        .attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
        .attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
        .attr("class", "line")
        .style("stroke", "grey")
        .style("stroke-width", "1px");

    axis.append("text")
        .attr("class", "legend")
        .text(function(d){return d.axis})
        .style("font-family", "sans-serif")
        .style("font-size", "15px")
        .attr("text-anchor", "middle")
        .attr("dy", "1.5em")
        .attr("transform", function(d, i){return "translate(0, -10)"})
        .attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
        .attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});

    list.forEach(function(y, x, z){
        var dataValues = [];
        g.selectAll(".nodes")
            .data(z, function(j, i){
                console.log(j);
                
                dataValues.push([
                    cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)),
                    cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
                ]);
            });

        dataValues.push(dataValues[0]);
        g.selectAll(".area")
            .data([dataValues])
            .enter()
            .append("polygon")
            .attr("class", "radar-chart-serie")
            .style("stroke-width", "2px")
            .style("stroke", cfg.color())
            .attr("points",function(d) {
                var str="";
                for(var pti=0;pti<d.length;pti++){
                    str=str+d[pti][0]+","+d[pti][1]+" ";
                }
                return str;
            })
            .style("fill", function(j, i){return cfg.color()})
            .style("fill-opacity", cfg.opacityArea)
            .on('mouseover', function (d){
                z = "polygon."+d3.select(this).attr("class");
                g.selectAll("polygon")
                    .transition(200)
                    .style("fill-opacity", 0.1);
                g.selectAll(z)
                    .transition(200)
                    .style("fill-opacity", .7);
            })
            .on('mouseout', function(){
                g.selectAll("polygon")
                    .transition(200)
                    .style("fill-opacity", cfg.opacityArea);
            });
    });
}
