//# require=d3,leaflet

var labels; //項目名
var list; //データのリスト
var geoJson = new Array(); //GeoJsonの配列
var mymap ; //Leafletの地図オブジェクト
var zoom = 14; //地図倍率
var markers = new Array() //マーカーの配列

function update(data) {
    
	//ヘッダーの取得
	labels = data[0];
	
	//データのリスト化
	list = data.toList();

  //リストをGeoJson形式に変換
  //****************************************
  geoJson = []; //配列初期化
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
  //****************************************

  //緯度・経度の平均値を求める
  //****************************************
  var sum_lat = 0;
  var sum_lon = 0;    
  geoJson.forEach(function(obj){
      sum_lat += Number(obj.geometry.coordinates[1]);
      sum_lon += Number(obj.geometry.coordinates[0]);        
  });
  var center = new L.LatLng((sum_lat / geoJson.length), (sum_lon / geoJson.length));
  console.log(center);
  //****************************************
    
  //地図を描画するdvi要素を追加
  //****************************************
  if(d3.select("#mapid").empty()){
    d3.select(root).append("div").attr("id", "mapid");

    mymap = L.map("mapid").setView(center, zoom);
  
    L.tileLayer(
      'http://{s}.tile.osm.org/{z}/{x}/{y}.png', 
      { attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' }
    ).addTo(mymap);
  }
  else{
    mymap.setView(center, zoom)
  }
  //****************************************
  
  //マーカーを描画
  //****************************************
  markers.forEach(function(marker){
    marker.remove();
  })
  
  markers = []; //配列の初期化
  
  geoJson.forEach(function(obj){
      marker = L.geoJSON(obj, {
          onEachFeature: function(feature, layer){
              layer.bindPopup(feature.properties.name);
          }
      }).addTo(mymap);
      
      markers.push(marker);
  })
  //****************************************
  
}
