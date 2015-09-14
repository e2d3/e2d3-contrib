//# require=d3,jquery

$(root).append($('<div id="loading">analyzing.... <span id="currentCnt">0</span> of <span id="totalCnt">0</span></div>'));
$('<div id="jThirdControl"></div>')
    .append($('<span>apiKey:</span>'))
    .append($('<input type="text" id="apiKey" value="afbce7cef7f5f316804e59519296053980c51ac8">'))
    .append($('<button type="button" id="start">start analyzing</button>'))
    .appendTo($(root));

$('#start').attr('disabled');

$(document).on('click', '#start', function() {
    start();
});

var margin = {
        top: 30,
        right: 40,
        bottom: 20,
        left: 210
    },
    width = root.clientWidth - margin.left - margin.right,
    height = root.clientHeight - margin.top - margin.bottom;
var line = d3.svg.line().defined(function(d) {
    return !isNaN(d[1]);
});
var yAxis = d3.svg.axis().orient("left");
var svg = d3.select(root).append("svg").attr("width", root.clientWidth).attr("height", root.clientHeight).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var image_area = d3.select(root).append("img").attr("id", "image_area");
var dataCnt = 0;

function start() {
    _data.forEach(function(d) {
        judge(d[0], d[1]);
    })
}
var _data;

function update(data) {
    data.splice(0, 1);
    dataCnt = data.length;
    $('#totalCnt').text(dataCnt);

    _data = data;
    $('#start').attr('disabled', false);
}

function tmp(data) {
    svg.selectAll('*').remove();
    var label = data[0];
    data.splice(0, 1);
    console.log(data);
    // data = data.toList();
    var dimensions = [{
        name: label[0],
        scale: d3.scale.ordinal().rangePoints([0, height]),
        type: String
    }];

    for (var i = 2; i < label.length - 1; i++) {
        dimensions.push({
            name: label[i],
            scale: d3.scale.linear().range([height, 0]),
            type: Number
        });
    };

    var x = d3.scale.ordinal().domain(dimensions.map(function(d) {
        return d.name;
    })).rangePoints([0, width]);
    var dimension = svg.selectAll(".dimension").data(dimensions).enter().append("g").attr("class", "dimension").attr("transform", function(d) {
        return "translate(" + x(d.name) + ")";
    });
    dimensions.forEach(function(dimension) {
        dimension.scale.domain(dimension.type === Number ? d3.extent(data, function(d) {
            return +d[dimension.name];
        }) : data.map(function(d) {
            return d[dimension.name];
        }).sort());
    });
    svg.append("g").attr("class", "background").selectAll("path").data(data).enter().append("path").attr("d", draw);
    svg.append("g").attr("class", "foreground").selectAll("path").data(data).enter().append("path").attr("d", draw).attr("class", function(d) {
        return d.kawaii == "1" ? "kawaii" : "kawaikunai";
    });
    dimension.append("g").attr("class", "axis").each(function(d) {
        d3.select(this).call(yAxis.scale(d.scale));
    }).append("text").attr("class", "title").attr("text-anchor", "middle").attr("y", -9).text(function(d) {
        return d.name;
    });
    // Rebind the axis data to simplify mouseover.
    svg.select(".axis").selectAll("text:not(.title)").attr("class", "label").data(data, function(d) {
        return d.url || d;
    });
    var projection = svg.selectAll(".background path,.foreground path").on("mouseover", mouseover).on("mouseout", mouseout);

    function mouseover(d) {
        var mouse_pos = d3.mouse(this);
        image_area.style("display", "block").style("top", (mouse_pos[1] - 70) + "px").style("left", (mouse_pos[0] + 230) + "px").attr("src", d.url);
        svg.classed("active", true);
        projection.classed("inactive", function(p) {
            return p !== d;
        });
        projection.filter(function(p) {
            return p === d;
        }).each(moveToFront);
    }

    function mouseout(d) {
        image_area.style("display", "none");
        svg.classed("active", false);
        projection.classed("inactive", false);
    }

    function moveToFront() {
        this.parentNode.appendChild(this);
    }

    function draw(d) {
        return line(dimensions.map(function(dimension) {
            return [x(dimension.name), dimension.scale(d[dimension.name])];
        }));
    }
}
var keys = ['url', 'kawaii'];
var datas = [];
var resultMap = [];
var judgeFinishedCnt = 0;

function judge(url, kawaii) {
    var apiKey = $('#apiKey').val();
    var toUrl = "https://access.alchemyapi.com/calls/url/URLGetRankedImageKeywords?apikey=" + apiKey + "&url=" + url + "&outputMode=json&knowledgeGraph=1";
    $.ajax({
        type: "GET",
        url: toUrl,
        success: function(data) {

            if (data.status == 'ERROR') {
                $('#loading').text(data.status + ':' + data.statusInfo);
                return;
            }

            console.log(judgeFinishedCnt);
            var length = data.imageKeywords.length - 1;
            var text, score, dogArray = {};
            dogArray['url'] = url;
            dogArray['kawaii'] = kawaii;
            for (var i = 0; i <= length; i++) {
                text = data.imageKeywords[i].text;
                score = data.imageKeywords[i].score;
                dogArray[text] = score;
            }
            dog(dogArray);
            judgeFinishedCnt++;
            $('#currentCnt').text(judgeFinishedCnt);
            if (judgeFinishedCnt == dataCnt) {
                $('#loading').remove();
                $('#start').attr('disabled', true);
                formatData();
            }
        }
    })
}

function dog(data) {
    var dogArrays = {};
    var tmpkeys = Object.keys(data);
    for (var i = 0; i < tmpkeys.length; i++) {
        if (keys.indexOf(tmpkeys[i]) < 0) {
            keys.push(tmpkeys[i]);
        }
    }
    datas.push(data);
}

function formatData() {
    resultMap.push(keys);
    datas.forEach(function(data) {
        var row = {};
        keys.forEach(function(key) {
            if (key == 'url') {
                row[key] = data[key];
            } else {
                row[key] = ((key in data) ? parseFloat(data[key]) : 0);

            }
        });
        resultMap.push(row);
    });
    tmp(resultMap);
}
