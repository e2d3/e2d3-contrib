//# require=d3

var margin = {
	top: 0,
	right: 0,
	bottom: 0,
	left: 0
};

//pathdata
var pathdata = "M653,689 L675,670 L694,664 L708,656 L734,629 L807,621 L831,619 L844,613 L868,587 L903,574 L957,590 L992,595 L1017,591 L1037,586 L1046,602 L1061,613 L1057,646 L1057,668 L1089,757 L1104,763 L1114,771 L1158,775 L1179,560 L1181,561 L1154,558 L1132,549 L1123,532 L1066,513 L1049,517 L1036,516 L1024,521 L1003,532 L982,536 L950,530 L925,538 L918,550 L903,556 L878,565 L850,570 L814,570 L794,552 L797,535 L800,475 L784,455 L764,442 L699,420 L600,394 L605,539 L597,539 L592,544 L591,552 L517,546 L499,552 L464,577 L447,607 L445,617 L444,665 L315,663 L299,672 L266,673 L250,663 L177,662 L149,651 L134,638 L126,624 L103,621 L80,632 L66,647 L57,692 L127,697 L146,703 L159,715 L175,725 L200,731 L378,732 L429,706 L647,711 L685,676 L711,668 L738,636 L834,628 L853,618 L872,597 L897,585 L910,584 L971,603 L989,605 L1033,595 L1041,607 L1052,617 L1048,652 L1051,672 L1088,767 L1098,769 L1109,780 L1165,784 L1189,553 L1160,552 L1143,544 L1134,535 L1130,526 L1066,503 L1048,508 L1036,505 L1020,511 L1002,524 L964,526 L952,521 L936,524 L913,538 L884,552 L840,563 L816,562 L801,546 L804,529 L806,474 L798,455 L772,438 L724,418 L672,403 L594,387 L599,532 L593,532 L592,534 L586,542 L518,537 L501,542 L478,553 L456,573 L438,608 L437,656 L310,657 L291,666 L268,664 L249,652 L174,651 L150,638 L135,616 L111,611 L100,613 L59,640 L50,699 L118,703 L140,711 L159,727 L171,733 L201,739 L390,738 L435,713 L668,719";
//size
var width = root.clientWidth - margin.left - margin.right;
var height = root.clientHeight - margin.top - margin.bottom;

//初期データを登録する。
	var rr = 25;
	var ref1 = 8;
	eval ("c" + 1 + "= [\"Paul\",\"0\",\"36\",\"27\",\"ffffff\",0, 0, rr,\"id1\"]");
	eval ("c" + 2 + "= [\"田実\",\"0\",\"28\",\"00\",\"ffffff\",0, 0, rr,\"id2\"]");
	eval ("c" + 3 + "= [\"古畑\",\"0\",\"33\",\"00\",\"ffffff\",0, 0, rr,\"id3\"]");

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
var str = "M653,689 L675,670 L694,664 L708,656 L734,629 L807,621 L831,619 L844,613 L868,587 L903,574 L957,590 L992,595 L1017,591 L1037,586 L1046,602 L1061,613 L1057,646 L1057,668 L1089,757 L1104,763 L1114,771 L1158,775 L1179,560 L1181,561 L1154,558 L1132,549 L1123,532 L1066,513 L1049,517 L1036,516 L1024,521 L1003,532 L982,536 L950,530 L925,538 L918,550 L903,556 L878,565 L850,570 L814,570 L794,552 L797,535 L800,475 L784,455 L764,442 L699,420 L600,394 L605,539 L597,539 L592,544 L591,552 L517,546 L499,552 L464,577 L447,607 L445,617 L444,665 L315,663 L299,672 L266,673 L250,663 L177,662 L149,651 L134,638 L126,624 L103,621 L80,632 L66,647 L57,692 L127,697 L146,703 L159,715 L175,725 L200,731 L378,732 L429,706 L647,711 L685,676 L711,668 L738,636 L834,628 L853,618 L872,597 L897,585 L910,584 L971,603 L989,605 L1033,595 L1041,607 L1052,617 L1048,652 L1051,672 L1088,767 L1098,769 L1109,780 L1165,784 L1189,553 L1160,552 L1143,544 L1134,535 L1130,526 L1066,503 L1048,508 L1036,505 L1020,511 L1002,524 L964,526 L952,521 L936,524 L913,538 L884,552 L840,563 L816,562 L801,546 L804,529 L806,474 L798,455 L772,438 L724,418 L672,403 L594,387 L599,532 L593,532 L592,534 L586,542 L518,537 L501,542 L478,553 L456,573 L438,608 L437,656 L310,657 L291,666 L268,664 L249,652 L174,651 L150,638 L135,616 L111,611 L100,613 L59,640 L50,699 L118,703 L140,711 L159,727 L171,733 L201,739 L390,738 L435,713 L668,719";
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
	.duration((parseInt(data[j][1]) * 3600 + parseInt(data[j][2]) * 60 + parseInt(data[j][3]))* 40)
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
	.duration((parseInt(data[j][1]) * 3600 + parseInt(data[j][2]) * 60 + parseInt(data[j][3]))* 40)
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