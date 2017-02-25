//# require=d3,c3

function update(data) {
	var chart = c3.generate({
		bindto: d3.select(root),
		data: {
			columns: data
		}
	});
}
