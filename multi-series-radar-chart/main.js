//# require=d3
function iframeResize(){
    var PageHight = document.body.scrollHeight + 0; // ページの高さを取得
    window.parent.document.getElementById('disp').style.height = PageHight + 'px'; // iframeの高さを変更
}

window.onload = iframeResize;

var mleft = d3.min([root.clientWidth, root.clientHeight]) * 0.20;

var legendHeight = 30;
var margin = { top: 30, right: 30, bottom: 30, left: mleft };
var width = root.clientWidth - margin.left - margin.right;
var height = root.clientHeight - margin.top - margin.bottom - legendHeight;
var selectButtonWidth = parseInt((root.clientWidth / 2) * 0.9);

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
        'text-align': 'left',
        'padding-left': '10px',
        'width': '100%'
    });

var chartArea = base.append('svg')
    .attr('width',  root.clientWidth)
    .attr('height', root.clientHeight - margin.top - margin.bottom - legendHeight)

var chart = chartArea.append('g')
    .attr('id', 'mainGroup')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var carrerColor = {
            'ドコモ': '#C10026',
            'au': '#E14100',
            'ソフトバンク': '#A7ADB1',
        };
var cfg = {
    radius: 5,
    w: d3.min([root.clientHeight, root.clientWidth]) * 0.6,
    h: d3.min([root.clientHeight, root.clientWidth]) * 0.6,
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

var getPositionX = function (i, selectedCol) {
    return 2 + selectedCol + i * rowNestedNum;
}

var getPositionY = function (i) {
    return selectedRow + i * colNestedNum;
}

function getLength (array) {
    var count = 0;
    for (var i in array) {
        count++;
    }
    return count;
}

var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);

function update(data) {
    legendArray = [];
    metrics = [];
    seriesArray = [];

    var firstSeries = [];
    var header = d3.keys(data.transpose().toMap()).filter(function(key) { return key !== '系列';})
    
    var metricslist = d3.nest()
        .key(function(d) { return d[1]; })
        .entries(data.transpose());

    header.forEach(function (d) {
        legendArray.push(d);
    });
    if (!env.colors()) env.colors(d3.scale.category10().range());
    var color = d3.scale.ordinal().range(env.colors());
    color.domain(header.map(function (d) { return d; }))
    metricslist.forEach(function (d) {
        if (d.key != '系列') {
            metrics.push(d.key);
        }
    });

    var list = d3.nest()
        .key(function(d) { return d[0]; })
        .entries(data);
    list.forEach(function (d) { 
        d.values.forEach(function (dd) {
            dd.forEach(function (ddd, i) {
                // console.log(data[0][i]);
                // console.log(data[1][i]);
                if (dd[data[0][i]]) {
                    dd[data[0][i]][data[1][i]] = ddd;
                } else {
                    dd[data[0][i]] = {
                        [data[1][i]]: ddd
                    }
                }
            })
        })
    });
    var legend = data.toList();
    var dataTree = d3.nest()
        .key(function(d) { return d[0]; })
        .key(function(d) { return d[1]; })
        .entries(data.transpose());
    var lineData = dataTree.splice(1, header.length);
    list.splice(0, 1);
    list.reverse();
    
    for (var i = 0; i < list[0].values.length; i++) {
        seriesArray.push(list[0].values[i][1]);
    }
    rowNestedNum = list[0].values.length;

    colHeaderLength = getLength(legend[0]) - colNestedNum;
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
            drawChart(list, lineData, selectedCol, selectedRow);
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



    d3.select(root).append('div')
        .attr('id', 'legendName')
        .style({
            'margin-top': '-60px',
            'margin-left': function () {
                return (d3.min([root.clientHeight, root.clientWidth]) * 0.4) + 'px';
            },
            'float': 'left'
        })
        .selectAll('div')
        .data(legendArray)
        .enter()
        .append('div')
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
                if (d.key != 'text') {
                    if (carrerColor[d.value] !== undefined) {
                        return carrerColor[d.value];
                    } else {
                        return color(d.value);
                    }
                }
            }
        })
        .text(function (d) {
            if (d.key == 'text') {
                return d.value;
            }
        });
    drawChart(list, lineData, selectedCol, selectedRow);
    var copyRight = d3.select(root).append("div");

    copyRight.style({
        'height': '20px',
        'text-align': 'left',
        'padding-left': '10px',
        'width': '100%',
        'clear': 'left'
    })
    .text("Presented by gooスマホ部")
    .style("color", "gray");
}

function drawChart(list, lineData, selectedCol, selectedRow) {
    
    d3.select('#legendName').remove();
    d3.select(root).append('div')
        .attr('id', 'legendName')
        .style({
            'margin-top': function () {
                return (-1 * legendHeight) + 'px';
            },
            'margin-left': function () {
                return (root.clientWidth - (d3.min([root.clientHeight, root.clientWidth]) * 0.35) ) + 'px';
            },
            'float': 'left'
        })
        .selectAll('div')
        .data(legendArray)
        .enter()
        .append('div')
        .style({
            'width': function () {
                return (d3.min([root.clientHeight, root.clientWidth]) * 0.4) + 'px';
            }
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
            'width': function (d) {
                if (d.key != 'text') {
                    return (d3.min([root.clientHeight, root.clientWidth]) * 0.05) + 'px';
                } else {
                    return (d3.min([root.clientHeight, root.clientWidth]) * 0.3) + 'px';
                }
            },
            'float': 'left',
            'background-color': function (d, i) {
                if (d.key != 'text') {
                    if (carrerColor[d.value]) {
                        return carrerColor[d.value];
                    } else {
                        return color(d.value);
                    }
                }
            }
        })
        .text(function (d) {
            if (d.key == 'text') {
                return d.value;
            }
        });

    var key = 'value';
    var total = list.length;
    cfg.maxValue = 0;

    x.domain(list.map(function (d, i) {
        if (i > 1) {
            return d.key;
        }
    }));
    y.domain([0, d3.max(function (d) {
            return list.values('axis');
        }
    )]);

    for (var num = 0; num < legendArray.length; num++) {
        cfg.maxValue = Math.max(cfg.maxValue, d3.max(list, function(i){
            if (i.values[selectedRow][getPositionX(num, selectedCol)] > 0) {
                return parseInt(i.values[selectedRow][getPositionX(num, selectedCol)], 10);
            } else {
                return 1;
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
                return x1; 
            })
            .attr("y1", function(d, i){
                var y1 = levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));
                return y1; 
            })
            .attr("x2", function(d, i){
                var x2 = levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));
                return x2;
            })
            .attr("y2", function(d, i){
                var y2 = levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));
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
            return x2;
        })
        .attr("y2", function(d, i){
            var y2 = cfg.w/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));
            return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));
        })
        .attr("class", "line")
        .style("stroke", "gray")
        .style("stroke-width", "1px");

    // 系列の名前を出力
    axis.append("text")
        .attr("class", "legend")
        .text(function(d){
            return d.key;
        })
        .style("font-family", "sans-serif")
        .style("font-size", function (d) {
            return mleft * 0.1;
        })
        .attr("text-anchor", "middle")
        .attr("dy", "1.5em")
        .attr("transform", function(d, i){return "translate("+ (mleft * 0.08 + -10) +", -10)"})
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
                    var value = j.values[selectedRow][legendArray[num]][metrics[selectedCol]];
                    if (value === undefined) {
                        value = 1;
                    }
                    if (!cfg.maxValue) {
                        cfg.maxValue = 1;
                    }
                    
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
                    if (carrerColor[legendArray[num]]) {
                        return carrerColor[legendArray[num]];
                    } else {
                        return color(legendArray[num]);
                    }
                })
                .attr("points",function(d) {
                    var str="";
                    for(var pti=0;pti<d.length;pti++){
                        str=str+d[pti][0]+","+d[pti][1]+" ";
                    }
                    return str;
                })
                .style("fill", function(j, i){
                    if (carrerColor[legendArray[num]] !== undefined) {
                        return carrerColor[legendArray[num]];
                    } else {
                        return color(legendArray[num]);
                    }
                })
                .style("fill-opacity", cfg.opacityArea);
        });
    }
}
