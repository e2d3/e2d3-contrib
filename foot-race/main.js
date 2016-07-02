//# require=d3,Symbols



function update(data) {
    draw(data.toList());
}



function draw(data) {

    d3.select(root).selectAll('*').remove();


var recordUnit = '記録秒';

//initial metrix
var initialMetrix = recordUnit;
var m = initialMetrix;

var margin = {
    top: 20,
    right: 80,
    bottom: 30,
    left: 50
};

//size
var width = root.clientWidth - margin.left - margin.right;
var height = root.clientHeight - margin.top - margin.bottom;

var startDelay = 1000;
var objYspace = 50*(height/485);  //change 20160402 nagahisa
var xStartPosOrg = 0;


//draw background-image (should be called before base-svg creation)
d3.select(root).append('img')
    .attr({
        width: width,
        height: height,
        src: baseUrl + '/riku.jpg',
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

//define draw area
var drawArea = svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

//variables
var dataReserved = null;


    //create symbol-manage object
    var symbols = new Symbols(svg);
    symbols.storeAllSym(data, false);

    var metrics = m;


    //max min
    var yMax = height;
    var yMin = 0;
    var xMax = width;
    var xMin = 0;

    //scale
    var yScale = d3.scale.linear()
        .domain([yMin, yMax])
        .range([height - margin.bottom - margin.top, 0]);

    var xScale = d3.scale.linear()
        .domain([xMin, xMax])
        .range([0, width - margin.right - margin.left]);

    //dots
    var dots = drawArea
        .selectAll('.' + metrics + 'class')
        .data(data, function(d, i) {
            return d['名前'] + metrics;
        })


mag=0.0011*height+0.00757;   //added 20160403 nagahisa
pitchmag=0.0086*height+85.091; //added 20160403 nagahisa


    var newDots = symbols.appendSymbol(dots.enter(), metrics)
        .attr('class', metrics + 'class')
        .attr("transform", "scale(" + (mag) +  ")")    //change 20160402



    setDotProperty(newDots);
    setDotProperty(dots);



    var texts = drawArea
        .selectAll('.' + metrics + 'label')
        .data(data);
    var newTexts = texts.enter().append('text')
        .attr('class', metrics + 'label');
    setTextProperty(newTexts);
    setTextProperty(texts);

    function setDotProperty(line) {
       line.attr('x', xStartPosOrg)
            .attr('y', function(d, i){
                return i * pitchmag;    //change 20160403 nagahisa
            })
            .transition()
            .delay(startDelay)
            .duration(function (d) {
                if (d['単位'] == 'm') {
                    time = d[recordUnit] / d['距離'];
                }else if (d['単位'] == 'km') {
                    time = d[recordUnit] / (d['距離'] * 1000);
                }
                return time * 20000;
            })
            .ease('linear')
            .attr('x', function(d, i) {
                return xScale(xMax)*(1/mag); //change 20160403 nagahisa
            })
            .attr('y', function(d, i) {
                return i * pitchmag;            })   //change 20160403 nagahisa
            .attr('stroke', 'none')
            .attr('display', 'inherited')
    }





    function setTextProperty(line) {
        line.text(function(d) {
                return d['名前'];
            })
            .attr('font-size', '12px')  //change 20160403 nagahisa
            .attr('fill', 'white')
            .attr('display', 'inherited')
            .attr('x', xStartPosOrg)
            .attr('y', function(d, i){
                return i * objYspace;
            })
            .transition()
            .delay(startDelay)
            .duration(function (d) {
                if (d['単位'] == 'm') {
                    time = d[recordUnit] / d['距離'];
                }else if (d['単位'] == 'km') {
                    time = d[recordUnit] / (d['距離'] * 1000);
                }
                return time * 20000;
            })
            .ease('linear')
            .attr('x', function(d, i) {
                return xScale(xMax);
            })
            .attr('y', function(d, i) {
                return i * objYspace;
            })

    }
    dataReserved = data;






//label click
d3.selectAll('.chart-label').on('click', function() {
    d3.selectAll('.chart-label').classed('active', false);
    d3.select(this).classed('active', true);

    initialMetrix = d3.select(this).attr('data-chart-label');
    // console.log('label change : ' + initialMetrix);
    draw(initialMetrix, dataReserved);
});

function calcSpeed(d){
    return d[metrics] * 500;
}

}
