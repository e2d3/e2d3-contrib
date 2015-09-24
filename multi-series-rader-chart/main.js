//# require=d3
function iframeResize(){
    var PageHight = document.body.scrollHeight + 0; // ページの高さを取得
    window.parent.document.getElementById('disp').style.height = PageHight + 'px'; // iframeの高さを変更
}

window.onload = iframeResize;


var margin = { top: 50, right: 30, bottom: 30, left: 50 };
var width = root.clientWidth - margin.left - margin.right;
var height = root.clientHeight - margin.top - margin.bottom;
var legendHeight = 44;
var selectButtonWidth = 100;

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
            'ソフトバンク': '#A7ADB1',
            'A社': '#C10026',
            'B社': '#E14100',
            'C社': '#A7ADB1'
        };

// var carrerColor 

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
// var metrics = ['下り速度（Mbps）', '上り速度（Mbps）', 'Ping（ms）']

var getPositionX = function (i, selectedCol) {
    // console.log(colHeaderLength + selectedCol + i * rowNestedNum);
    return 2 + selectedCol + i * rowNestedNum;
}

var getPositionY = function (i) {
    return selectedRow + i * colNestedNum;
}

function getLength (array) {
    var count = 0;
    console.log(array);
    for (var i in array) {
        count++;
        // if (count > colHeaderLength) {
        //     legendArray.push(i);
        // }
    }
    return count;
}

var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);

function update(data) {
    console.log(data);
    legendArray = [];
    metrics = [];
    seriesArray = [];

    var firstSeries = [];
    // for (var i = 0; i < data.length; i++) {
    //     if (data[i][0] == "グラフ") {
    //         if (data[i][1] == "会社名") {
    //             console.log(data[i][0]);
    //             console.log(data[i][1]);
    //             for (var j = 2; j < data[i].length; j++) {
    //                 console.log(data[i][j]);
    //                 firstSeries.push(data[i][j]);
    //             }
    //         }
    //     }
    // }

    var datalist = d3.nest()
        .key(function(d) { return d[0]; })
        .entries(data.transpose());

    var metricslist = d3.nest()
        .key(function(d) { return d[1]; })
        .entries(data.transpose());

    console.log(datalist);

    datalist.forEach(function (d) {
        if (d.key != '系列') {
            legendArray.push(d.key);
            // // metrics.push(d.values);
            // d.values.forEach(function (data) {
            //     console.log(data);
            // })
        }
    });

    metricslist.forEach(function (d) {
        if (d.key != '系列') {
            metrics.push(d.key);
            // // metrics.push(d.values);
            // d.values.forEach(function (data) {
            //     console.log(data);
            // })
        }
    });

    console.log(metrics);
    console.log(legendArray);

    // metrics = metric;

    var list = d3.nest()
        .key(function(d) { return d[0]; })
        .entries(data);

    console.log(list[0]);
    var legend = data.toList();
    
    console.log(list);
    list.splice(0, 1);
    console.log(list);
    list.reverse();
    // list = list.splice(0, 1);
    
    for (var i = 0; i < list[0].values.length; i++) {
        console.log(list[0].values[i][1]);
        seriesArray.push(list[0].values[i][1]);
    }

    console.log(seriesArray);

    rowNestedNum = list[0].values.length;

    colHeaderLength = getLength(legend[0]) - colNestedNum;
    console.log(colNestedNum);
    console.log(legendArray);

    d3.select('#legend-area').selectAll('select').remove();
    d3.select('#legend-area').selectAll('div').remove();

    d3.select('#legend-area')
        .append('select')
        .style('height', function () {
            return legendHeight + 'px';
        })
        .style('width', function () {
            return selectButtonWidth + 'px';
        })
        .on('change', function () {
            var selectedIndex = d3.select(this).property('selectedIndex');
            var data = d3.select(this).selectAll('option')[0][selectedIndex].__data__;
            console.log(selectedIndex);
            selectedRow = selectedIndex;
            drawChart(list, selectedCol, selectedRow);
        })
        .selectAll('option')
        .data(seriesArray)
        .enter()
        .append('option')
        .style('height', function () {
            return legendHeight + 'px';
        })
        .style('width', function () {
            return selectButtonWidth + 'px';
        })
        .text(function (d) {
            return d;
        });

    d3.select('#legend-area')
        .append('select')
        .style('height', function () {
            return legendHeight + 'px';
        })
        .style('width', function () {
            return selectButtonWidth + 'px';
        })
        .on('change', function () {
            var selectedIndex = d3.select(this).property('selectedIndex');
            var data = d3.select(this).selectAll('option')[0][selectedIndex].__data__;
            console.log(selectedIndex);
            selectedCol = selectedIndex;
            drawChart(list, selectedCol, selectedRow);
        })
        .selectAll('option')
        .data(metrics)
        .enter()
        .append('option')
        .style('height', function () {
            return legendHeight + 'px';
        })
        .style('width', function () {
            return selectButtonWidth + 'px';
        })
        .text(function (d) {
            return d;
        });



    d3.select('#legend-area')
        .append('div')
        .style('position', 'absolute')
        .selectAll('div')
        .data(legendArray)
        .enter()
        .append('div')
        .style({
            'margin': '5px',
            'clear': 'left'
        })
        .selectAll('div')
        .data(function (d) {
            return [{
                    'key': 'color',
                    'value': d
                },
                {
                    'key': 'text',
                    'value': d
                }];
        })
        .enter()
        .append('div')
        .style({
            'font-size': '12px',
            'height': '15px',
            'margin': '2px',
            'width': '30px',
            'float': 'left',
            'background-color': function (d, i) {
                console.log(d);
                console.log(d.key);

                if (d.key != 'text') {
                    console.log(d.key);
                    console.log(d.value);
                    return carrerColor[d.value];
                }
            }
        })
        .text(function (d) {
            if (d.key == 'text') {
                return d.value;
            }
        });

    // for(var i = 0; i < legend.length; i++) {
    //     console.log(legend);
    // }

    drawChart(list, selectedCol, selectedRow);

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

function drawChart(list, selectedCol, selectedRow) {
    console.log(selectedCol);
    console.log(selectedRow);
    console.log(getPositionX(num, selectedCol));
    console.log(seriesArray[selectedCol]);
    console.log(metrics[selectedRow]);

    var key = 'value';
    var total = list.length;
    cfg.maxValue = 0;

    x.domain(list.map(function (d, i) {
        // console.log(d);
        if (i > 1) {
            // console.log(d.key);
            return d.key;
        }
    }));
    y.domain([0, d3.max(function (d) {
            // console.log(d);
            return list.values('axis');
        }
    )]);


    console.log(legendArray);

    for (var num = 0; num < legendArray.length; num++) {
        cfg.maxValue = Math.max(cfg.maxValue, d3.max(list, function(i){
            console.log(i.values[selectedRow][getPositionX(num, selectedCol)]);
            if (i.values[selectedRow][getPositionX(num, selectedCol)] > 0) {
                return parseInt(i.values[selectedRow][getPositionX(num, selectedCol)], 10);
            }
        }));
        console.log(cfg.maxValue);
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
            .style("stroke-width", "1px")
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
        .style("stroke-width", "1px");

    // 系列の名前を出力
    axis.append("text")
        .attr("class", "legend")
        .text(function(d){
            // ここで系列の名前出力
            // console.log(d);
            return d.key;
        })
        .style("font-family", "sans-serif")
        .style("font-size", "14px")
        .attr("text-anchor", "middle")
        .attr("dy", "1.5em")
        .attr("transform", function(d, i){return "translate(-10, -10)"})
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
                    // console.log(num, selectedRow, getPositionX(num), j.values[selectedRow][getPositionX(num)]);

                    var value = j.values[selectedRow][getPositionX(num, selectedCol)];
                    
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
