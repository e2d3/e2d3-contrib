//# require=d3

var margin = {
	top: 0,
	right: 0,
	bottom: 0,
	left: 0
};

//pathdata
var pathdata = "M117,756 L109,761 L120,781 L92,812 L83,797 L72,803 L60,781 L28,803 L47,832 L73,820 L86,850 L88,872 L84,914 L92,917 L100,912 L102,878 L99,851 L126,853 L127,824 L146,781 L194,811 L216,819 L258,728 L258,699 L265,684 L274,633 L294,582 L332,534 L358,514 L376,542 L406,554 L422,524 L446,547 L470,559 L489,560 L512,570 L518,554 L561,572 L550,604 L526,611 L518,618 L512,625 L509,638 L577,655 L584,658 L586,661 L584,665 L579,667 L570,666 L567,673 L582,676 L568,699 L592,713 L592,723 L600,723 L620,713 L705,746 L695,767 L750,762 L769,763 L811,775 L805,787 L815,829 L833,817 L983,884 L985,900 L1026,894 L1032,929 L982,937 L983,997 L953,1066 L1005,1097 L1018,1109 L1040,1138 L1053,1148 L1090,1163 L1103,1167 L1116,1167 L1132,1124 L1109,1114 L1130,1070 L1119,1065 L1125,1060 L1133,1062 L1139,1057 L1132,1040 L1135,1034 L1143,1040 L1144,1049 L1149,1054 L1152,1058";
//size
var width = root.clientWidth - margin.left - margin.right;
var height = root.clientHeight - margin.top - margin.bottom;

//初期データを登録する。
	var rr = 25;
	var ref1 = 8;
	eval ("c" + 1 + "= [\"デニス\",\"02\",\"02\",\"57\",\"2398ff\",0, 0, rr,\"id1\"]");
	eval ("c" + 2 + "= [\"ポーラ\",\"02\",\"15\",\"25\",\"2398ff\",0, 0, rr,\"id2\"]");
	eval ("c" + 3 + "= [\"サブ３\",\"03\",\"00\",\"00\",\"2398ff\",0, 0, rr,\"id3\"]");

	var arrInitial = new Array();
	arrInitial.push(c1);
	arrInitial.push(c2);
	arrInitial.push(c3);

	movecircle(arrInitial);

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function update(data) {

rr = 25;

var arrInitial = new Array();

	var arrTemp = new Array();
	arrTemp.push("サブ３");
	arrTemp.push("03");
	arrTemp.push("00");
	arrTemp.push("00");
	arrTemp.push("ff0000");
	arrTemp.push("0");
	arrTemp.push("0");
	arrTemp.push(rr);
	arrTemp.push("id0");
	arrInitial.push(arrTemp);

for (var i=1 ; i<=data.length -1 ; i++){
	var arrTemp = new Array();
	arrTemp.push(eval("data[" + i + "][0]"));
	arrTemp.push(eval("data[" + i + "][1]"));
	arrTemp.push(eval("data[" + i + "][2]"));
	arrTemp.push(eval("data[" + i + "][3]"));
	arrTemp.push(eval("data[" + i + "][4]"));
	arrTemp.push("0");
	arrTemp.push("0");
	arrTemp.push(rr);
	arrTemp.push(eval("\"id" + i + "\""));
	arrInitial.push(arrTemp);
}
 movecircle(arrInitial);
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
			offset: "100%",
			color: "rgb(0,0,0)",
			opacity: "0.2"
		}, {
			offset: "100%",
			color: "rgb(0,0,0)",
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
			//fill: 'url(#gGradient)',
			y: height - margin.bottom
		});
}

	// 動かしたい円を指定する
function movecircle(data){
//draw background-image (should be called before base-svg creation)
d3.select(root).append('img')
	.attr({
		width: width,
		height: root.clientHeight,
		src: baseUrl + '/map.jpg',
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

// defs/markerという構造で、svgの下に矢印を定義
	var marker = drawArea.append("defs").append("marker")
//	var marker = d3.select(root).append("defs").append("marker")
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
//	var g = d3.select(root).selectAll('g')
	.data(data).enter().append('g')
	.attr({
	// 座標設定を動的に行う
		id: function(d) { return d[8]; },
		transform: function(d) {
	return "translate(" + d[5] + "," + d[6] + ")";
		},
	});
	g.append('circle')
	.attr({
		'r': function(d,i) { return parseInt(data[i][7]); },
		'fill': function(d,i) { return color(i); },
	});

	g.append('text')
	.attr({
		'text-anchor': "middle",
		'dy': ".35em",
		'fill': 'black',
	})
	.text(function(d,i) { return data[i][0]; });

	var line = d3.svg.line()

	var path = svg.append('path')
		.attr({
		'd': line(arrInitial),
		'id': 'nodepath',
		'stroke': 'lightgreen',
		'stroke-width': 5,
		'fill': 'none',
		});
	var t = path.node().getTotalLength();
	var tdiff = t - (rr+rr+ref1);
	path.attr({
	'stroke-dasharray': "0 " + rr + " " + tdiff + " " + rr,
	'stroke-dashoffset': 0,
	});
	var t2 = t*2;
var str = "M117,756 L109,761 L120,781 L92,812 L83,797 L72,803 L60,781 L28,803 L47,832 L73,820 L86,850 L88,872 L84,914 L92,917 L100,912 L102,878 L99,851 L126,853 L127,824 L146,781 L194,811 L216,819 L258,728 L258,699 L265,684 L274,633 L294,582 L332,534 L358,514 L376,542 L406,554 L422,524 L446,547 L470,559 L489,560 L512,570 L518,554 L561,572 L550,604 L526,611 L518,618 L512,625 L509,638 L577,655 L584,658 L586,661 L584,665 L579,667 L570,666 L567,673 L582,676 L568,699 L592,713 L592,723 L600,723 L620,713 L705,746 L695,767 L750,762 L769,763 L811,775 L805,787 L815,829 L833,817 L983,884 L985,900 L1026,894 L1032,929 L982,937 L983,997 L953,1066 L1005,1097 L1018,1109 L1040,1138 L1053,1148 L1090,1163 L1103,1167 L1116,1167 L1132,1124 L1109,1114 L1130,1070 L1119,1065 L1125,1060 L1133,1062 L1139,1057 L1132,1040 L1135,1034 L1143,1040 L1144,1049 L1149,1054 L1152,1058";

	var path3 = svg.append("path")
	.attr({
		'd': str,
		'fill': "none",
		'transform': "translate("+data[1][5]/(1200/width)+","+data[1][6]/(1200/root.clientHeight)+")",
	});

for (var j=1 ; j<data.length  ; j++){
	eval("drawArea.selectAll('#id" + j  + "')")
	.transition()
	// x秒かけて一周させる
	.duration((parseInt(data[j][1]) * 3600 + parseInt(data[j][2]) * 60 + parseInt(data[j][3]))* 10)
	.ease("linear")
	.attrTween(
	// 座標設定を動的に行う
		'transform', function(d,j) {
		return function(t) {
			// path(ここでは円)の座標を取得
			var p = path3.node().getPointAtLength(path3.node().getTotalLength()*t);
			data[1][5] = (data[j][5]+p.x)/(1200/width);
			data[1][6] = (data[j][6]+p.y)/(1200/root.clientHeight);
			return "translate(" + data[1][5] + "," +data[1][6] + ")";
		};
		}
	)

}

var j = 0;
	eval("drawArea.selectAll('#id" + j  + "')")
	.transition()
	// x秒かけて一周させる
	.duration((parseInt(data[j][1]) * 3600 + parseInt(data[j][2]) * 60 + parseInt(data[j][3]))* 10)
	// easeを指定すると、transitionで変化させるパラメータを[0->1]にすることができる。
	.ease("linear")
	.attrTween(
	// 座標設定を動的に行う
		'transform', function(d,j) {
		// easeで設定したパラメータがtとなって渡ってくる
		return function(t) {
			// path(ここでは円)の座標を取得
			var p = path3.node().getPointAtLength(path3.node().getTotalLength()*t);
			data[1][5] = (data[j][5]+p.x)/(1200/width);
			data[1][6] = (data[j][6]+p.y)/(1200/root.clientHeight);
			return "translate(" + data[1][5] + "," +data[1][6] + ")";
		};
		}
	)
	.each("end", function() {movecircle(data)});

	
	};