var move = true;

// サイズの定義
var maxHeight = 500;
var maxWidth = 800;
var leftMargin = 50;
var rightMargin = 50;
var topMargin = 50;
var bottomMargin = 50;

// 描画領域のサイズを設定
var height = maxHeight - topMargin - bottomMargin;
var width = maxWidth - leftMargin - rightMargin;

//background
d3.select('#e2d3-chart-area')
    .append('img')
    .attr({
        width: maxWidth,
        height: maxHeight,
        src: baseUrl+'/umi.jpg'
    });
//http://sora0922.blog57.fc2.com/
//http://pro.foto.ne.jp/free/product_info.php/cPath/21_25_39/products_id/2846

var svg = d3.select('#e2d3-chart-area')
    .append('svg')
    .attr({
        'width': maxWidth,
        'height': maxHeight
    });

var background = svg.append('g');

var drawArea = svg
    .append('g')
    .attr('transform', 'translate(' + leftMargin + ',' + topMargin + ')');


//linearGradient
background.append('linearGradient')
    .attr({
        id: 'sGradient',
        'gradientUnits': 'objectBoundingBox',
        'gradientTransform': 'rotate(90)'
    })
    .selectAll('stop')
    .data([{
        offset: "0%",
        color: "rgb(0,0,255)",
        opacity: "0.2"
    }, {
        offset: "50%",
        color: "rgb(0,0,255)",
        opacity: "0.7"
    }, {
        offset: "100%",
        color: "rgb(0,0,100)",
        opacity: "1"
    }])
    .enter()
    .append('stop')
    .attr("offset", function(d) {
        return d.offset;
    })
    .attr("stop-color", function(d) {
        return d.color;
    })
    .attr("stop-opacity", function(d) {
        return d.opacity;
    });
//linearGradient
background.append('linearGradient')
    .attr({
        id: 'gGradient',
        'gradientUnits': 'objectBoundingBox',
        'gradientTransform': 'rotate(90)'
    })
    .selectAll('stop')
    .data([{
        offset: "0%",
        color: "rgb(255,169,0)",
        opacity: "1"
    }, {
        offset: "100%",
        color: "rgb(255,169,46)",
        opacity: "0.3"
    }])
    .enter()
    .append('stop')
    .attr("offset", function(d) {
        return d.offset;
    })
    .attr("stop-color", function(d) {
        return d.color;
    })
    .attr("stop-opacity", function(d) {
        return d.opacity;
    });
// backbround
background
    .append('rect')
    .attr({
        class: 'background',
        width: maxWidth,
        height: maxHeight - bottomMargin,
        fill: 'url(#sGradient)'
    });
background
    .append('rect')
    .attr({
        class: 'background',
        width: maxWidth,
        height: bottomMargin,
        fill: 'url(#gGradient)',
        y: height + bottomMargin
    });


var pre_metrics = '';

function remove() {
    drawArea
        .selectAll('.' + pre_metrics + 'class')
        .data({})
        .exit()
        .transition()
        .duration(4000)
        .ease('linear')
        .attr('x', function(d, i) {
            return -width;
        })
        .remove()

    drawArea
        .selectAll('.' + pre_metrics + 'label')
        .data({})
        .exit()
        .transition()
        .duration(4000)
        .ease('linear')
        .attr('x', function(d, i) {
            return -width;
        })
        .remove()

    d3.select('.y').remove();
}

var symbols;

function e2d3Show() {
    $.getScript(baseUrl + "/symbols.js", function() {
        symbols = new Symbols(svg);
        symbols.storeAllSym(move);
        e2d3.addChangeEvent(e2d3BindId, e2d3Update, function() {
            e2d3.bind2Json(e2d3BindId, {
                dimension: '2d'
            }, show);
        });
    });
}

function e2d3Update(responce) {
    console.log("e2d3Update :" + responce);
    if (response) {
        e2d3.bind2Json(e2d3BindId, {
            dimension: '2d'
        }, show);
    }
}

function show(data) {
    draw(initLabel, data);
}

function draw(m, data) {
    if (pre_metrics === m) {
        return;
    }
    remove();
    pre_metrics = m;


    var metrics = m;

    // 最大値の取得
    var yMax = d3.max(data, function(d) {
        return parseInt(d[metrics], 10) + 1
    });
    // 最小値の取得
    var yMin = d3.min(data, function(d) {
        return d[metrics]
    });

    var xMax = data.length;
    // xのスケールの設定
    var xScale = d3.scale.linear()
        .domain([0, xMax])
        .range([0, width]);

    // yのスケールの設定
    var yScale = d3.scale.linear()
        .domain([yMin, yMax])
        .range([height, 0]);

    // yの軸の設定
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left');

    // y軸をsvgに表示
    drawArea
        .append('g')
        .attr('class', 'y axis')
        .attr('fill', 'white')
        .call(yAxis)

    var s = drawArea
        .selectAll('.' + metrics + 'class')
        .data(data, function(d, i) {
            return d.syurui + metrics;
        })

    add(s.enter()
        .append('g'));
    add(s
        .append('g'));

    function add(line) {
        symbols.appendSymbol(line, metrics)
            .attr('class', metrics + 'class')
            .attr('x', function(d, i) {
                return maxWidth;
            })
            .transition()
            .delay(function(d, i) {
                return (xMax - i) * 50;
            })
            .duration(2000)
            .ease('linear')
            .attr('x', function(d, i) {
                return xScale(i);
            })
            .attr('y', function(d) {
                return yScale(d[metrics]);
            })
            .attr('stroke', 'none')
            .attr('display', function(d) {
                return (d[metrics] > 0) ? 'inherited' : 'none';
            })

        line.append('text')
            .text(function(d) {
                return d.syurui;
            })
            .attr('class', metrics + 'label')
            .attr('font-size', '9px')
            .attr('fill', 'white')
            .attr('display', function(d) {
                return (d[metrics] > 0) ? 'inherited' : 'none';
            })
            .attr('x', function(d, i) {
                return maxWidth;
            })
            .transition()
            .delay(function(d, i) {
                return (xMax - i) * 50;
            })
            .duration(2000)
            .ease('linear')
            .attr('x', function(d, i) {
                return xScale(i);
            })
            .attr('y', function(d) {
                return yScale(d[metrics]);
            })
    }
    dataa = data;
}

var dataa;
var labels = ['ebi', 'tai','tuna'];
var initLabel = 'tai';
makeLabels(labels, initLabel);

//label click
jQuery(document).on('click', '.chart-label', function() {
    jQuery('.chart-label').removeClass('active');
    jQuery(this).addClass('active');

    initLabel = jQuery(this).attr('data-chart-label');
    console.log('label change : ' + initLabel);
    draw(initLabel, dataa);
});

function makeLabels(labels, value) {
    jQuery('#chart-labels').remove();
    var box = jQuery('<div>').attr('id', 'chart-labels');
    jQuery(labels).each(function() {
        var label = jQuery('<label>').addClass('chart-label').attr('data-chart-label', this).html(this);
        if (value == this) {
            jQuery(label).addClass('active');
        }
        jQuery(box).append(label);
    });

    if (labels) {
        jQuery('#e2d3-chart-area').append(box).hide().fadeIn();
    }
}
