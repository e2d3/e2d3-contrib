//# require=d3

function update(data) {
  show(data.toMap({ typed: true }));
}

/**
 * Created by osoken on 15/11/13.
*/

var width = root.clientWidth;
var height = root.clientHeight;

var directions = ["東","東南東","南東","南南東","南","南南西","南西","西南西","西","西北西","北西","北北西","北","北北東","北東","東北東"];
var yearAttr = '年';
var centerAttr = '静穏';

var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = width - margin.right -margin.left,
    height = height - margin.top - margin.bottom;

var lengthScale = d3.scale.linear().range([0,height/2-200]);
var yearSz = 48;
var yearScale = d3.scale.linear().domain([yearSz,height]);

var svg = d3.select("#e2d3-chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var circle = svg.append('circle')
  .attr('cx', width/2)
  .attr('cy', height/2)
  .attr('fill','none')
  .attr('stroke', '#000')
  .attr('r',0);

var arrows = svg.append('g').attr('transform','translate('+width/2+','+(height/2)+')')
  .selectAll('g.arrow')
  .data(directions)
  .enter()
  .append('g').attr('transform', function(d,i){return 'rotate('+(22.5*i)+') translate(120,0)';});

arrows.append('path').attr('d', 'M0,0 z').attr('fill','none').attr('stroke','#000');

var yearLayer = svg.append('g').attr('transform', 'translate(0,0')
  .on('mousemove', function(d)
  {
    d3.select(this).attr('transform', 'translate(0,'+yearScale(d3.event.pageY)+')');
  });

function show(data)
{
  var year = d3.keys(data)[0];

  var marker = function(d)
  {
    return 'M0,0 L0,8 L'+lengthScale(data[year][d])+',8 L'+lengthScale(data[year][d])+',24 L'+(lengthScale(data[year][d])+24)+',0 L'+lengthScale(data[year][d])+',-24 L'+lengthScale(data[year][d])+',-8 L0,-8 z';
  }
  lengthScale.domain([0,d3.max(directions.map(function(d){return +data[year][d]||0;}))]);
  yearScale.range([yearSz*3, height-yearSz*d3.keys(data).length]);
  yearLayer.attr('transform', 'translate(0,'+yearScale(yearSz)+')')
  arrows.select('path').attr('d',marker);
  circle.attr('r',  lengthScale(data[year][centerAttr]));
  yearLayer.selectAll('text').remove();
  yearLayer.selectAll('text').data(d3.keys(data))
    .enter().append('text').attr('class','year label')
    .text(function(d){return d;})
    .attr('x', 30)
    .attr('y', function(d,i){return i*yearSz;})
    .attr('font-family','Meiryo')
    .attr('font-size', yearSz)
    .attr('stroke', 'none')
    .attr('fill', function(d){return (d==year)?'#000':'#CCC';})
    .on('mouseover', function(d)
    {
      year = d;
      lengthScale.domain([0,d3.max(directions.map(function(d){return +data[year][d];}))]);
      circle.transition().attr('r', lengthScale(data[year][centerAttr]));
      arrows.select('path').transition().attr('d',marker);
      yearLayer.selectAll('text').attr('fill', function(d){return (d==year)?'#000':'#CCC';})
    });


}
