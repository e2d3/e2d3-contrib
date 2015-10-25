//# require=d3,topojson,colorbrewer

function update(data) {
  show(data.toMap({ typed: true }));
}

/**
 * Created by yuuu on 14/12/22.
 * Edited by osoken on 15/10/21.
*/

!(function(d3,colorbrewer)
{
  var colormenu ={};
  var dispatcher = d3.dispatch('change');
  var flatCB = d3.entries(colorbrewer).map(function(d){return d3.entries(d.value).map(function(dd){return {name:d.key+': '+dd.key, parette:dd.value};});}).reduce(function(a,b){return a.concat(b);});
  var selected = flatCB[0];
  var selection, display, selector;

  colormenu.open = function()
  {
    selector.transition().style('height', '320px');
  }
  colormenu.close = function()
  {
    selector.transition().style('height', '0px');
  }
  colormenu.init = function(root)
  {
    selection = root.append('div');
    display = selection.append('ul');
    selector = selection.append('ul');
    display.attr('class','clearfix')
      .on('click',function()
      {
        d3.event.stopPropagation();
        colormenu.open();
      }).selectAll('li')
      .data(selected.parette)
      .enter().append('li').style({'width':'16px','height':'16px','background-color':function(d){return d;},'float':'left','display':'block'});
    selector.on('mouseout', function()
      {
        dispatcher.change(selected);
      })
      .style('height', '0px')
      .style('overflow-x', 'hidden')
      .style('overflow-y', 'scroll');
    selector.selectAll('li').data(flatCB).enter().append('li')
      .on('mouseover', function(d)
      {
        dispatcher.change(d);
      })
      .on('click',function(d){
        d3.event.stopPropagation();
        selected = d;
        colormenu.close();
        display.selectAll('li').remove();
        display.selectAll('li')
          .data(selected.parette)
          .enter().append('li').style({'width':'16px','height':'16px','background-color':function(d){return d;},'float':'left','display':'block'});
        dispatcher.change(selected);
      })
      .append('ul').attr('class','clearfix').selectAll('li').data(function(d){return d.parette;})
      .enter().append('li').style({'width':'16px','height':'16px','background-color':function(d){return d;},'float':'left','display':'block'});
  }
  colormenu.parette = function()
  {
    return selected;
  }
  colormenu.nColor = function()
  {
    return selected.parette.length;
  }
  colormenu.on = function(event, listener)
  {
    return dispatcher.on(event, listener);
  };
  if (typeof define === "function" && define.amd) define(colormenu); else if (typeof module === "object" && module.exports) module.exports = colormenu;
  this.colormenu = colormenu;
}(d3,colorbrewer));


var width = root.clientWidth;
var height = root.clientHeight;

d3.select('#e2d3-chart-area')
  .on('click', function()
  {
    colormenu.close();
  });

var svg = d3.select("#e2d3-chart-area").append("svg")
  .attr("width", width)
  .attr("height", height);

var mapLayer = svg.append('g');
var infoLayer = svg.append('g');

var attrMenu = d3.select('#e2d3-chart-area').append('div')
  .attr('id', 'attrMenu')
  .attr('class', 'menu clearfix');

var attrList = attrMenu.append('ul').attr('class', 'vertical');

var colorMenu = d3.select('#e2d3-chart-area').append('div')
  .attr('id', 'colorMenu')
  .attr('class', 'menu clearfix');

colormenu.init(colorMenu);

var tooltip = infoLayer.append('g')
  .attr('transform','translate(100,100)')
  .attr('opacity',1.0);

var tooltipRect = tooltip.append('rect')
  .attr('stroke-width',1)
  .attr('stroke','rgba(255,255,255,0.75)')
  .attr('fill','rgba(255,255,255,0.75)');

var tooltipInfo = tooltip.append('g');

var tooltipTitle = tooltipInfo.append('text')
  .attr('id', 'tooltiptitle')
  .attr('text-anchor','middle')
  .style('font-family','Meiryo')
  .attr('font-size', 24);

var tooltipData = tooltipInfo.append('g')
  .attr('transform', 'translate(0,28)');

var projection = d3.geo.mercator()
  .center([136.95,35.15])
  .scale(Math.min(width, height) * 150)
  .translate([width / 2, height / 2]);

var path = d3.geo.path()
  .projection(projection);

var topo = {};

var placeName = 'nagoya';

var topoSelection = null;

d3.json(baseUrl + "/nagoya.topojson", function(error, o) {
  topoSelection = mapLayer.selectAll(".states")
    .data(topojson.feature(o, o.objects[placeName]).features)
    .enter().append("path")
    .attr("stroke", "gray")
    .attr("stroke-width", "0.5")
    .attr("id", function(d) {
      return "state_" + d.properties.id;
    })
    .attr("class", 'states')
    .attr("fill", "#fff")
    .attr("d", path);
  topo = o;

  reload();
});

function show(data)
{
  if (data && topo.objects)
  {
    var labels = data.header;

    topo.objects[placeName].geometries.forEach(function(d)
    {
      d.properties.data = {};
      d.properties.data = data[d.properties.ward] || {};
    });
    var discretizer = d3.scale.quantize().range(d3.range(colormenu.nColor()));
    var attr = labels[0];
    var refill = function(label,parette)
    {
      discretizer.range(d3.range(parette.length))
        .domain(d3.extent(topo.objects[placeName].geometries, function(d){return d.properties.data[label];}));
      mapLayer.selectAll('path')
        .transition()
        .attr('fill', function(d){return parette[discretizer(d.properties.data[attr])]});
    }
    attrList.selectAll('li').remove();
    attrList.selectAll('li').data(labels).enter().append('li')
        .append('a')
        .attr('class', 'label-selector')
        .style('background-color', function(d){return (attr==d)?'#000':'none';})
        .attr('href', '#')
        .text(function(d){return d;})
        .on('click', function(d)
        {
          d3.event.preventDefault();
          d3.selectAll('a.label-selector').style('background-color', '#FFF');
          d3.select(this).style('background-color', '#000');
          attr = d;
          refill(d, colormenu.parette().parette);
        });
    topoSelection.on('mouseover', function(d)
    {
      tooltip.style('display','block');
      tooltip.attr('transform','translate('+d3.event.pageX+','+(d3.event.pageY+40)+')');
      tooltipTitle.text(d.properties.prefecture+d.properties.city+d.properties.ward);
      tooltipData.selectAll('text').remove();
      tooltipData.selectAll('text')
        .data(d3.entries(d.properties.data))
        .enter().append('text')
        .text(function(d){return d.key+': '+d.value;})
        .style('font-family','Meiryo')
        .attr('font-size', 16)
        .attr('y', function(d,i){return i*20;})
        .attr('text-anchor','middle');
      tooltipRect.attr(tooltipInfo.node().getBBox());
      tooltip.attr('opacity', 1.0);
    })
    .on('mousemove', function(d)
    {
      tooltip.attr('transform','translate('+d3.event.pageX+','+(d3.event.pageY+40)+')');
    })
    .on('mouseout', function(d)
    {
      tooltip.attr('opacity', 0.0);
      tooltip.style('display','none');
    });
    if (labels.length > 0)
    {
      refill(attr, colormenu.parette().parette);
    }
    colormenu.on('change', function(parette)
    {
      refill(attr, parette.parette);
    });
  }
}
