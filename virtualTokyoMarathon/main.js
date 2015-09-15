//# require=d3

var margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
};



//window.alert(data.length);

//pathdata
var pathdata = "M0,0 L20,154 L15,322 L43,318 L65,323 L73,308 L97,300 L116,303 L186,327 L246,335 L264,333 L276,335 L327,319 L375,325 L396,335 L436,333 L461,324 L494,296 L523,247 L551,203 L563,191 L598,217 L623,249 L662,248 L682,283 L687,313 L685,339 L723,350 L734,359 L740,383 L736,400 L682,519 L714,535 L689,569 L665,623 L615,749 L598,886 L551,918 L531,944 L482,1071 L477,1123 L484,1129 L493,1122 L495,1076 L544,951 L561,931 L570,921 L614,897 L630,750 L701,574 L726,545 L771,586 L815,533 L865,437 L931,467 L947,439 L1005,402 L981,364 L974,345 L984,275 L1003,228 L1030,187 L1039,177 L1065,152 L1093,107 L1100,75 L1125,87 L1077,161 L1049,189 L1038,201 L1013,241 L967,283 L994,297 L989,343 L999,363 L1028,408 L960,449 L938,487 L872,459 L828,544 L784,597 L837,650 L866,621 L883,602 L927,619 L951,640 L1014,712 L1017,747 L1060,745 L1155,863 L1163,916 L1131,923 L1092,977 L1040,1010 L1090,1087 L1125,1065 L1129,1098";


//size
var width = root.clientWidth - margin.left - margin.right;
var height = root.clientHeight - margin.top - margin.bottom;


//draw background-image (should be called before base-svg creation)
d3.select(root).append('img')
    .attr({
        width: width,
        height: root.clientHeight,
        src: baseUrl + '/map.png',
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

  var rr = 15;
  
  var ref1 = 8;
  var c1 = [0, 0, rr,"id1","選手1","1:11:45","239823"];
  var c2 = [0, 0, rr,"id2","選手2","1:22:45","9823ff"];
  var c3 = [0, 0, rr,"id3","選手3","1:33:45","982323"];
  var c4 = [0, 0, rr,"id4","選手4","1:23:45","23ff23"];
  var c5 = [0, 0, rr,"id5","選手5","1:34:45","2398ff"];
  var carray = [c1, c2, c3, c4, c5];


d3.csv("")
  // defs/markerという構造で、svgの下に矢印を定義します。
  var marker = drawArea.append("defs").append("marker")
//  var marker = d3.select(root).append("defs").append("marker")

      .attr({
        'id': "arrowhead",
        'refX': ref1,
        'refY': 2,
        'markerWidth': 4,
        'markerHeight': 4,
        'orient': "auto"
      });
  // 矢印の形をpathで定義します。
  marker.append("path")
      .attr({
        d: "M 0,0 V 4 L4,2 Z",
        fill: "steelblue"
      });




  // 10種類の色を返す関数を使う
  var color = d3.scale.category10();



  var g = drawArea.selectAll('g')
//  var g = d3.select(root).selectAll('g')
    .data(carray).enter().append('g')
    .attr({
    // 座標設定を動的に行う
      id: function(d) { return d[3]; },
      transform: function(d) {
    return "translate(" + d[0] + "," + d[1] + ")";
      },
    });

  g.append('circle')
    .attr({
      'r': function(d) { return d[2]; },
      'fill': function(d,i) { return color(i); },
    });

  g.append('text')
    .attr({
      'text-anchor': "middle",
      'dy': ".35em",
      'fill': 'white',
    })
    .text(function(d,i) { return i+2; });



  var line = d3.svg.line()
//  var line = d3.select(root).line()
      .interpolate('basis')
      .x(function(d) {return d[0];})
      .y(function(d) {return d[1];});



  var path = svg.append('path')
//  var path = d3.select(root).append('path')
      .attr({
        'd': line(carray),
        'id': 'nodepath',
        'stroke': 'lightgreen',
        'stroke-width': 5,
        'fill': 'none',
        // pathのアトリビュートとして、上で定義した矢印を指定します
        'marker-end':"url(#arrowhead)",
      });
  var t = path.node().getTotalLength();
  var tdiff = t - (rr+rr+ref1);
  path.attr({
    'stroke-dasharray': "0 " + rr + " " + tdiff + " " + rr,
    'stroke-dashoffset': 0,
  });
  var t2 = t*2;
  // pathとしての円を描くのに、d3.svg.lineで点を並べてつなぐ方法は遅いので、svgのpath:aコマンドを使用
  // 参考：http://stackoverflow.com/questions/5737975/circle-drawing-with-svgs-arc-path
  // パスは表示しないので、strokeを定義しない。
//  var str = "M0,0 M-" + t + ",0 a" + t + ","+ t + " 0 1,1 " + t2 + ",0 a" + t + "," + t + " 0 1,1 -" + t2 + ",0";
var str = "M20,357 L15,322 L43,318 L65,323 L73,308 L97,300 L116,303 L186,327 L246,335 L264,333 L276,335 L327,319 L375,325 L396,335 L436,333 L461,324 L494,296 L523,247 L551,203 L563,191 L598,217 L623,249 L662,248 L682,283 L687,313 L685,339 L723,350 L734,359 L740,383 L736,400 L682,519 L714,535 L689,569 L665,623 L615,749 L598,886 L551,918 L531,944 L482,1071 L477,1123 L484,1129 L493,1122 L495,1076 L544,951 L561,931 L570,921 L614,897 L630,750 L701,574 L726,545 L771,586 L815,533 L865,437 L931,467 L947,439 L1005,402 L981,364 L974,345 L984,275 L1003,228 L1030,187 L1039,177 L1065,152 L1093,107 L1100,75 L1125,87 L1077,161 L1049,189 L1038,201 L1013,241 L997,283 L994,297 L989,343 L999,363 L1028,408 L960,449 L938,487 L872,459 L828,544 L784,597 L837,650 L866,621 L883,602 L927,619 L951,640 L1014,712 L1017,747 L1060,745 L1155,863 L1163,916 L1131,923 L1092,977 L1040,1010 L1090,1087 L1125,1065 L1129,1098";
//var str = "M0,0 L-50,-0 L-200,-123 L15,12 L89,11";


  var path3 = svg.append("path")
//  var path3 = d3.select(root).append("path")
    .attr({
      'd': str,
      'fill': "none",
      // 下のコメントを外すと、pathが表示できる
      // 'stroke': "lightgreen",
      'transform': "translate("+c1[0]/(1200/width)+","+c1[1]/(1200/root.clientHeight)+")",
    });








  movecircle();






function update(data) {


    var sales_data = data;

rr = 5;

  var c1 = [0, 0, rr,"id1","選手1","1:11:45","239823"];
  var c2 = [0, 0, rr,"id2","選手2","1:22:45","9823ff"];
  var c3 = [0, 0, rr,"id3","選手3","1:33:45","982323"];
  var c4 = [0, 0, rr,"id4","選手4","1:23:45","23ff23"];
  var c5 = [0, 0, rr,"id5","選手5","1:34:45","2398ff"];
  var carray = [c1, c2, c3, c4, c5];




//window.alert(data[0][0]);


 movecircle();

}

function draw(m, data) {
    if (preMetrics !== m) {
        remove();
    }
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
    var dots = drawArea
        .selectAll('.' + metrics + 'class')
        .data(data, function(d, i) {
            return d.syurui + metrics;
        })

    var newDots = symbols.appendSymbol(dots.enter(), metrics)
        .attr('class', metrics + 'class')

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

    // backbround
    background
        .append('rect')
        .attr({
            class: 'background',
            width: width,
            height: height,
            fill: 'url(#sGradient)'
        });

    // backbround-ground
    background
        .append('rect')
        .attr({
            class: 'background',
            width: width,
            height: margin.bottom,
            fill: 'url(#gGradient)',
            y: height - margin.bottom
        });
}
















  // 動かしたい円を指定する（あらかじめidを設定している） 
  function movecircle(){
    drawArea.selectAll('#id1')
    .transition()
    // ６秒かけて一周させる
    .duration(100000)
    // easeを指定すると、transitionで変化させるパラメータを[0->1]にすることができる。
    .ease("linear")
    .attrTween(
    // 座標設定を動的に行う
      'transform', function(d,i) {
        // easeで設定したパラメータがtとなって渡ってくる
        return function(t) {
          // path(ここでは円)の座標を取得する
          var p = path3.node().getPointAtLength(path3.node().getTotalLength()*t);
          c2[0] = (c1[0]+p.x)/(1200/width);
          c2[1] = (c1[1]+p.y)/(1200/root.clientHeight);
          // 矢印線の座標も変更する。こちらもidを設定している
          //svg.selectAll('#nodepath').attr('d', line(carray));
          return "translate(" + c2[0] + "," + c2[1] + ")";
        };
      }
    )


  
    drawArea.selectAll('#id2')
    .transition()
    // ５秒かけて一周させる
    .duration(130000)
    // easeを指定すると、transitionで変化させるパラメータを[0->1]にすることができる。
    .ease("linear")
    .attrTween(
    // 座標設定を動的に行う
      'transform', function(d,i) {
        // easeで設定したパラメータがtとなって渡ってくる
        return function(t) {
          // path(ここでは円)の座標を取得する
          var p = path3.node().getPointAtLength(path3.node().getTotalLength()*t);
          c2[0] = (c1[0]+p.x)/(1200/width);
          c2[1] = (c1[1]+p.y)/(1200/root.clientHeight);
          // 矢印線の座標も変更する。こちらもidを設定している
          //drawArea.selectAll('#nodepath').attr('d', line(carray));
          return "translate(" + c2[0] + "," + c2[1] + ")";
        };
      }
    )




    drawArea.selectAll('#id3')
    .transition()
    // ５秒かけて一周させる
    .duration(110000)
    // easeを指定すると、transitionで変化させるパラメータを[0->1]にすることができる。
    .ease("linear")
    .attrTween(
    // 座標設定を動的に行う
      'transform', function(d,i) {
        // easeで設定したパラメータがtとなって渡ってくる
        return function(t) {
          // path(ここでは円)の座標を取得する
          var p = path3.node().getPointAtLength(path3.node().getTotalLength()*t);
          c2[0] = (c1[0]+p.x)/(1200/width);
          c2[1] = (c1[1]+p.y)/(1200/root.clientHeight);
          // 矢印線の座標も変更する。こちらもidを設定している
          //drawArea.selectAll('#nodepath').attr('d', line(carray));
          return "translate(" + c2[0] + "," + c2[1] + ")";
        };
      }
    )





    drawArea.selectAll('#id4')
    .transition()
    // ５秒かけて一周させる
    .duration(140000)
    // easeを指定すると、transitionで変化させるパラメータを[0->1]にすることができる。
    .ease("linear")
    .attrTween(
    // 座標設定を動的に行う
      'transform', function(d,i) {
        // easeで設定したパラメータがtとなって渡ってくる
        return function(t) {
          // path(ここでは円)の座標を取得する
          var p = path3.node().getPointAtLength(path3.node().getTotalLength()*t);
          c2[0] = (c1[0]+p.x)/(1200/width);
          c2[1] = (c1[1]+p.y)/(1200/root.clientHeight);
          // 矢印線の座標も変更する。こちらもidを設定している
          //drawArea.selectAll('#nodepath').attr('d', line(carray));
          return "translate(" + c2[0] + "," + c2[1] + ")";
        };
      }
    )





    drawArea.selectAll('#id5')
    .transition()
    // ５秒かけて一周させる
    .duration(160000)
    // easeを指定すると、transitionで変化させるパラメータを[0->1]にすることができる。
    .ease("linear")
    .attrTween(
    // 座標設定を動的に行う
      'transform', function(d,i) {
        // easeで設定したパラメータがtとなって渡ってくる
        return function(t) {
          // path(ここでは円)の座標を取得する
          var p = path3.node().getPointAtLength(path3.node().getTotalLength()*t);
          c2[0] = (c1[0]+p.x)/(1200/width);
          c2[1] = (c1[1]+p.y)/(1200/root.clientHeight);
          // 矢印線の座標も変更する。こちらもidを設定している
          //drawArea.selectAll('#nodepath').attr('d', line(carray));
          return "translate(" + c2[0] + "," + c2[1] + ")";
        };
      }
    )
































    // 次の行のコメントするとループしなくなる
    //.each("end", function() {movecircle()});
  };




