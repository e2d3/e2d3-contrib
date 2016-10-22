//# require=d3,c3

//<初期化ブロック>
function update(data) {
	//<データ更新ブロック>
	var chart = c3.generate({
		bindto: d3.select(root),
		data: {
			columns: [
			data(0),
			data(1)
			]
		}
	});
}
