//# require=d3,react

var _key = 'age';

var SelectBox = React.createClass({
  getInitialState: function () {
    return { value: _key };
  },
  handleChange: function (event) {
    var value = event.target.value;
    this.setState({ value: value });
    this.props.onChange(value);
  },
  render: function () {
    return (
      <div>
        <select value={this.state.value} onChange={this.handleChange}>
          <option value="age">Age</option>
          <option value="height">Height</option>
        </select>
      </div>
    );
  }
});

React.render(
  <SelectBox onChange={function (key) {
      _key = key;
      reload();
    }}/>,
  root
);

var width = 400;
var height = 300;

var svg = d3.select(root)
  .append('svg')
  .attr('width', width)
  .attr('height', height);

function update(data) {
  var list = data.transpose().toList({header: ['name', 'age', 'height'], typed: true});

  var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .2)
    .domain(list.map(function (d) { return d.name; }));
  var y = d3.scale.linear()
    .rangeRound([height, 0])
    .domain([0, d3.max(list.values('age', 'height'))]);
  var color = d3.scale.category10()
    .domain(list.map(function (d) { return d.name; }))

  var setup = function (selection) {
    selection
      .attr('width', x.rangeBand())
      .attr('height', function (d) { return height - y(d[_key]); })
      .attr('x', function (d) { return x(d.name); })
      .attr('y', function (d) { return y(d[_key]); })
      .style('fill', function (d) { return color(d.name); });
  }

  rect = svg.selectAll('rect').data(list);

  rect.transition().duration(500).call(setup);

  rect.enter().append('rect').call(setup);

  rect.exit().remove();
}
