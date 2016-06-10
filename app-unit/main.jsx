//# require=d3,react
var _key = 'BasketBall';

var styles = {
  container: {
    width: 800,
    height: 1100,
    paddingTop: '0',
    position: 'absolute',
    top:0,
    left: 0,
    right: 0,
    bottom: 0,
    margin:'auto',
    zIndex: -1
  },
  mask: {
    width: 500,
    height: 350,
    position: 'absolute',
    zIndex: 1,
    top: 335,
    left: 150,
  },
  selectbox: {
    position: 'relative',
    top: "40px"
  }
};



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
      <div style={styles.container}>
        <select style={styles.selectbox} value={this.state.value} onChange={this.handleChange}>
          <option value="BasketBall">Basket Ball</option>
          <option value="height">Height</option>
        </select>
        <div style={styles.mask}></div>
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


var width = 600;
var height = 350;

var svg = d3.select(root)
.append('svg')
.attr('class', 'boxSvg')
.attr('width', width)
.attr('height', height)
.attr("clip-path","url(#clipping)")
.attr('style', 'z-index: -1; position: absolute; margin: auto; top: 200px; left: 0; right: 0;');

var clippath = svg.append("defs").append("clipPath").attr("id", "clipping").append("path").attr("d", function () {
  return "M477.756,146.219L397.7,224.292l18.967,110.269c0.22,1.545,0.22,2.869,0.22,4.412c0,5.732-2.646,11.027-9.042,11.027 c-3.087,0-6.176-1.104-8.821-2.646l-99.022-52.048l-99.023,52.048c-2.868,1.543-5.734,2.646-8.822,2.646 c-6.396,0-9.263-5.295-9.263-11.027c0-1.543,0.221-2.867,0.441-4.412L202.3,224.292l-80.277-78.072 c-2.646-2.867-5.513-6.617-5.513-10.586c0-6.617,6.837-9.263,12.35-10.146l110.712-16.099L289.193,9.042 C291.179,4.852,294.928,0,300.001,0c5.071,0,8.82,4.852,10.806,9.042l49.623,100.347l110.711,16.099 c5.292,0.883,12.35,3.528,12.35,10.146C483.49,139.602,480.624,143.352,477.756,146.219z";
});

function update(data) {
  var list = data.transpose().toList({header: ['name', 'BasketBall', 'height'], typed: true});

  var x = d3.scale.ordinal()
  .rangeRoundBands([0, width], .2)
  .domain(list.map(function (d) { return d.name; }));
  var y = d3.scale.linear()
  .rangeRound([height, 0])
  .domain([0, d3.max(list.values('BasketBall', 'height'))]);
  var color = d3.scale.category10()
  .domain(list.map(function (d) { return d.name; }))


  var setup = function (selection) {
    selection
    .attr('width', x.rangeBand())
    .attr('height', function (d) { return height - y(d[_key]); })
    .attr('x', function (d) { return x(d.name); })
    .attr('y', function (d) { return y(d[_key]); })
    .style('fill', function (d) { return '#ea4d60' });



  }





  rect = svg.selectAll('rect').data(list);

  rect.transition().duration(500).call(setup);

  rect.enter().append('rect').call(setup);

  rect.exit().remove();


};

