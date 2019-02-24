//# require=d3,googlemaps:async!http://maps.google.com/maps/api/js?sensor=false

var mapOptions = {
  center: new google.maps.LatLng(35.673838, 139.750899),
  zoom: 14,
  mapTypeId: google.maps.MapTypeId.ROADMAP,
  mapTypeControl: false,
  disableDefaultUI: false
};

var geocoder = new google.maps.Geocoder();
var map = new google.maps.Map(root, mapOptions);

function update(data) {
  function geocode(d) {
    return new Promise(function (resolve, reject) {
      geocoder.geocode({ 'address': d.address, 'region': 'ja' }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          d.location = results[0].geometry.location;
          resolve(d);
        } else {
          reject(status);
        }
      });
    });
  }

  var color = d3.scale.ordinal()
    .range(["#FFFF00", "#FEC000", "#FDD5B3", "#D99895", "#02AE50", "#0170C3", "#04B0EE", "#04B0EE", "#BFBDBF", "#6E329E"]);
  var arc = d3.svg.arc()
    .outerRadius(60)
    .innerRadius(0);
  var pie = d3.layout.pie()
    .sort(null)
    .value(function (d) { return d; })

  var f = function (d) {
    return d.name && d.url && d.address && d.a;
  };

  Promise.all(data.toList().filter(f).map(geocode)).then(function (values) {
    var meanlat = d3.mean(values, function (d) { return d.location.lat(); });
    var meanlng = d3.mean(values, function (d) { return d.location.lng(); });
    map.setCenter(new google.maps.LatLng(meanlat, meanlng));

    var overlay = new google.maps.OverlayView();

    overlay.onAdd = function () {
      var layer = d3.select(this.getPanes().overlayLayer).append('div')
        .attr('class', 'overlay');

      overlay.draw = function () {
        var projection = this.getProjection();

        var marker = layer.selectAll('svg')
            .data(values)
            .each(transform)
          .enter().append('svg')
            .each(transform);

        var g = marker.selectAll('.arc')
            .data(function (d) { return pie([d.a, d.b, d.c, d.d, d.e, d.f, d.g, d.h, d.i, d.j]); })
          .enter().append('g')
            .attr('class', 'arc')
            .attr('transform', 'translate(60,60)');

        g.append('path')
          .attr('d', arc)
          .style('fill', function (d, i) { return color(i); });

        marker.append('image')
          .attr('xlink:href', function (d) { return d.url; })
          .attr('x', 30)
          .attr('y', 30)
          .attr('width', 60)
          .attr('height', 60);

        marker.append('text')
          .text(function (d) { return d.name; })
          .attr('transform', 'translate(60, 110)')
          .style('text-anchor', 'middle');

        function transform(d) {
          var p = projection.fromLatLngToDivPixel(d.location);
          return d3.select(this)
            .style('left', (p.x-60) + 'px')
            .style('top', (p.y-60) + 'px');
        }
      };
    };
    overlay.setMap(map);
  });
}
