//# require=d3

var margin = {
	top: 0,
	right: 0,
	bottom: 0,
	left: 0
};

//pathdata
var pathdata = "M449,977 L455,974 L461,967 L460,925 L393,935 L414,1025 L415,1064 L426,1072 L423,1081 L448,1128 L473,1113 L477,1114 L476,1120 L489,1142 L498,1142 L614,1074 L614,1064 L600,1047 L588,1046 L574,1055 L554,1018 L525,1035 L520,1026 L556,1006 L557,982 L525,933 L521,909 L516,904 L498,897 L489,886 L436,893 L432,866 L470,858 L464,828 L419,836 L412,814 L372,818 L386,744 L389,553 L367,426 L368,399 L375,370 L405,312 L408,280 L386,140 L392,128 L436,106 L462,100 L493,101 L513,108 L525,121 L535,143 L576,390 L688,374 L722,566 L817,540 L808,683 L790,682 L787,747 L778,781 L761,781 L747,794 L740,792 L739,784 L745,777 L758,771 L774,764 L778,682 L775,659 L789,658 L789,631 L802,631 L804,599 L764,565 L712,578 L679,387 L565,403 L519,129 L507,119 L478,110 L457,110 L436,116 L410,128 L399,142 L397,161 L418,281 L419,306 L411,329 L382,383 L376,410 L378,444 L398,554 L398,743 L385,809 L418,804 L425,824 L399,832 L419,924 L450,917 L452,962 L445,966";
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
var str = "M449,977 L455,974 L461,967 L460,925 L393,935 L414,1025 L415,1064 L426,1072 L423,1081 L448,1128 L473,1113 L477,1114 L476,1120 L489,1142 L498,1142 L614,1074 L614,1064 L600,1047 L588,1046 L574,1055 L554,1018 L525,1035 L520,1026 L556,1006 L557,982 L525,933 L521,909 L516,904 L498,897 L489,886 L436,893 L432,866 L470,858 L464,828 L419,836 L412,814 L372,818 L386,744 L389,553 L367,426 L368,399 L375,370 L405,312 L408,280 L386,140 L392,128 L436,106 L462,100 L493,101 L513,108 L525,121 L535,143 L576,390 L688,374 L722,566 L817,540 L808,683 L790,682 L787,747 L778,781 L761,781 L747,794 L740,792 L739,784 L745,777 L758,771 L774,764 L778,682 L775,659 L789,658 L789,631 L802,631 L804,599 L764,565 L712,578 L679,387 L565,403 L519,129 L507,119 L478,110 L457,110 L436,116 L410,128 L399,142 L397,161 L418,281 L419,306 L411,329 L382,383 L376,410 L378,444 L398,554 L398,743 L385,809 L418,804 L425,824 L399,832 L419,924 L450,917 L452,962 L445,966";
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