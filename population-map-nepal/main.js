//# require=d3,topojson
var labels = ['Population', 'Share of Population', 'Population Average Annul Growth', 'Internet Rate', 'Unemployment Rate', 'Economic Participation Rate', 'Contribution of GDP'];

var width = root.clientWidth;
var height = root.clientHeight;

var tsv;
var data_prop = 'Population';

var svg = d3.select(root).append('svg')
  .attr('width', width)
  .attr('height', height)
  .attr('style', 'display: block; margin: auto;');
var projection = d3.geo.mercator()
  .center([84, 28])
  .scale(4000)
  .translate([width / 2, height / 2]);
var path = d3.geo.path()
  .projection(projection);

svg.append('g')
  .attr('id', 'legend_group');


d3.select(root).append('div')
  .attr('class', 'tooltip');

d3.json(baseUrl + '/nepal_adm4.topojson', function (error, json) {
  svg.selectAll('.province')
    .data(topojson.feature(json, json.objects.NPL_adm4).features)
  .enter().append('path')
    .attr('stroke', 'gray')
    .attr('stroke-width', '0.5')
    .attr('id', function (d) { return 'state_' + d.properties.adm1_code})
    .attr('class', 'province')
    .attr('fill', '#ffffff')
    .attr('d', path)
    .attr('data-text', function(d){return d.name})
    .on('mousemove', function(){
      var target = d3.select(this);
      var props = target.data()[0].properties;
      var str = props.NAME_1+' > '+props.NAME_2+' > '+props.NAME_3;
      //var line = tsv.filter(function(d){return d.Province==name})[0];
      //if(!line) return;

      // var str = '<h5>'+name+'</h5>';
      // labels.map(function(label){
      //   str += '<p'+(label==data_prop?' class="selected"':'')+'>'+label+': '+line[label]+'</p>';
      // });

      var xy = d3.mouse(this);

      d3.select('.tooltip')
        .style({
          top: xy[1]+'px',
          left: xy[0]+'px',
          display: 'block'
        })
        .html(str)
        ;
    }).on('mouseout', function(){
      d3.select('.tooltip').style({display:'none'});
    })
    ;

  reload();
});

function update(data) {
  var map = data.toMap();
  var headers = map.header;
  labels = headers;
  var values = map.values();

  function render(){
    var tsv = data.toList();
    tsv.forEach(function(d){
      d[data_prop] = +d[data_prop];
    });
    var color = d3.scale.linear()
      .domain(d3.extent(tsv, function(d){return d[data_prop]}))
      .range(['#ffffff', '#ff0000'])
      .interpolate(d3.interpolateLab);

    svg.selectAll('.province')
      .attr('fill', function (d) {
        var obj = tsv.filter(function(e){return e['District Name']==d.properties.NAME_3})[0];
        if (obj) {
          return color(obj[data_prop]);
        } else {
          return '#cccccc';
        }
      });
  }
  showSwitchButtons();

  d3.selectAll('.switch_radio').on('change', function(){
    data_prop = d3.select(this).attr('value');
    render();
  });
  render();

}
//showSwitchButtons();
function showSwitchButtons() {

  var switch_box = d3.select(root)
    .append('div')
      .attr('id', 'switch_box')
      .attr('style', 'position:absolute;top:0');

  switch_box.selectAll('.switch_button')
    .data(labels).enter()
      .append('div')
        .attr('class', 'switch')
        .html(function(d, i){
          return '<input type="radio" id="switch_radio_'+i+'" name="switch_radio" class="switch_radio" value="'+d+'"'+(i==0?' checked':'')+' />'
                +'<label class="switch_label" for="switch_radio_'+i+'">'+d+'</label>'
        });
}
