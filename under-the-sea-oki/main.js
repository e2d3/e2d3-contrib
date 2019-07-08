//# require=d3,Symbols,jQuery:jquery

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
        height: root.clientHeight,
        src: baseUrl + '/umi.jpg',
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

//draw background svg
drawBackground(svg, width, height, margin);

//define draw area
var drawArea = svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

//create symbol-manage object
var symbols = new Symbols(svg);
symbols.storeAllSym(false, baseUrl);

//variables
var preMetrics = '';
var dataReserved = null;
//button-labels
var labels = ['ika', 'awabi', 'sazae'];
//initial metrix
var initialMetrix = 'ika';

function update(data) {
    draw(initialMetrix, data.toList());
}

function draw(m, data) {
    remove();
    
    preMetrics = m;

    var metrics = m;

    //max min
    var yMax = d3.max(data, function(d) {
        return parseInt(d[metrics], 10) + 1
    });

    var yMin = d3.min(data, function(d) {
        return d[metrics]
    });

    var xMax = data.length;

    var xMin = 0;;

    //scale
    var yScale = d3.scale.linear()
        .domain([yMin, yMax])
        .range([height - margin.bottom - margin.top, 0]);

    var xScale = d3.scale.linear()
        .domain([xMin, xMax])
        .range([0, width - margin.right - margin.left]);

    //axix
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left');

    //repaint axis
    drawArea.select('.y').remove();
    drawArea
        .append('g')
        .attr('class', 'y axis')
        .attr('fill', 'white')
        .call(yAxis)

    //dots
    console.log(data);
    var dots = drawArea
        .selectAll('.' + metrics + 'class')
        .data(data, function(d, i) {
            return d.syurui + metrics;
        });

    var newDots = symbols.appendSymbol(dots.enter(), metrics)
        .attr('class', metrics + 'class');

    setDotProperty(newDots);
    setDotProperty(dots);


    var texts = drawArea
        .selectAll('.' + metrics + 'label')
        .data(data, function(d, i) {
            return d.syurui + metrics;
        })
    var newTexts = texts.enter().append('text')
        .attr('class', metrics + 'label');
    setTextProperty(newTexts);
    setTextProperty(texts);

    function setDotProperty(line) {
        line.attr('x', function(d, i) {
                return width;
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
    }

    function setTextProperty(line) {
        line.text(function(d) {
                return d.syurui;
            })
            .attr('font-size', '9px')
            .attr('fill', 'white')
            .attr('display', function(d) {
                return (d[metrics] > 0) ? 'inherited' : 'none';
            })
            .attr('x', function(d, i) {
                return width;
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
    dataReserved = data;
}

makeLabels(labels, initialMetrix);

//label click
jQuery(document).on('click', '.chart-label', function() {
    jQuery('.chart-label').removeClass('active');
    jQuery(this).addClass('active');

    initialMetrix = jQuery(this).attr('data-chart-label');
    console.log('label change : ' + initialMetrix);
    draw(initialMetrix, dataReserved);
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
        jQuery(root).append(box).hide().fadeIn();
    }
}

function remove() {
    drawArea
        .selectAll('.' + preMetrics + 'class')
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
        .selectAll('.' + preMetrics + 'label')
        .data({})
        .exit()
        .transition()
        .duration(4000)
        .ease('linear')
        .attr('x', function(d, i) {
            return -width;
        })
        .remove()

}


function drawBackground(svg, width, height, margin) {
    var background = svg.append('g');

    //background-linearGradient-sea
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


    //background-linearGradient-ground
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

    // backbround-sea
    background
        .append('rect')
        .attr({
            class: 'background',
            width: width,
            height: height,
            fill: 'url(../../../../../../frame.html#sGradient)'
        });

    // backbround-ground
    background
        .append('rect')
        .attr({
            class: 'background',
            width: width,
            height: margin.bottom,
            fill: 'url(../../../../../../frame.html#gGradient)',
            y: height - margin.bottom
        });
}
