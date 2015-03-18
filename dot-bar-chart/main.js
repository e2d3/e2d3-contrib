//# require=d3,original

function update(data) {
  d3.selectAll("#g-axis-layer g g").remove();
  d3.selectAll("#g-graph-layer *").remove();
  d3.selectAll("#g-input-layer *").remove();
  show(data.toMap({typed: true}));
}
