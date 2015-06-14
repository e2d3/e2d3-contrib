<<<<<<< HEAD
//# require=d3,c=Cesium
=======
//# require=d3,Cesium
>>>>>>> 1124bbe25d4965448fcddf48504a0c328ed9cc48


//Cesiumが読み込まれているか確認
console.log("installed", Cesium);

//Cesium用 divの追加 
var cesiumContainer = d3.select("#e2d3-chart-area")
	.append('div')
	.attr('id', 'cesiumContainer')

//ceisumビューアー表示
var viewer = new Cesium.Viewer('cesiumContainer');



function update(data) {
	//Excelから取得したデータをGeoJSONにする
	var geojson =  toPointGeoJSON(toObjectArray(data));
	 

	//現在表示されているマーカーを削除する
	viewer.dataSources.removeAll();

	//マーカーのスタイル指定をgeojsonデータに追加する
	geojson.features.forEach(function(d){
		d.properties['label'] = d.properties['名前'];
		d.properties['marker-color'] = d.properties['色'] || '#ccc';
		d.properties['marker-symbol'] =  d.properties['アイコン'] || '?';
	});

	//マーカー表示
	viewer.dataSources.add(Cesium.GeoJsonDataSource.load(geojson));
	
	//スタート地点へズーム
	var lnglat = geojson.features[0].geometry.coordinates;
	panTo(lnglat[0], lnglat[1])	
}


function panTo(lng, lat){
	viewer.camera.flyTo({
		destination : Cesium.Cartesian3.fromDegrees(lng, lat, 700000)
	});		
}

//[{key:value},{key:value}]の形式に変換
function toObjectArray(array){
  var header = array.shift();
  var objArray = []; 
  for(var b=0; b < array.length; b++){
    var tmp = {};
    for(var i=0; i< header.length; i++){
      tmp[header[i]]=array[b][i];
    }
    objArray.push(tmp);
  }
  return objArray;
}

//Geojsonに変換
function toPointGeoJSON(dataObj){
	var container = {
		'type': 'FeatureCollection',
		'features': []
	}
	
	var pointTemplate = {
		'type': 'Feature',
		'properties': {},
		'geometry': {
		'type': 'Point',
			'coordinates': [null,null]
		}
    }
	
	var points = dataObj.map(function(d){
		var point =JSON.parse(JSON.stringify(pointTemplate));
		point.properties = d;
		point.geometry.coordinates = [d['経度'], d['緯度']];
		return point
	});
	
	container.features = points;
	
	return container;
}
