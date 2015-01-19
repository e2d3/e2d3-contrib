define(['d3', 'react'], function (d3, React) {
  return function (node, baseUrl) {
    var _data = null;
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
          exports.update(_data);
        }}/>,
      node
    );

    var width = 400;
    var height = 300;

    var svg = d3.select(node)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    var exports = {
      /**
      * (Required) called on data updated.
      *
      * @param data: ChartData
      */
      update: function (data) {
        _data = data;

        var list = data.transpose().toList(['name', 'age', 'height']);

        var x = d3.scale.ordinal()
          .rangeRoundBands([0, width], .2)
          .domain(list.map(function (d) { return d.name; }));
        var y = d3.scale.linear()
          .rangeRound([height, 0])
          .domain([0, d3.max(list.values())]);
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
    };

    return exports;
  };
});
