//# require=d3,react

var _key = "政策分野注力度1社会保障";
var _ward = '麻生区';


var _ward = 'kawasakiku';

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

          <option value="政策分野注力度1社会保障">政策分野注力度1社会保障</option>
          <option value="政策分野注力度2産業政策">政策分野注力度2産業政策</option>
          <option value="政策分野注力度3社会資本整備">政策分野注力度3社会資本整備</option>
          <option value="政策分野注力度4教育・子育て">政策分野注力度4教育・子育て</option>
          <option value="政策分野注力度5農林漁業">政策分野注力度5農林漁業</option>
          <option value="政策分野注力度6税財政・財政再建">政策分野注力度6税財政・財政再建</option>
          <option value="政策分野注力度7労働">政策分野注力度7労働</option>
          <option value="政策分野注力度8環境・エネルギー">政策分野注力度8環境・エネルギー</option>
          <option value="政策分野注力度9行政・議会改革">政策分野注力度9行政・議会改革</option>
          <option value="政策分野注力度10安全・防災・震災復興">政策分野注力度10安全・防災・震災復興</option>
        </select>
      </div>
    );
  }
});


var WardSelectBox = React.createClass({
  getInitialState: function () {
    return { value: _ward };
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
          <option value="宮前区">宮前区</option>
          <option value="幸区">幸区</option>
          <option value="高津区">高津区</option>
          <option value="川崎区">川崎区</option>
          <option value="多摩区">多摩区</option>
          <option value="中原区">中原区</option>
          <option value="麻生区">麻生区</option>
        </select>
      </div>
    );
  }
});

var Wrapper = React.createClass({
  render: function() {
    return (
      <div>
      <SelectBox onChange={function (key) {
          _key = key;
          reload();
        }}/>

        <WardSelectBox onChange={function (ward) {
                  _ward = ward;
                  reload();
                }}/>

                </div>

    );
  }
});

React.render(
  <Wrapper/>,
  root
);

var width = 800;
var height = 600;

var svg = d3.select(root)
  .append('svg')
  .attr('width', width)
  .attr('height', height);

function update(data) {
//  d3.select(root).selectAll('*').remove();

//  var list = data.transpose().toList({header: ['name', 'age', 'height'], typed: true});
  var list_ = data.toList({typed: true});
  var list = [];

  list_.forEach( function(e){
    if( e.対象の選挙区 == _ward ){
      list.push(e);
    }
  });

  var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .2)
    .domain(list.map(function (d) { return d.政治家名; }));
  var y = d3.scale.linear()
    .rangeRound([height, 0])
//    .domain([0, d3.max(list.values(
//      '政策分野注力度1社会保障',
//      '政策分野注力度2産業政策',
//      '政策分野注力度3社会資本整備',
//      '政策分野注力度4教育・子育て',
//      '政策分野注力度5農林漁業',
//      '政策分野注力度6税財政・財政再建',
//      '政策分野注力度7労働',
//      '政策分野注力度8環境・エネルギー',
//      '政策分野注力度9行政・議会改革',
//      '政策分野注力度10安全・防災・震災復興'))]);
    .domain([0, 40]);
  var color = d3.scale.category10()
    .domain(list.map(function (d) { return d.政治家名; }))

  var setup = function (selection) {
    selection
      .attr('width', x.rangeBand())
      .attr('height', function (d) { return height - y(d[_key]); })
      .attr('x', function (d) { return x(d.政治家名); })
      .attr('y', function (d) {
      return y(d[_key]);
      })
      .style('fill', function (d) { return color(d.政治家名); })
      .text(function(d){return d.政治家名;});

    selection//.append("text")
      .text(function(d){return d.政治家名;});
  }

  var label = function (selection) {
    selection//.append("text")
      .text(function(d){return d.政治家名;});
  }

//  d3.select('text').remove();

  rect = svg.selectAll('rect').data(list);

  rect.transition().duration(500).call(setup);

  rect.enter().append('rect').call(setup);

//  rect.enter().append('text').call(setup);

  rect.exit().remove();


text = svg.selectAll('text').data(list);

text.transition().duration(500).call(setup);

text.enter().append('text').call(setup);

text.exit().remove();

}
