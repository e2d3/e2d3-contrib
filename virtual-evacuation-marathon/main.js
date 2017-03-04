//# require=d3

var margin = {
	top: 0,
	right: 0,
	bottom: 0,
	left: 0
};

//pathdata
var pathdata = "M33,780 L31,763 L39,747 L49,756 L63,748 L81,755 L99,762 L118,765 L137,761 L156,756 L174,762 L192,763 L209,752 L220,732 L232,708 L243,687 L257,703 L272,718 L286,730 L304,731 L320,742 L336,733 L348,744 L354,768 L361,792 L363,816 L373,831 L389,835 L401,815 L418,802 L410,782 L406,759 L407,733 L416,709 L427,687 L441,668 L450,646 L456,636 L446,658 L434,678 L427,694 L444,701 L456,716 L458,743 L459,769 L460,795 L462,821 L461,847 L452,870 L449,893 L464,905 L448,893 L451,869 L461,847 L461,822 L460,797 L459,771 L457,744 L456,719 L447,702 L429,695 L416,711 L409,732 L406,758 L409,783 L418,804 L401,817 L390,832 L377,834 L360,824 L352,847 L343,870 L332,890 L318,890 L305,875 L294,895 L285,918 L278,943 L272,968 L267,992 L264,1018 L262,1045 L254,1065 L239,1081 L230,1104 L223,1128 L217,1152 L217,1150 L223,1125 L230,1102 L238,1079 L253,1064 L261,1045 L264,1021 L266,995 L270,971 L278,947 L284,922 L291,899 L301,878 L312,869 L316,843 L314,825";
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
var str = "M102,237 L94,197 L119,162 L150,182 L192,165 L247,180 L302,195 L360,202 L418,195 L475,182 L531,197 L585,199 L638,173 L672,127 L708,73 L741,25 L786,61 L830,95 L872,122 L927,126 L976,150 L1026,129 L1063,155 L1081,210 L1101,265 L1109,320 L1140,354 L1186,363 L1223,318 L1275,288 L1250,243 L1239,189 L1244,130 L1271,76 L1302,24 L1345,0 L1375,0 L1392,0 L1361,0 L1324,3 L1304,39 L1356,55 L1392,91 L1397,151 L1401,212 L1405,272 L1410,332 L1408,391 L1379,443 L1370,496 L1415,523 L1368,497 L1377,442 L1406,392 L1408,334 L1404,275 L1400,216 L1396,156 L1391,98 L1364,59 L1309,42 L1270,79 L1248,127 L1239,187 L1249,244 L1276,292 L1225,323 L1192,357 L1149,361 L1099,338 L1074,392 L1046,445 L1012,490 L970,490 L930,456 L896,502 L869,555 L850,612 L829,667 L814,724 L807,784 L800,844 L775,890 L728,927 L701,980 L679,1035 L664,1090 L663,1085 L680,1029 L703,976 L728,922 L773,888 L797,845 L805,791 L811,731 L825,674 L847,619 L868,563 L888,511 L919,461 L951,441 L965,382 L958,341";

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