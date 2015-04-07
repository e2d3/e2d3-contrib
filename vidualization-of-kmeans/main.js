//# require=d3
var clusterNum = 4;
var centroid = true;
var first = false;
var finish = false;
var centroidArr = []

var margin = { top: 20, right: 30, bottom: 30, left: 40 };
var width = root.clientWidth * 0.7 - margin.left - margin.right;
var height = root.clientHeight - margin.top - margin.bottom;

var clusterColor = ['rgb(200, 0, 0)', 'rgb(200, 200, 0)', 'rgb(0, 200, 0)', 'rgb(0, 0, 200)', 'rgb(0, 200, 200)']
var centroidColor = ['#f00', '#ff0', '#0f0', '#00f', '#0ff']

var x = d3.scale.linear()
  .rangeRound([0, width]);

var y = d3.scale.linear()
  .rangeRound([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');

var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left');

var process = d3.select(root)
    .append('div')
    .attr({
        'id': 'process'
    })
    .style({
        'background-color': 'gray',
        'height': '400px',
        'position': 'absolute',
        'width': '180px'
    });

var chart = d3.select(root).append('svg')
    .attr('width', root.clientWidth * 0.7)
    .attr('height', root.clientHeight)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

//  Stepを進めるボタン
process.append('button')
    .style({
        'background-color': '#a00',
        'border-radius': '10px',
        'color': '#ddd',
        'height': '40px',
        'margin': '0 auto',
        'width': '100px',
        'text-align': 'center'
    })
    .on('click', function () {
        if (!first) {
            firstCluster();
            d3.selectAll('.processDescription')
                .style({
                    'background-color': function (d, i) {
                        if (i == 0) {
                            return 'white';
                        } else {
                            return 'gray';
                        }
                    }
                });
        } else {
            if (centroid) {
                d3.selectAll('.processDescription')
                .style({
                    'background-color': function (d, i) {
                        if (i == 1) {
                            return 'white';
                        } else {
                            return 'gray';
                        }
                    }
                });
                calCentroid();
            } else {
                if (!finish) {
                    d3.selectAll('.processDescription')
                    .style({
                        'background-color': function (d, i) {
                            if (i == 2) {
                                return 'white';
                            } else {
                                return 'gray';
                            }
                        }
                    });
                    calDistance();
                }
            }
        }
    })
    .text('Next Step');

var processArray = [
    'k clusters are randomly generated (in this case k=4) ',
    // '各データに対してランダムでクラスタを割り振る',
    'k means are created by associating k clusters (Using Euclidean distance).',
    // '各クラスタの重心を計算する(算術平均(ユークリッド距離))',
    'The centroid of each of the k clusters becomes the new mean.',
    // '各データに対して重心が最も近いクラスタに割り当て直す',
    'convergence has been reached'
    // '移動しなくなったら終了'
];

process
    .selectAll('div')
    .data(processArray)
    .enter()
    .append('div')
    .attr({
        'id': function(d, i) {
            return 'process' + i;
        },
        'class': 'processDescription'
    })
    .style({
        'border': 'solid 2px #333',
        'font-size': '12px',
        'margin': '10px',
        'height': '70px'
    })
    .text(function(d) { return d; })

function update(data) {
  var list = data.toList({header: ['x', 'y'], typed: true});
  
  x.domain([
      d3.min(list, function (d) {
        return d['x'];
      }), 
      d3.max(list, function (d) {
        return d['x'];
      })
    ]);

  y.domain([
      d3.min(list, function (d) {
        return d['y'];
      }), 
      d3.max(list, function (d) {
        return d['y'];
      })
  ]);

  color.domain(list.map(function (d) {
    return d.name;
  }))

  var setup = function (selection) {
    
    selection
        .attr('class', 'bubble data')
        .attr('cx', function (d) {
          return x(d['x']);
        })
        .attr('cy', function (d) {
          return y(d['y']);
        })
        .attr('cluster', function () {
          return parseInt((Math.random() * clusterNum), 10) + 1;
        })
        .style('fill', function (d) { return color(d.name); })
        .attr('r', 0)
        .transition()
        .duration(1000)
        .delay(function(d, i) {
            return  i * 20;
        })
        .ease('bounce')
        .attr('r', '10px');

  }

  chart.selectAll('.axis').remove();

  chart.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

  chart.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
    .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('x');

  rect = chart.selectAll('.bubble').data(list);

  rect.transition().duration(500).call(setup);

  rect.enter().append('circle')
      .on('mouseover', function (d) {
            d3.select(this)
                .transition()
                .duration(500)
                .style('fill', 'orange')
        })
        .on('mouseout', function (d) {
            d3.select(this)
                .transition()
                .duration(500)
                .style('fill', function (d) { return color(d.name); });
        }).call(setup);

  rect.exit().remove();
}

function firstCluster () {
    var dataset = d3.selectAll('.data')[0];
    
    d3.selectAll('.data')
        .data(dataset)
        .style({
            fill : function(d){
              return clusterColor[d3.select(this)[0][0].attributes.cluster.value];
            }
    })

    first = true;
}

function calCentroid () {
    var dataset = d3.selectAll('.data')[0];    
    var notMove = 0;
    
    // 重心の作成
    for (var i = 1; i <= clusterNum; i++) {
        var c = {
            "x": d3.mean(dataset, function (d) {
                var cx = d.getAttribute('cx');
                cluster = d.getAttribute('cluster');
                
                if (cluster == i) {
                    return parseInt(cx, 10);
                }
            }),
            "y": d3.mean(dataset, function (d) {
                var cy = d.getAttribute('cy');
                cluster = d.getAttribute('cluster');

                if (cluster == i) {
                    return parseInt(cy, 10);
                }
            }),
            "cluster": i
        }

        if (centroidArr.length >= clusterNum && c.x == centroidArr[i - 1].x && c.y == centroidArr[i - 1].y) {
            notMove++;
        }

        if (c.x >= 0) {
            centroidArr[i - 1] = c;
        }

    }

    if (notMove >= clusterNum) {
        d3.selectAll('.processDescription')
            .style({
                'background-color': function (d, i) {
                    if (i == 3) {
                        return 'white';
                    } else {
                        return 'gray';
                    }
                }
            });
        finish = true;
    }

    if (d3.selectAll('.centroid')[0].length > 0) {
        chart.selectAll('.centroid')
            .data(centroidArr)
            .transition()
            .duration(300)
            .ease('bounce')
            .attr({
                cx : function(d) { return d.x; },
                cy : function(d) { return d.y; }
            });
    } else {
         // データを点として打つ
        chart.selectAll('.centroid')
            .data(centroidArr)
            .enter()
            .append('circle')
            .attr({
                cx : function(d){
                  return d.x; },
                cy : function(d){
                  return d.y;
                },
                r : 0,
                'class': function(d){ return 'centroid cluster' + d.cluster; },
                fill : function(d){
                  return centroidColor[d.cluster];
                },
                "cluster" : function(d){ return d.cluster; }
            })
            .transition()
            .delay(function(d, i){
                return i * 5;
            }) 
            .duration(150)
            .ease('bounce')
            .attr({
                r: 7,
                stroke: "black" 
            });
    }
    centroid = false;
}

function calDistance() {
        d3.selectAll('.data')
            .transition()
            .delay(function(d, i){
                return i * 5;
            }) 
            .duration(150)
            .style({
               fill: function (d) {
                    min = 10000000;
                    cluster = 0;

                    for (var i = 1; i <= clusterNum; i++) {
                        distance = 
                            Math.sqrt(
                                Math.pow((centroidArr[i - 1].x - d3.select(this)[0][0].attributes.cx.value), 2) + Math.pow((centroidArr[i - 1].y - d3.select(this)[0][0].attributes.cy.value), 2)
                            );

                        if (min >= distance) {
                            min = distance;
                            cluster = i;
                        }
                    }
                    return clusterColor[cluster];
               }
             })
            .attr({
               cluster: function (d) {
                    min = 10000000;
                    cluster = 0;

                    for (var i = 1; i <= clusterNum; i++) {
                        // ユークリッド距離の計算
                        distance = 
                            Math.sqrt(
                                Math.pow((centroidArr[i - 1].x - d3.select(this)[0][0].attributes.cx.value), 2) + Math.pow((centroidArr[i - 1].y - d3.select(this)[0][0].attributes.cy.value), 2)
                            );
                        if (min >= distance) {
                            min = distance;
                            cluster = i;
                        }
                    }
                    return cluster;
               }
            });
    centroid = true;
}