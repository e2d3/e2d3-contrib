//# require=d3,topojson

var width = root.clientWidth;
var height = root.clientHeight;

var data_prop = 'Population';

var svg = d3.select(root).append('svg')
  .attr('width', width)
  .attr('height', height)
  .attr('style', 'display: block; margin: auto;');
var projection = d3.geo.mercator()
  .center([53, 35])
  .scale(1200)
  .translate([width / 2, height / 2]);
var path = d3.geo.path()
  .projection(projection);

svg.append('g')
  .attr('id', 'legend_group');

d3.json(baseUrl + '/ir.topojson', function (error, json) {
  svg.selectAll('.states')
    .data(topojson.feature(json, json.objects.ir).features)
  .enter().append('path')
    .attr('stroke', 'gray')
    .attr('stroke-width', '0.5')
    .attr('id', function (d) { return 'state_' + d.properties.adm1_code})
    .attr('class', 'states')
    .attr('fill', '#ffffff')
    .attr('d', path)
    .attr('data-text', function(d){return d.name})
    ;

  reload();
});

function update(data) {
  function render(){
    var map = data.toMap();
    var initIndex = 2;
    var initLabel = map.header[initIndex];
    var values = map.values();

    var tsv = data.toList();
    tsv.forEach(function(d){
      d[data_prop] = +d[data_prop];
    });
    var color = d3.scale.linear()
      .domain(d3.extent(tsv, function(d){return d[data_prop]}))
      .range(['#ffffff', '#ff0000'])
      .interpolate(d3.interpolateLab);

    svg.selectAll('.states')
      .attr('fill', function (d) {
        var obj = tsv.filter(function(e){return e.Province==d.properties.name})[0];
        if (obj) {
          return color(obj[data_prop]);
        } else {
          return '#cccccc';
        }
      });
  }

  d3.selectAll('.switch_radio').on('click', function(){
    data_prop = d3.select(this).attr('value');
    render();
  });
  render();

}
showSwitchButtons();
function showSwitchButtons() {
  var labels = ['Population', 'Share of Population', 'Population Average Annul Growth', 'Internet Rate', 'Unemployment Rate', 'Economic Participation Rate', 'Contribution of GDP'];

  var switch_box = d3.select(root)
    .append('div')
      .attr('id', 'switch_box')
      .attr('style', 'position:absolute;top:0');

  switch_box.selectAll('.switch_button')
    .data(labels).enter()
      .append('div')
        .attr('class', 'switch')
        .html(function(d, i){ 
          return '<input type="radio" id="switch_radio_'+i+'" name="switch_radio" class="switch_radio" value="'+d+'" />'
                +'<label class="switch_label" for="switch_radio_'+i+'">'+d+'</label>'
        });
}
