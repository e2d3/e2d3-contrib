//# require=d3,leaflet

function update(data) {
    
	//ヘッダーの取得
	var labels = data[0];
	
	//データのリスト化
	var list = data.toList();

    // d3.select(root).append("div")
    //     .text(labels);

    //GeoJsonに変換
    var geoJson = new Array();
    
    list.forEach(function(elm){
            
        var obj = {
            "type" : "Feature",
            "geometry" : {
                "type": "Point",
                "coordinates" : [elm.lon, elm.lat]
            },
            "properties" : {
                "name" : elm.name
            }
        };

        geoJson.push(obj);
        
    });

    //center
    var sum_lat = 0;
    var sum_lon = 0;    
    geoJson.forEach(function(obj){
        sum_lat += Number(obj.geometry.coordinates[1]);
        sum_lon += Number(obj.geometry.coordinates[0]);        
    });
    var center = new L.LatLng(sum_lat / geoJson.length, sum_lon / geoJson.length);
    console.log(center);
    
    //leaflet
    d3.select(root).append("div")
        .attr("id", "mapid");

    var mymap = L.map("mapid").setView(
        center, 
        14
    );
    
    L.tileLayer(
        'http://{s}.tile.osm.org/{z}/{x}/{y}.png', 
        { attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' }
    ).addTo(mymap);
    
    var geojsonMarkerOptions = {
        radius: 10,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1.0,
        fillOpacity: 0.5
    };
    
    geoJson.forEach(function(obj){
        L.geoJSON(obj, {
            onEachFeature: function(feature, layer){
                layer.bindPopup(feature.properties.name);
            }
        }).addTo(mymap);
    })
    
    //console.log(JSON.stringify(geoJson));

    // geoJson.forEach(function(obj){
    //     console.log((JSON.stringify(obj)));
    // });

        /*
	var name = labels[0];
  var key = labels[1];  
  
  list.forEach(function(d){
  	d[key] = +d[key];
  });

  if (!env.colors()) env.colors(d3.scale.category10().range());
  var color = d3.scale.ordinal().range(env.colors());

  x.domain(list.map(function (d) { return d[name]; }));
  y.domain([0, d3.max(list.values(key))]);
  color.domain(list.map(function (d) { return d[name]; }))

  var setup = function (selection) {
    selection
        .attr('class', 'bar')
        .attr('x', function (d) { return x(d[name]); })
        .attr('y', function (d) { return y(d[key]); })
        .attr('height', function (d) { return height - y(d[key]); })
        .attr('width', x.rangeBand())
        .attr('size', '50')
        .style('fill', function (d) { return color(d[name]); });
  }

  chart.selectAll('.axis').remove();

  chart.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
      .append('text')
      .attr('transform', 'rotate(0)')
      .attr('x', width / 2)
      .attr('dy', '3.0em')
      .style('text-anchor', 'middle')
      .style('font-size', '16px')
      .text(name);


  chart.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
    .append('text')
      .attr('transform', 'translate(0, ' + (height / 2) + ') rotate(-90)')
      .attr('dy', '-3.0em')
      .style('text-anchor', 'middle')
      .style('font-size', '16px')
      .text(key);

  rect = chart.selectAll('.bar').data(list);

  rect.transition().duration(500).call(setup);

  rect.enter().append('rect').call(setup);

  rect.exit().remove();
  */
}
