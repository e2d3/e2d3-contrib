//# require=d3,topojson

function update(data) {
  show(data.toList({ typed: false }));
}

/**
 * Created by osoken on 2016/05/16.
*/

var width = root.clientWidth;
var height = root.clientHeight;

var projection = d3.geo.orthographic()
    .scale(250)
    .rotate([0, 0])
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var velocity = 0.02;

var graticule = d3.geo.graticule()();
var sphere = {type: 'Sphere'};

var svg = d3.select(root).append('svg')
    .attr('width', width)
    .attr('height', height);

var isVisible = {
  front: function(d) {
    return ((Math.cos((projection.rotate()[0]+d.lng)/360 * Math.PI * 2) > 0)?'visible':'hidden');
  },
  back: function(d) {
    return ((Math.cos((projection.rotate()[0]+d.lng)/360 * Math.PI * 2) < 0)?'visible':'hidden');
  }
};

var globe = null;
var proc = function(cb) {
  if (globe == null) {
    d3.json('./ne_110m_land.json', function(error, world) {
      if (error) cb(error, null);

      globe = {};
      projection.clipAngle(180);
      globe.circleBack = svg.append('g');
      globe.landBack = svg.append('path')
          .datum(topojson.feature(world, world.objects.ne_110m_land))
          .attr('opacity', 0.8)
          .attr('fill', '#dadac4')
          .attr('d', path);
      projection.clipAngle(90);
      globe.gridFront = svg.append('path')
          .datum(graticule)
          .attr('fill', 'none')
          .attr('stroke', '#CCC')
          .attr('d', path);
      globe.sphereFront = svg.append('path')
          .datum(sphere)
          .attr('fill', 'rgba(255,255,255,0.4)')
          .attr('stroke', '#000')
          .attr('stroke-width', 1)
          .attr('d', path);
      globe.landFront = svg.append('path')
          .datum(topojson.feature(world, world.objects.ne_110m_land))
          .attr('fill', '#737368')
          .attr('d', path);
      globe.circleFront = svg.append('g');

      globe.redraw = function(rot) {
        projection.rotate(rot).clipAngle(180);
        globe.landBack.attr('d', path);
        projection.clipAngle(90);
        globe.gridFront.attr('d', path);
        globe.landFront.attr('d', path);
        globe.circleBack.selectAll('circle')
          .each(function(d){d.xy = d.coordinate();})
          .attr('cx', function(d){return d.xy[0];})
          .attr('cy', function(d){return d.xy[1];})
          .attr('visibility', isVisible.back);
        globe.circleFront.selectAll('circle')
          .attr('cx', function(d){return d.xy[0];})
          .attr('cy', function(d){return d.xy[1];})
          .attr('visibility', isVisible.front);
      }
      d3.timer(function(elapsed) {
        globe.redraw([velocity * elapsed, 0])
      });
      return cb(null, globe);
    });
  } else {
    return cb(null, globe);
  }
}

function show(data) {
  data.forEach(function(d) {
    d.lng = +d.longitude;
    d.lat = +d.latitude;
    d.coordinate = function() {return projection([d.lng, d.lat]);};
    d.xy = d.coordinate();
  });
  proc(function(err, globe) {
    if (err != null) {
      throw err;
    }
    globe.circleBack.selectAll('circle').remove();
    globe.circleBack.selectAll('circle').data(data).enter().append('circle')
      .attr('cx', function(d){return d.xy[0];})
      .attr('cy', function(d){return d.xy[1];})
      .attr('fill', '#F00')
      .attr('stroke', '#FFF')
      .attr('stroke-width', 0.5)
      .attr('visibility', isVisible.back)
      .attr('r', 4);
    globe.circleFront.selectAll('circle').remove();
    globe.circleFront.selectAll('circle').data(data).enter().append('circle')
      .attr('cx', function(d){return d.xy[0];})
      .attr('cy', function(d){return d.xy[1];})
      .attr('fill', '#F00')
      .attr('stroke', '#FFF')
      .attr('stroke-width', 1)
      .attr('visibility', isVisible.front)
      .attr('r', 4);
  });
}
