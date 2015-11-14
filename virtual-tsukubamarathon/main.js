//# require=d3

var margin = {
	top: 0,
	right: 0,
	bottom: 0,
	left: 0
};

//pathdata
var pathdata = "M933,834 L934,793 L925,770 L920,752 L884,764 L887,660 L912,652 L938,650 L936,621 L899,566 L894,560 L890,563 L874,586 L874,620 L878,638 L812,655 L794,656 L760,653 L726,662 L709,671 L686,672 L634,689 L632,699 L646,704 L644,696 L620,631 L619,555 L687,354 L699,329 L715,314 L696,284 L674,165 L672,105 L656,25 L633,29 L607,26 L581,31 L557,40 L540,40 L454,7 L378,104 L365,109 L308,110 L315,213 L290,261 L254,509 L275,509 L289,499 L280,760 L237,760 L236,795 L210,903 L208,934 L238,996 L246,1034 L244,1094 L249,1158 L276,1190 L402,1148 L441,1148 L474,1151 L520,1151 L542,1154 L559,1162 L566,1159 L584,1132 L584,1120 L560,1106 L556,1086 L575,1084 L597,1072 L625,1048 L626,1042 L614,1042 L587,1066 L569,1076 L552,1077 L558,1014 L498,1010 L492,1007 L482,999 L485,905 L478,855 L450,793 L496,780 L526,780 L558,788 L588,804 L645,810 L725,838 L728,820 L748,798 L652,710 L637,711 L624,706 L622,684 L644,674 L675,664 L698,662 L743,644 L798,644 L815,645 L884,623 L898,669 L924,660 L947,659 L966,692 L964,702 L954,698 L944,672 L934,669 L927,670 L908,676 L901,685 L908,693 L935,758 L945,796 L948,836 L954,848 L966,848 L978,845 L980,836 L980,810";
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
var str = "M933,834 L934,793 L925,770 L920,752 L884,764 L887,660 L912,652 L938,650 L936,621 L899,566 L894,560 L890,563 L874,586 L874,620 L878,638 L812,655 L794,656 L760,653 L726,662 L709,671 L686,672 L634,689 L632,699 L646,704 L644,696 L620,631 L619,555 L687,354 L699,329 L715,314 L696,284 L674,165 L672,105 L656,25 L633,29 L607,26 L581,31 L557,40 L540,40 L454,7 L378,104 L365,109 L308,110 L315,213 L290,261 L254,509 L275,509 L289,499 L280,760 L237,760 L236,795 L210,903 L208,934 L238,996 L246,1034 L244,1094 L249,1158 L276,1190 L402,1148 L441,1148 L474,1151 L520,1151 L542,1154 L559,1162 L566,1159 L584,1132 L584,1120 L560,1106 L556,1086 L575,1084 L597,1072 L625,1048 L626,1042 L614,1042 L587,1066 L569,1076 L552,1077 L558,1014 L498,1010 L492,1007 L482,999 L485,905 L478,855 L450,793 L496,780 L526,780 L558,788 L588,804 L645,810 L725,838 L728,820 L748,798 L652,710 L637,711 L624,706 L622,684 L644,674 L675,664 L698,662 L743,644 L798,644 L815,645 L884,623 L898,669 L924,660 L947,659 L966,692 L964,702 L954,698 L944,672 L934,669 L927,670 L908,676 L901,685 L908,693 L935,758 L945,796 L948,836 L954,848 L966,848 L978,845 L980,836 L980,810";
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