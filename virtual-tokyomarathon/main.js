//# require=d3

var margin = {
	top: 0,
	right: 0,
	bottom: 0,
	left: 0
};

//pathdata
var pathdata ="M12,323 L3,288 L35,280 L56,289 L64,270 L97,262 L193,296 L244,302 L260,297 L280,301 L351,276 L391,300 L402,302 L437,302 L466,291 L572,139 L619,178 L629,200 L656,200 L684,210 L681,228 L696,306 L725,310 L745,323 L755,374 L736,433 L696,509 L726,529 L679,631 L662,680 L643,738 L634,789 L631,832 L615,919 L560,964 L549,980 L532,1029 L529,1045 L508,1085 L492,1181 L508,1183 L516,1121 L525,1079 L543,1054 L553,1004 L571,979 L611,940 L628,930 L644,829 L647,773 L736,539 L786,585 L836,527 L882,426 L951,451 L966,417 L1032,378 L1001,310 L1001,259 L1032,169 L1099,87 L1112,16 L1141,28 L1113,92 L1065,148 L1046,174 L1015,257 L1014,308 L1047,380 L977,431 L968,442 L958,472 L888,436 L839,544 L800,594 L853,654 L903,603 L953,619 L1039,726 L1042,767 L1083,760 L1180,888 L1190,954 L1158,957 L1127,1012 L1102,1038 L1064,1064 L1116,1146 L1155,1118 L1161,1142";
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
var str = "M12,323 L3,288 L35,280 L56,289 L64,270 L97,262 L193,296 L244,302 L260,297 L280,301 L351,276 L391,300 L402,302 L437,302 L466,291 L572,139 L619,178 L629,200 L656,200 L684,210 L681,228 L696,306 L725,310 L745,323 L755,374 L736,433 L696,509 L726,529 L679,631 L662,680 L643,738 L634,789 L631,832 L615,919 L560,964 L549,980 L532,1029 L529,1045 L508,1085 L492,1181 L508,1183 L516,1121 L525,1079 L543,1054 L553,1004 L571,979 L611,940 L628,930 L644,829 L647,773 L736,539 L786,585 L836,527 L882,426 L951,451 L966,417 L1032,378 L1001,310 L1001,259 L1032,169 L1099,87 L1112,16 L1141,28 L1113,92 L1065,148 L1046,174 L1015,257 L1014,308 L1047,380 L977,431 L968,442 L958,472 L888,436 L839,544 L800,594 L853,654 L903,603 L953,619 L1039,726 L1042,767 L1083,760 L1180,888 L1190,954 L1158,957 L1127,1012 L1102,1038 L1064,1064 L1116,1146 L1155,1118 L1161,1142";

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