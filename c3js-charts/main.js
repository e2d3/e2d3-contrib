//# require=d3,c3

//描画領域設定
//セレクトボックス領域の確保
//var selectButtonWidth = parseInt((root.clientWidth / 4) * 0.9);
var selectButtonWidth = 100;
var legendHeight = 30;
var base = d3.select(root).append("section").attr("id", "mainFrame");
base.append("div")
	.attr("id", "legend-area")
	.style({
		'height': function() { return legendHeight + 'px';},
		'text-align': 'left',
		'padding-left': '10px',
		'width': '100%'
	});
//グラフ描画領域の確保
base.append("div")
	.attr("id", "chart-area")
	.style({
		'height': function() { return (root.clientHeight-legendHeight) + 'px';},
		'width': '100%'
	});

// メイン処理
function update(data) {

	//セレクトボックスの作成
	//初期化
	d3.select('#legend-area').selectAll('select').remove();
	d3.select('#legend-area').selectAll('div').remove();

	//生成
	var cahrttype = [
		{label:'line', value:'line', selected:true},
		{label:'spline', value:'spline'},
		{label:'step', value:'step'},
		{label:'area-step', value:'area-step'},
		{label:'area', value:'area'},
		{label:'area-spline', value:'area-spline'},
		{label:'bar', value:'bar'}
	]

	d3.select('#legend-area')
		.append('select')
		.attr("id", "cahrt-type")
		.style('height', function (){
			return legendHeight + 'px';
		})
		.style('width', function (){
			return selectButtonWidth + 'px';
		})
		.on('change', function () {
			chart.transform(d3.select('#cahrt-type').property("value"));
		})
		.selectAll('option')
		.data(cahrttype)
		.enter()
		.append('option')
		.style('height', function (){
			return legendHeight + 'px';
		})
		.style('width', function () {
			return selectButtonWidth + 'px';
		})
		.attr("value", function(d){ return d.value})
		.attr("selected", function(d){ if(d.selected) return "selected"})
		.text(function(d){ return d.label });
	
	//グラフ生成
	var chart = c3.generate({
		bindto: d3.select('#chart-area'),
		data: {
			columns: data,
			type: d3.select('#cahrt-type').property("value")
		}
	});
};
