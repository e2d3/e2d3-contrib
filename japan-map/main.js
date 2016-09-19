//# require=d3,topojson,jquery,colorbrewer


//#######################################
//プルダウンボックス設定
//#######################################


 var selectButtonWidth = parseInt((root.clientWidth / 2) * 0.9);
 var legendHeight = 30;
 var base = d3.select(root)
              .append("section")
              .attr("id", "mainFrame");
 var legendArea  = base.append("div")             //プルダウンボックスオブジェクト
                       .attr("id", "legend-area")
                       .style({'height': function() { return legendHeight + 'px';},
                                      'text-align': 'left',
                                      'padding-left': '10px',
                                      'width': '100%'
                                    });






//#######################################
//表示画面設定
//#######################################

var width = root.clientWidth;
var height = root.clientHeight;
var svg = d3.select(root).append('svg')
  .attr('width', width) 
  .attr('height', height) 
  .attr('style', 'display: block; margin: auto;');


//#######################################
//取り込んだ地図の配置場所設定
//#######################################


//設定した経度、緯度を画面の中心にして地図を描写する。
var projection = d3.geo.mercator()  
  .center([135.4705, 34.086121])   //経度、緯度の設定
  .scale(Math.min(width, height) * 1.9 ) 
  .translate([ width/2, height/2]);　//画面の中心にセットする

var path = d3.geo.path().projection(projection);

svg.append('g').attr('id', 'legend_group');


//##########################################
//topojsonデータを取り込み地図を表示させる。
//##########################################



var topoSelection =null;

d3.json('japan.topojson', function (error, json) {
topoSelection=svg.selectAll('.states')
    .data(topojson.feature(json, json.objects.japan).features)
    .enter().append('path')
    .attr('stroke', 'gray')
    .attr('stroke-width', '0.5')
    .attr('id', function (d) { return 'state_' + d.id})
    .attr('class', 'states')
    .attr('fill', '#ffffff')
    .attr('d', path);
    topo=json;    // 投影法設定
    reload();

});
console.log("AAA");
console.log(topoSelection);
//##########################################
//update関数
//##########################################



function update(data) {
  var map = data.toMap({typed: true});
  var key = map.header[0];  //表のヘッダー(Ex:2013年)
  var values = map.values(key); //表のヘッダーに付随する全データ(Ex:2013年のデータ 1222,333,22・・・・)

  if (svg.selectAll('.states').empty())
    return false;

//##########################################
//topojsonデータを取り込み地図を表示させる。&データに応じて着色する
//##########################################

   function draw(key){

  var map = data.toMap({typed: true});
  var values = map.values(key); //表のヘッダーに付随する全データ(Ex:2013年のデータ 1222,333,22・・・・)
  if (!env.colors()) env.colors(['#ffffff', '#ff0000']);       
 var color = d3.scale.linear()                                  //(1)切り替え コンター
   .domain(env.colorsDomain(d3.min(values), d3.max(values)))    //(1)切り替え コンター
   .range(env.colors())                                         //(1)切り替え コンター
   .interpolate(d3.interpolateLab);                             //(1)切り替え コンター
//var color=d3.interpolateHsl("blue",'#ff0000');                   //(2)切り替え　ヒートマップ
//var dValue=d3.max(values)-d3.min(values);                        //(2)切り替え　ヒートマップ
//var minValue=d3.min(values);                                     //(2)切り替え　ヒートマップ

  if (svg.selectAll('.states').empty())
    return false;

  svg.selectAll('.states')
    .attr('fill', function (d) {
      if (map[d.properties.nam_ja] && $.isNumeric(map[d.properties.nam_ja][key])) {
       return color(+map[d.properties.nam_ja][key]);                //(1)切り替え コンター
//    return color((+map[d.properties.nam_ja][key]-minValue)/(dValue)); //(2)切り替え　ヒートマップ

     } else {
        return '#ffffff';
      };

 });
};


           draw(key);    //実行

//##########################################################
//プルダウンボックスにより選択された項目に応じて着色を行う
//##########################################################



var seriesArray=map.header;


  d3.select('#legend-area').selectAll('select').remove();
  d3.select('#legend-area').selectAll('div').remove();


    d3.select('#legend-area')
        .append('select')
        .style('height', function () {
            return legendHeight + 'px';
        })
        .style('width', function () {
            return selectButtonWidth + 'px';
        })
        .on('change', function () {
            var selectedIndex = d3.select(this).property('selectedIndex');  //添え字
            var data = d3.select(this).selectAll('option')[0][selectedIndex].__data__; //実際のデータ
           selectedRow = selectedIndex;
          key=data;
           draw(key);
        })
        .selectAll('option')
        .data(seriesArray)
        .enter()
        .append('option')
        .style('height', function () {
            return legendHeight + 'px';
        })
        .style('width', function () {
            return selectButtonWidth + 'px';
        })
        .text(function (d) {
            return d;
        });

//##########################################################
//データ表示エリアに緑長方形を配置する。
//##########################################################


svg.append("rect")
.attr("x",function(){ return width/6;})
.attr("y",function(){ return height/6-60;})
.attr("width",200)
.attr("height",110)
.attr("fill","rgba(0,255,0,0.1)")
.attr("stroke","rgba(255,255,0,0.5)")
.attr("stroke-width","5");




//##########################################################
//カーソル上のエリアのデータを表示する。
//##########################################################


    topoSelection.on('mouseover', function(d)
    {

d3.selectAll("text").remove();



		svg.append("text")
   .attr("transform", "translate("+(width/5.5)+", "+(height/6-25)+")")
		   .text(key)            //凡例文字の設定
  		   .attr("fill","black")       //線の色を設定
   　　　.attr("font-size","20pt");
		svg.append("text")
   .attr("transform", "translate("+(width/5.5)+", "+(height/6)+")")
		   .text(d.properties.nam_ja)            //凡例文字の設定
  		   .attr("fill","black")       //線の色を設定
   　　　　　　　 .attr("font-size","20pt");
		svg.append("text")
   .attr("transform", "translate("+(width/5.5)+", "+(height/6+25)+")")
		   .text(map[d.properties.nam_ja][key])            //凡例文字の設定
  		   .attr("fill","red")       //線の色を設定
   　　　　　　　 .attr("font-size","20pt");


    });


//##########################################################
//市町村名を表示する関数定義。文字表示位置は緯度経度を指定している。
//##########################################################







//##########################################################
//デバッグ用　クリックした場所の緯度経度と、座標を書き出す。
//##########################################################


//d3.select(root).on("click",function(){
//var coordinates = d3.mouse(this) ;  //クリックした場所の座標を取り込み
//var test=projection.invert(coordinates);  //座標→経度緯度表示
//var test1=projection(test);//経度緯度　→　座標　変換
//console.log(coordinates);
//console.log(test);
//console.log(test1);

//});


}
