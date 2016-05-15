//# require=d3,leaflet

function update(data) {
  show(data.toList({ typed: false }));
}

/**
 * Created by osoken on 2016/05/16.
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

function show(data)
{
  if (data.length == 0)
  {
    return;
  }

  var width = root.clientWidth;
  var height = root.clientHeight;

  var margin = {left: 20, bottom: 20, top: 0, right: 20};
  var padding = {left: 10, bottom: 20, top: 10, right: 10};

  var panelHeight = 40;
  var panelWidth = width - margin.left - margin.right;
  var graphHeight = panelHeight - padding.left - padding.right;
  var graphWidth = panelWidth - padding.top - padding.bottom;

  var timeFormat = {parse: function(d){return new Date(d);}};
  var timeDispFormat = d3.time.format('%Y/%m/%d %H:%M:%S');

  var timeDispFunc = function(d) {
    return timeDispFormat(d.time);
  }

  var timeScale = d3.time.scale();
  var graphXScale = d3.time.scale().range([0, graphWidth]);
  var graphYScale = d3.scale.linear().range([0, graphHeight]);

  var drag = d3.behavior.drag();

  drag.on('dragstart', function() {
    d3.event.sourceEvent.stopPropagation();
  }).on('dragend', function() {
    d3.event.sourceEvent.stopPropagation();
  }).on('drag', function() {
    d3.event.sourceEvent.stopPropagation();
  });

  var tick = null;
  data.forEach(function(d) {
    d.time = timeFormat.parse(+d.time);
    d.latitude = +d.latitude;
    d.longitude = +d.longitude;
  });

  timeScale.domain(d3.extent(data, function(d){return d.time;}));
  graphXScale.domain(d3.extent(data, function(d){return d.time;}));
  graphYScale.domain([0, 1]);

  var map = new L.Map(d3.select('div').node()).setView([0, 0], 1);
  var tile = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution : '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  var svgLayer = d3.select(map.getPanes().overlayPane).append('svg').attr('class', 'leaflet-zoom-hide');
  var plotLayer = svgLayer.append('g');
  var uiHeight = 100;
  var timeLayer = svgLayer
                    .append('g')
                    .attr('transform', 'translate('+margin.left+','+(height - margin.bottom - panelHeight)+')');

  var startAnim = function(t0, dt) {
    if (tick != null) {
      tick = null;
    }
    plotLayer.selectAll('circle').attr('opacity', 0.0);
    var circ = graphLayer.select('circle');
    var t1 = timeScale.domain()[1];
    var tc = t0;
    var txt = graphLayer.select('text').text(timeDispFormat(tc)).attr({x: graphXScale(tc),'opacity': 1.0});
    var lastTime = new Date().getTime();
    tick = function() {
      if ( t1 < tc ) {
        tick = null;
        return;
      }
      circ.attr('cx', graphXScale(tc));
      txt.text(timeDispFormat(tc)).attr({x: graphXScale(tc)});
      var currentTime = new Date().getTime();
      delta = (currentTime - lastTime) * dt;
      plotLayer.selectAll('circle').filter(function(d) {
        return tc < d.time && (new Date(tc.getTime()+delta) >= d.time);
      }).attr('opacity', 0.8).transition().delay(1000).attr('opacity', 0.0);
      tc = new Date(tc.getTime() + delta);
      lastTime = currentTime;
      setTimeout(tick, 10);
    }
    setTimeout(tick, 300);
  };

  timeLayer.append('rect').attr({x:0, y:0, width: panelWidth, height: panelHeight})
    .style({fill: 'rgba(0,0,0,0.8)'});
  var graphLayer = timeLayer.append('g')
    .attr('transform', 'translate('+padding.left+','+padding.top+')');
  graphLayer.selectAll('line')
    .data(data).enter().append('line')
    .style({stroke: 'rgba(255,255,255,0.5)', fill: 'none', 'stroke-width': 1})
    .attr({x1: function(d){return graphXScale(d.time);},
           x2: function(d){return graphXScale(d.time);},
           y1: graphHeight,
           y2: function(d){return 0;}
    });
  graphLayer.append('rect')
    .attr({x: 0, y: 0, width: graphWidth, height: graphHeight})
    .style({fill: 'rgba(0,0,0,0)', stroke: 'none'})
    .on('click', function() {
      d3.event.preventDefault();
      d3.event.stopPropagation();
      startAnim(graphXScale.invert(d3.event.x - margin.left - padding.left), 3600);
    }).call(drag);
  graphLayer.append('text')
    .attr({x:0, y: graphHeight + padding.bottom, 'text-anchor': 'middle', 'font-size': 12, 'opacity': 0.0, fill: '#000', stroke: 'none'});
  graphLayer.append('circle')
    .attr({cx: 0, cy: graphHeight, r: 4, fill: '#FFF', stroke: 'none'});
  var updatePosition = function(d)
  {
    d.pos = map.latLngToLayerPoint(new L.LatLng(d.latitude, d.longitude));
    d3.select(this).attr( {cx: d.pos.x, cy: d.pos.y } );
  }

  var reset = function()
  {
    var bounds = map.getBounds();
    var topLeft = map.latLngToLayerPoint(bounds.getNorthWest());
    var bottomRight = map.latLngToLayerPoint(bounds.getSouthEast());

    svgLayer.attr("width", bottomRight.x - topLeft.x)
      .attr("height", bottomRight.y - topLeft.y)
      .style("left", topLeft.x + "px")
      .style("top", topLeft.y + "px");
    graphLayer.selectAll('line').attr('opacity', function(d) {
      return (bounds.getWest() <= d.longitude && d.longitude <= bounds.getEast() &&
             bounds.getSouth() <= d.latitude && d.latitude <= bounds.getNorth())? 1.0: 0.08;
    });
    plotLayer.attr('transform', 'translate('+ -topLeft.x + ',' + -topLeft.y + ')');
  }

  map.on("move", reset);

  plotLayer.selectAll('circle').data(data).enter().append('circle')
    .attr({opacity: 0.8, r: 4, fill: 'rgba(0, 0, 255, 0.5)', stroke: 'white', 'stroke-width': 1})
    .each(updatePosition);
  map.on('move', function()
  {
    plotLayer.selectAll('circle').each(updatePosition);
  });
  reset();
}
