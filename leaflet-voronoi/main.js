//# require=d3,leaflet

function update(data) {
  show(data.toList({ typed: false }));
}

/**
 * Created by osoken on 15/10/25.
 */

// map handler
!(function(d3,L)
{
  var map = {};
  var tracking = true;
  var zoom = 13;
  var mapLayer = null;
  var svgLayer = null;
  var pathLayer = null;
  var plotLayer = null;
  var infoLayer = null;
  var selection = null;
  var margin = 100;

  map.init = function(s)
  {
    selection = s;
    selection.style('height', root.clientHeight+'px');
    selection.style('width', root.clientWidth+'px');
    var point = [35.10300377075564,136.9695284611471];
    mapLayer = L.map(selection.attr('id')).setView(point, zoom);

    var tileLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution : '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapLayer);

    svgLayer = d3.select(mapLayer.getPanes().overlayPane).append("svg");

    pathLayer = svgLayer.append('g');
    plotLayer = svgLayer.append('g');
    infoLayer = svgLayer.append('g');
    mapLayer.on("viewreset", map.reset);
    map.reset();
  }

  map.projectPoint = function(x, y)
  {
    if (y===void 0)
    {
      return mapLayer.latLngToLayerPoint(x);
    }
    return mapLayer.latLngToLayerPoint(new L.LatLng(y, x));
  }
  map.invertPoint = function(x, y)
  {
    if (y===void 0)
    {
      return mapLayer.layerPointToLatLng(x);
    }
    return mapLayer.layerPointToLatLng(new L.point(x,y));
  }
  map.svg = function()
  {
    return svgLayer;
  }
  map.plotLayer = function()
  {
    return plotLayer;
  }
  map.infoLayer = function()
  {
    return infoLayer;
  }
  map.pathLayer = function()
  {
    return pathLayer;
  }
  map.bound = function()
  {
    var bounds = plotLayer.node().getBBox();

    return {x:bounds.x-margin,y:bounds.y-margin,width:bounds.width+2*margin,height:bounds.height+2*margin};
  }
  map.reset = function()
  {
    plotLayer.selectAll('circle')
      .each(function(d){d.point = map.projectPoint(+d.latlon[1],+d.latlon[0]);})
      .attr('cx', function(d){return d.point.x;})
      .attr('cy', function(d){return d.point.y;});

    var bounds = map.bound();

    svgLayer.attr("width", bounds.width)
      .attr("height", bounds.height)
      .style("left", bounds.x + "px")
      .style("top", bounds.y + "px");

    pathLayer.attr("transform", "translate(" + -bounds.x + "," + -bounds.y + ")");
    plotLayer.attr("transform", "translate(" + -bounds.x + "," + -bounds.y + ")");
    infoLayer.attr("transform", "translate(" + -bounds.x + "," + -bounds.y + ")");

    redrawVoronoi(plotLayer.selectAll('circle').data());
  }
  this.map = map;
}(d3,L));

!(function(d3)
{
  var tooltip = {};
  var layer,rect,text;
  tooltip.init = function(map)
  {
    layer = map.infoLayer().append('g')
      .attr('transform','translate(100,100)')
      .attr('opacity',1.0);

    rect = layer.append('rect')
      .attr('stroke-width',1)
      .attr('stroke','rgba(255,255,255,0.9)')
      .attr('fill','rgba(255,255,255,0.9)');

    text = layer.append('g');
  }

  tooltip.show = function(x,y,data)
  {
    layer.attr('transform','translate('+x+','+y+')');
    text.selectAll('text').remove();
    text.selectAll('text').data(data).enter().append('text')
      .text(function(d){return d;})
      .style('font-family','Meiryo')
      .attr('font-size', 16)
      .attr('x', 0)
      .attr('y', function(d,i){return i*20;})
      .attr('text-anchor','middle');
    rect.attr(layer.node().getBBox());
    layer.attr('visibility', 'visible');
  }
  tooltip.hide = function()
  {
    layer.attr('visibility','hidden');
  }
  tooltip.move = function(x,y)
  {
    layer.attr('transform','translate('+x+','+y+')');
  }
  this.tooltip = tooltip;
}(d3));

map.init(d3.select(root).append('div').attr('id','map-container'))
tooltip.init(map);

function redrawVoronoi(data) {
  var voronoi = d3.geom.voronoi()
    .x(function(d) { return d.point.x; })
    .y(function(d) { return d.point.y; });

  var path = map.pathLayer().selectAll('path')
    .data(voronoi(data).filter(function(d){return d!==void 0;}));

  path.exit().remove();

  path.enter().append("path")
    .attr('stroke','#000')
    .attr('stroke-width', 0.5)
    .attr('fill', 'rgba(0,0,0,0)');

  path.attr("d", function(d) {return "M" + d.join('L') + "Z"; })
    .on('mousemove', function(d)
    {
      tooltip.move(d3.event.x, d3.event.y+80);
    })
    .on('mouseover',function(d)
    {
      tooltip.show(d3.event.x,d3.event.y+80,d3.entries(d.point.properties).map(function(d){return d.key + ': '+ d.value;}));
    })
    .on('mouseout', function(d)
    {
      tooltip.hide();
    });
}


function show(data)
{
  if (data.length == 0)
  {
    return;
  }
  var keys = d3.keys(data[0]);
  var keyset = d3.set(keys);
  var latKey = 'latitude';
  var lonKey = 'longitude';
  var points = data.map(function(d){return {'latlon':[+d[latKey],+d[lonKey]],'point':map.projectPoint(+d[lonKey],+d[latKey]),'properties':d};});
  map.plotLayer().selectAll('circle').data(points).enter().append('circle')
    .attr('cx', function(d){return d.point.x;})
    .attr('cy', function(d){return d.point.y;})
    .attr('r',4)
    .attr('stroke','#FFF')
    .attr('stroke-width',0.5)
    .attr('fill', 'blue')
    .on('mouseover',function(d)
    {
      tooltip.show(d3.event.x,d3.event.y+80,d3.entries(d.properties).map(function(d){return d.key + ': '+ d.value;}));
    });
  map.reset();
}
