//# require=d3

var margin = {
	top: 0,
	right: 0,
	bottom: 0,
	left: 0
};

//pathdata
var pathdata = "M781,1034 L707,1055 L684,903 L691,896 L813,894 L861,860 L925,856 L958,842 L1014,943 L1016,956 L1013,966 L1004,976 L1014,986 L1024,986 L1060,961 L1109,934 L1127,928 L1145,919 L1146,908 L1117,857 L1118,846 L1092,814 L958,584 L949,582 L882,657 L881,668 L866,668 L832,661 L822,662 L809,669 L703,743 L703,726 L725,711 L732,700 L711,560 L702,544 L689,533 L671,526 L653,522 L527,544 L511,543 L505,539 L501,531 L394,143 L389,139 L135,117 L131,122 L133,158 L137,162 L183,157 L275,163 L347,179 L354,176 L357,154 L361,150 L384,152 L488,540 L495,551 L504,557 L530,558 L654,538 L665,539 L678,544 L694,558 L699,571 L717,684 L716,694 L712,702 L660,739 L648,756 L636,779 L631,800 L609,819 L606,829 L607,855 L610,874 L618,906 L617,913 L598,918 L582,918 L554,925 L540,924 L483,936 L478,942 L478,968 L475,971 L439,975 L375,987 L372,992 L375,1013 L377,1041 L382,1056 L367,1056 L294,1039 L49,1031 L48,1033 L45,1037 L48,1042 L54,1044 L170,1046 L288,1053 L386,1072 L485,1079 L496,1072 L488,1013 L685,979 L689,975 L679,901 L690,892 L809,889 L841,862 L862,854 L925,851 L936,847 L955,837 L962,837 L1019,942 L1021,958 L1018,968 L1010,977 L1018,981 L1024,981 L1050,961 L1102,931 L1137,916 L1140,908 L1111,857 L1112,847 L1084,812 L1069,788 L952,587 L887,659 L887,678 L923,742 L930,742 L973,716 L980,717 L995,742 L994,746 L942,779 L936,776 L879,674 L866,675 L829,666 L828,670 L704,751 L698,749 L699,724 L722,706 L727,692 L708,565 L700,547 L683,535 L667,530 L644,528 L520,550 L505,547 L497,535 L390,145 L268,137 L135,122 L138,159 L179,154 L264,157 L349,174 L356,146 L387,148 L494,541 L501,550 L519,555 L651,534 L664,534 L680,540 L693,549 L703,568 L721,689 L719,699 L715,705 L662,746 L641,780 L636,803 L626,812 L613,822 L609,832 L611,851 L622,907 L620,918 L555,930 L546,928 L483,941 L482,974 L376,992 L385,1061 L289,1043 L55,1035 L50,1037 L57,1040 L284,1047 L369,1065 L478,1074 L500,1063 L494,1018 L692,984 L699,1050 L757,1034 L752,1007";
//size
var width = root.clientWidth - margin.left - margin.right;
var height = root.clientHeight - margin.top - margin.bottom;

//初期データを登録する。
	var rr = 25;
	var ref1 = 8;
	eval ("c" + 1 + "= [\"Osone\",\"0\",\"58\",\"23\",\"ffffff\",0, 0, rr,\"id1\"]");
	eval ("c" + 2 + "= [\"Tajitsu\",\"1\",\"12\",\"34\",\"ffffff\",0, 0, rr,\"id2\"]");
	eval ("c" + 3 + "= [\"Wat\",\"2\",\"10\",\"12\",\"ffffff\",0, 0, rr,\"id3\"]");

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
	arrTemp.push("");
	arrTemp.push("03");
	arrTemp.push("00");
	arrTemp.push("00");
	arrTemp.push("ff0000");
	arrTemp.push("0");
	arrTemp.push("0");
	arrTemp.push(0);
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
var str = "M781,1034 L707,1055 L684,903 L691,896 L813,894 L861,860 L925,856 L958,842 L1014,943 L1016,956 L1013,966 L1004,976 L1014,986 L1024,986 L1060,961 L1109,934 L1127,928 L1145,919 L1146,908 L1117,857 L1118,846 L1092,814 L958,584 L949,582 L882,657 L881,668 L866,668 L832,661 L822,662 L809,669 L703,743 L703,726 L725,711 L732,700 L711,560 L702,544 L689,533 L671,526 L653,522 L527,544 L511,543 L505,539 L501,531 L394,143 L389,139 L135,117 L131,122 L133,158 L137,162 L183,157 L275,163 L347,179 L354,176 L357,154 L361,150 L384,152 L488,540 L495,551 L504,557 L530,558 L654,538 L665,539 L678,544 L694,558 L699,571 L717,684 L716,694 L712,702 L660,739 L648,756 L636,779 L631,800 L609,819 L606,829 L607,855 L610,874 L618,906 L617,913 L598,918 L582,918 L554,925 L540,924 L483,936 L478,942 L478,968 L475,971 L439,975 L375,987 L372,992 L375,1013 L377,1041 L382,1056 L367,1056 L294,1039 L49,1031 L48,1033 L45,1037 L48,1042 L54,1044 L170,1046 L288,1053 L386,1072 L485,1079 L496,1072 L488,1013 L685,979 L689,975 L679,901 L690,892 L809,889 L841,862 L862,854 L925,851 L936,847 L955,837 L962,837 L1019,942 L1021,958 L1018,968 L1010,977 L1018,981 L1024,981 L1050,961 L1102,931 L1137,916 L1140,908 L1111,857 L1112,847 L1084,812 L1069,788 L952,587 L887,659 L887,678 L923,742 L930,742 L973,716 L980,717 L995,742 L994,746 L942,779 L936,776 L879,674 L866,675 L829,666 L828,670 L704,751 L698,749 L699,724 L722,706 L727,692 L708,565 L700,547 L683,535 L667,530 L644,528 L520,550 L505,547 L497,535 L390,145 L268,137 L135,122 L138,159 L179,154 L264,157 L349,174 L356,146 L387,148 L494,541 L501,550 L519,555 L651,534 L664,534 L680,540 L693,549 L703,568 L721,689 L719,699 L715,705 L662,746 L641,780 L636,803 L626,812 L613,822 L609,832 L611,851 L622,907 L620,918 L555,930 L546,928 L483,941 L482,974 L376,992 L385,1061 L289,1043 L55,1035 L50,1037 L57,1040 L284,1047 L369,1065 L478,1074 L500,1063 L494,1018 L692,984 L699,1050 L757,1034 L752,1007";
	var path3 = svg.append("path")
	.attr({
		'd': str,
		'fill': "none",
		'transform': "translate("+data[1][5]/(1200/width)+","+data[1][6]/(1200/root.clientHeight)+")",
	});

for (var j=1 ; j<data.length  ; j++){
	if (data[j][0] == "" || data[j][1] == "" || data[j][2] == "" || data[j][3] == "" || data[j][4] == "") {
		continue;
	}

	eval("drawArea.selectAll('#id" + j  + "')")
	.transition()
	// x秒かけて一周させる
	.duration((parseInt(data[j][1]) * 3600 + parseInt(data[j][2]) * 60 + parseInt(data[j][3]))* 20)
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
	.duration((parseInt(data[j][1]) * 3600 + parseInt(data[j][2]) * 60 + parseInt(data[j][3]))* 20)
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