//# require=d3

var margin = { top: 20, right: 30, bottom: 60, left: 80 };
var width = root.clientWidth - margin.left - margin.right;
var height = root.clientHeight - margin.top - margin.bottom;

var x = d3.scale.ordinal()
  .rangeRoundBands([0, width], .1)

var y = d3.scale.linear()
  .rangeRound([height, 0])

var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');

var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')

var backgroundImage = d3.select(root)
  .append('div')
    .attr('class', 'background-image');

d3.select('.background-image')
  .append('img')
    .attr('src', baseUrl + '/man_left.png')
    .attr('class', 'man');

d3.select('.background-image')
  .append('img')
    .attr('src', baseUrl + '/table.png')
    .attr('class', 'table');

d3.select('.background-image')
  .append('img')
    .attr('src', baseUrl + '/man_right.png')
    .attr('class', 'man');

var chart = backgroundImage.append('svg')
    .attr('width', root.clientWidth)
    .attr('height', root.clientHeight)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

function update(data) {
    console.log(data.toList());
    var xs = [],
        x,
        start = -100,
        end = 101,
        len = end - start - 1,
        ys = [],
        xys = [],
        f,
        y,
        width = 600,
        height = 300,
        padding = 50,
        svg,
        xscale,
        yaxis,
        yscale,
        yaxis;

    f = function (x) {
        return Math.pow(x, 2) + 2 * x + 1;
    };

    for (x = start; x < end; x += 1) {
        y = f(x);
        xs.push(x);
        ys.push(y);
        xys.push([x, y]);
    }
    xscale = d3.scale.linear()
        .domain([start, end])
        .range([padding, width - padding]);

    xaxis = d3.svg.axis()
        .scale(xscale)
        .orient('bottom');

    yscale = d3.scale.linear()
        .domain([d3.min(ys) - 1000, d3.max(ys)])
        .range([height - padding, padding]);

    yaxis = d3.svg.axis()
        .scale(yscale)
        .orient('left')

    chart.selectAll('line')
        .data(xys)
        .enter()
        .append('line')
        .attr('x1', function (d, i) {
            if (i === len) {
                return xscale(start);
            }
            return xscale(d[0]);
        })
        .attr('y1', function (d, i) {
            if (i === len) {
                return yscale(0);
            }
            return yscale(d[1]);
        })
        .attr('x2', function (d, i) {
            if (i === len) {
                return xscale(end);
            }
            return xscale(xys[i+1][0]);
        })
        .attr('y2', function (d, i) {
            if (i === len) {
                return yscale(0);
            }
            return yscale(xys[i+1][1]);
        })
        .attr('stroke', function (d, i) {
            if (i === len) {
                return 'blue';
            }
            return 'green';
        });

    chart.append('g')
        .attr('transform', 'translate(0, ' + (height - padding) + ')')
        .call(xaxis);

    chart.append('g')
        .attr('transform', 'translate(' + padding + ', 0)')
        .call(yaxis);

    chart.append('text')
        .attr('x', xscale(0))
        .attr('y', padding / 2)
        .attr('text-anchor', 'middle')
        .text('y = x^2 + 2 * x + 1');
    
    chart.append('text')
        .attr('x', xscale(0))
        .attr('y', height - padding / 4)
        .attr('text-anchor', 'middle')
        .text('x');

    chart.append('text')
        .attr('x', padding / 5)
        .attr('y', (height - padding) / 2 )
        .attr('text-anchor', 'middle')
        .text('y');
}

