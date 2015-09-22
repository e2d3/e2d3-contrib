//# require=d3
var margin = { top: 50, right: 30, bottom: 30, left: 100 };
var width = root.clientWidth - margin.left - margin.right;
var height = root.clientHeight - margin.top - margin.bottom;
var legendHeight = 60;

var x = d3.scale.ordinal()
  .rangeRoundBands([0, width], .1)

var y = d3.scale.linear()
  .rangeRound([height, 0]);

var color = d3.scale.category10();

var base = d3.select(root)
    .append("section")
    .attr("id", "mainFrame");

var legendArea  = base.append("div")
    .attr("id", "legend-area")
    .style({
        'height': function() {
            return legendHeight + 'px';
        },
        'border': 'solid 1px #222',
        'text-align': 'left',
        'padding-left': '10px',
        'width': '100%'
    });

var chartArea = base.append('svg')
    .attr('width',  width)
    .attr('height', root.clientHeight - margin.bottom - legendHeight)

var chart = chartArea.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var color = d3.scale.ordinal()
    .range(["#d6616b", "#3182bd", "transparent"]);

var carrerColor = {
            'ドコモ': '#C10026',
            'au': '#E14100',
            'ソフトバンク': '#A7ADB1'
        };

var cfg = {
    radius: 5,
    w: 300,
    h: 300,
    factor: 1,
    factorLegend: .85,
    levels: 3,
    maxValue: 0,
    radians: 2 * Math.PI,
    opacityArea: 0.00,
    ToRight: 5,
    TranslateX: 150,
    TranslateY: 30,
    ExtraWidthX: 100,
    ExtraWidthY: 120,
    color: color
};

var colHeaderLength = 2;

var rowNestedNum = 3;
var colNestedNum = 3;
var selectedRow = 0;
var selectedCol = 0;
var legendArray = [];
var seriesArray = [];

var getPositionX = function (i) {
    // console.log(colHeaderLength + selectedCol + i * rowNestedNum);
    return colHeaderLength + selectedCol + i * rowNestedNum;
}

var getPositionY = function (i) {
    return selectedCol + i * colNestedNum;
}

function getLength (array) {
    var count = 0;
    console.log(array);
    for (var i in array) {
        count++;
        if (count > colHeaderLength) {
            legendArray.push(i);
        }
    }
    return count;
}

var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);

function update(data) {
    // console.log(data);
    var list = d3.nest()
        .key(function(d) { return d[0]; })
        .entries(data);

    console.log(list[0]);
    var legend = data.toList();
    
    console.log(list);
    list.splice(0, 1);
    console.log(list);
    // console.log(list[0].values.length);
    // console.log(list[0].values);

    for (var i = 0; i < list[0].values.length; i++) {
        console.log(list[0].values[i][1]);
        seriesArray.push(list[0].values[i][1]);
    }

    console.log(seriesArray);

    d3.select('#legend-area')
        .append('select')
        .on('change', function () {
            var selectedIndex = d3.select(this).property('selectedIndex');
            var data = d3.select(this).selectAll('option')[0][selectedIndex].__data__;
            console.log(selectedIndex);
            selectedRow = selectedIndex;
            drawChart(list);
        })
        .selectAll('option')
        .data(seriesArray)
        .enter()
        .append('option')
        .text(function (d) {
            return d;
        });




    rowNestedNum = list[0].values.length;

    rowNestedNum = getLength(legend[0]) - colNestedNum;
    console.log(colNestedNum);
    console.log(legendArray);

    // for(var i = 0; i < legend.length; i++) {
    //     console.log(legend);
    // }

    drawChart(list);

    console.log("-------------");

    var copyRight = d3.select(root).append("div");

    copyRight.style({
        'height': '20px',
        'text-align': 'left',
        'padding-left': '10px',
        'width': '100%'
    })
    .text("Presented by gooスマホ部")
    .style("color", "gray");
}

function drawChart(list) {
    var key = 'value';
    var total = list.length;

    x.domain(list.map(function (d, i) {
        // console.log(d);
        if (i > 0) {
            // console.log(d.key);
            return d.key;
        }
    }));
    y.domain([0, d3.max(function (d) {
            // console.log(d);
            return list.values('axis');
        }
    )]);


    for (var num = 0; num < legendArray.length; num++) {
        cfg.maxValue = Math.max(cfg.maxValue, d3.max(list, function(i){
            console.log(i.values);
            if (i.values[selectedRow][getPositionX(num)] > 0) {
                // console.log(getPositionY(selectedRow));
                console.log(i.values[selectedRow][getPositionX(num)]);
                return i.values[selectedRow][getPositionX(num)];
            }
        }));
    }
    
    chart.selectAll('g').remove();
    var g = chart.append('g');


    for(var j=0; j<cfg.levels-1; j++){
        var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
        g.selectAll(".levels")
            .data(list)
            .enter()
            .append("svg:line")
            .attr("x1", function(d, i){
                var x1 = levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));
                // console.log('x1 = ', x1);
                return x1; 
            })
            .attr("y1", function(d, i){
                var y1 = levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));
                // console.log('y1 = ', y1);
                return y1; 
            })
            .attr("x2", function(d, i){
                var x2 = levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));
                // console.log('x2 = ', x2);
                return x2;
            })
            .attr("y2", function(d, i){
                var y2 = levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));
                // console.log('y2 = ', y2);
                return y2;
            })
            .attr("class", "line")
            .style("stroke", "grey")
            .style("stroke-opacity", "0.8")
            .style("stroke-width", "3px")
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
        .attr("x2", function(d, i){
            var x2 = cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));
            // console.log("x2 = ", x2);
            return x2;
        })
        .attr("y2", function(d, i){
            var y2 = cfg.w/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));
            // console.log("x2 = ", y2);
            return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));
        })
        .attr("class", "line")
        .style("stroke", "gray")
        .style("stroke-width", "2px");

    // 系列の名前を出力
    axis.append("text")
        .attr("class", "legend")
        .text(function(d){
            // ここで系列の名前出力
            // console.log(d);
            return d.key;
        })
        .style("font-family", "sans-serif")
        .style("font-size", "10px")
        .attr("text-anchor", "middle")
        .attr("dy", "1.5em")
        .attr("transform", function(d, i){return "translate(0, 00)"})
        .attr("x", function(d, i){
            return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);
        })
        .attr("y", function(d, i){
            return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);
        });

    for (var num = 0; num < legendArray.length; num++) {
        list.forEach(function(y, x, z){
            var dataValues = [];
            g.selectAll(".nodes")
                .data(z, function(j, i){
                    var value = j.values[selectedRow][getPositionX(num)];
                    
                    dataValues.push([
                        cfg.w/2*(1-(parseFloat(Math.max(value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)),
                        cfg.h/2*(1-(parseFloat(Math.max(value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
                    ]);
                });

            dataValues.push(dataValues[0]);
            
            g.selectAll(".area")
                .data([dataValues])
                .enter()
                .append("polygon")
                .attr("class", "radar-chart-serie")
                .style("stroke-width", "3px")
                .style("stroke-dasharray",  function () {
                    return num * 2 + ", " + num * 2;
                })
                .style("stroke", function(j, i){
                    // console.log(num);
                    // console.log(legendArray[num]);
                    return carrerColor[legendArray[num]];
                })
                .attr("points",function(d) {
                    var str="";
                    for(var pti=0;pti<d.length;pti++){
                        str=str+d[pti][0]+","+d[pti][1]+" ";
                    }
                    return str;
                })
                .style("fill", function(j, i){
                    // console.log(num);
                    // console.log(legendArray[num]);
                    return carrerColor[legendArray[num]];
                })
                // .on('mouseover', function (d){
                //     z = "polygon."+d3.select(this).attr("class");
                //     g.selectAll("polygon")
                //         .transition(200)
                //         .style("fill-opacity", 0.1);
                //     g.selectAll(z)
                //         .transition(200)
                //         .style("fill-opacity", .7);
                // })
                // .on('mouseout', function(){
                //     g.selectAll("polygon")
                //         .transition(200)
                //         .style("fill-opacity", cfg.opacityArea);
                // })
                .style("fill-opacity", cfg.opacityArea);
        });
    }

}
