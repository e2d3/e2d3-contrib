//# require=d3

var margin = {
        top: 50,
        right: 100,
        bottom: 50,
        left: 50
    },
    width = root.clientWidth - margin.left - margin.right,
    height = root.clientHeight - margin.top - margin.bottom;

var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);
var z = d3.scale.linear().range(["blue", "red"]).interpolate(d3.interpolateLab);

var valueline = d3.svg.line()
    .x(function(d) { return x(d[0]); })
    .y(function(d) { return y(d[1]); });

var svg = d3.select(root).append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

function make_x_axis() {
    return d3.svg.axis()
        .scale(x)
        .orient("bottom")
}

function make_y_axis() {
    return d3.svg.axis()
        .scale(y)
        .orient("left")
}

var div = d3.select(root).append('div')
    .attr('class', 'tooltip')
    .style('opacity', '0');

function update(data) {

    // 2次元配列の1行目はヘッダー
    var labels = data[0]; //名前、日付１、日付２
    data[0] = ["name", "date1", "date2"]

    // 1行目はスルーしてdata.csvをリスト化する
    var list = data.toList();

    list.forEach(function(d) {
        d.date1 = +d.date1;
        d.date2 = +d.date2;
        d.diff = d.date2 - d.date1;
    });

    console.log(list);

    var data_keys = labels;

    var conv_data = [];
    var diff_data = [];

    for (var i = 0; i < list.length; i++) {
        data1 = [0, list[i].date1];
        data2 = [1, list[i].date2];
        data3 = list[i].diff;

        conv_data.push([data1, data2]);
        diff_data.push(data3);
    };

    x.domain([0, 1]);
    y.domain([d3.min(conv_data, function(d) {
        return Math.min(d[0][1], d[1][1]);
    }), d3.max(conv_data, function(d) {
        return Math.max(d[0][1], d[1][1]);
    })]);
    z.domain([d3.min(diff_data), d3.max(diff_data)]);

    svg.selectAll('.grid').remove();

    svg.append("g")
        .attr('class', "grid")
        .call(make_y_axis()
            .tickSize(-width, 0, 0)
            .tickFormat("")
        )

    var setup = function(selection) { // add test

        for (var i = 0; i < list.length; i++) {

            var d_data = conv_data[i];

            svg.append('path')
                .data([d_data])
                .attr('class', 'line')
                .attr('id', function(d) {
                    return i;
                })
                .attr('d', valueline)
                .style('stroke', z(diff_data[i]))
                .on('mouseover', function(d) {
                    d3.select(this)
                        .transition().duration(100)
                        .style('stroke-width', '3px')
                        //.style('stroke', 'steelblue');
                    div.transition().duration(300)
                        .style('opacity', .8);
                    div.html(list[this.id].name +
                            '<br>' + list[this.id].date1 +
                            ' → ' + list[this.id].date2)
                        .style('left', (d3.event.pageX) + 'px')
                        .style('top', (d3.event.pageY) + 'px');
                })
                .on('mouseout', function(d) {
                    d3.select(this)
                        .transition().delay(50).duration(100)
                        .style('stroke-width', '1.5px')
                        //.style('stroke', 'grey')
                    div.transition().duration(300)
                        .style('opacity', 0);
                });

            svg.append('text')
                .attr('class', 'v_label')
                .attr('x', width + 10)
                .attr('y', y(d_data[1][1]))
                .attr('transform', 'translate(0,0)')
                .attr('dy', '.35em')
                .attr('text-anchor', 'start')
                .style('fill', 'grey')
                .text(function(d) {
                    if ((list[i].date2 - list[i].date1) > 0) {
                        return "+" + (list[i].date2 - list[i].date1) + "  " + list[i].name;
                    } else {
                        return (list[i].date2 - list[i].date1) + "  " + list[i].name;
                    };
                });

        };

    }; //setup end

    svg.selectAll('.y_axis').remove();
    svg.selectAll('.x_lab').remove();
    svg.selectAll('.v_label').remove();
    svg.selectAll('.line').remove();

    var yAxis = d3.svg.axis().scale(y).orient("left");

    svg.append('g')
        .attr('class', 'y_axis')
        .call(yAxis);

    svg.append('text')
        .attr('class', 'x_lab')
        .attr('x', 0)
        .attr('y', height + (margin.bottom / 2))
        .attr('transform', 'translate(0,0)')
        .attr('dy', '.35em')
        .attr('text-anchor', 'middle')
        .style('fill', 'black')
        .text(function(d) {
            return data_keys[1];
        });

    svg.append('text')
        .attr('class', 'x_lab')
        .attr('x', 0)
        .attr('y', height + (margin.bottom / 2))
        .attr('transform', 'translate(' + width + ',0)')
        .attr('dy', '.35em')
        .attr('text-anchor', 'middle')
        .style('fill', 'black')
        .text(function(d) {
            return data_keys[2];
        });

    slope = svg.selectAll('.line').data(list);

    slope.transition().duration(500).call(setup);

    slope.enter().append('slope').call(setup);

    slope.exit().remove();


};