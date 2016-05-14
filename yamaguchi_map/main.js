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
  .center([131.4705, 34.186121])   //経度、緯度の設定
  .scale(Math.min(width, height) * 40)   
  .translate([ width/2, height/2]);　//画面の中心にセットする

var path = d3.geo.path().projection(projection);

svg.append('g').attr('id', 'legend_group');


//##########################################
//topojsonデータを取り込み地図を表示させる。
//##########################################



var topoSelection =null;

d3.json('yamaguchi.topojson', function (error, json) {
topoSelection=svg.selectAll('.states')
    .data(topojson.feature(json, json.objects.yamaguchi).features)
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
  var color = d3.scale.linear()
    .domain(env.colorsDomain(d3.min(values), d3.max(values)))
    .range(env.colors())
    .interpolate(d3.interpolateLab);

  if (svg.selectAll('.states').empty())
    return false;

  svg.selectAll('.states')
    .attr('fill', function (d) {
      if (map[d.properties.shi] && $.isNumeric(map[d.properties.shi][key])) {
       return color(+map[d.properties.shi][key]);

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
cityname();  //市町村名記載


		svg.append("text")
   .attr("transform", "translate("+(width/5.5)+", "+(height/6-25)+")")
		   .text(key)            //凡例文字の設定
  		   .attr("fill","black")       //線の色を設定
   　　　.attr("font-size","20pt");
		svg.append("text")
   .attr("transform", "translate("+(width/5.5)+", "+(height/6)+")")
		   .text(d.properties.shi)            //凡例文字の設定
  		   .attr("fill","black")       //線の色を設定
   　　　　　　　 .attr("font-size","20pt");
		svg.append("text")
   .attr("transform", "translate("+(width/5.5)+", "+(height/6+25)+")")
		   .text(map[d.properties.shi][key])            //凡例文字の設定
  		   .attr("fill","red")       //線の色を設定
   　　　　　　　 .attr("font-size","20pt");


    });


//##########################################################
//市町村名を表示する関数定義。文字表示位置は緯度経度を指定している。
//##########################################################


function cityname(){

var shimonoseki=[130.98047,34.0844468];
var onoda=[131.04584,33.99];
var mine=[131.24039646781893, 34.19470441501321];
var ube=[131.25477793858025, 33.950120195795935];
var nagato=[131.1066487897387, 34.309754776899844];
var hagi=[131.42304114648763, 34.314506293845426];
var abu=[131.47234032427363, 34.50878409759875];
var yamaguchi=[131.5085621193086, 34.171843880596455];
var hofu=[131.555517660905, 34.052252064409914];
var shunan=[131.81277900411928, 34.1565845859056];
var iwakuni=[132.0543877129094, 34.124236039242696];
var kudamatsu=[131.8404389462304, 34.0455443871449];
var yanai=[132.1234187725637, 33.99399041436279];
var suo=[132.21546018543614, 33.86191394340217];
var hikari=[131.9450885351234, 33.95921690551362];
var kamiga=[132.09177953688882, 33.763932378830205];
var hirau=[132.06589288951844, 33.871467110256276];
var tabuse=[132.0630165953662, 33.938309336027366];
var wagi=[132.19370733112964, 34.23068435866751];

		svg.append("text")
		   .attr("transform", "translate("+(projection(shimonoseki)[0])+", "+(projection(shimonoseki)[1])+")")
		   .text("下関市")            //凡例文字の設定
  		   .attr("fill","black")       //線の色を設定
    　　　　　　　 .attr("font-size","10pt");
		svg.append("text")
		   .attr("transform", "translate("+(projection(onoda)[0])+", "+(projection(onoda)[1])+")")
		   .text("山陽小野田市")            //凡例文字の設定
  		   .attr("fill","black")       //線の色を設定
    　　　　　　　 .attr("font-size","10pt");
		svg.append("text")
		   .attr("transform", "translate("+(projection(ube)[0])+", "+(projection(ube)[1])+")")
		   .text("宇部市")            //凡例文字の設定
  		   .attr("fill","black")       //線の色を設定
    　　　　　　　 .attr("font-size","10pt");
		svg.append("text")
		   .attr("transform", "translate("+(projection(mine)[0])+", "+(projection(mine)[1])+")")
		   .text("美祢市")            //凡例文字の設定
  		   .attr("fill","black")       //線の色を設定
    　　　　　　　 .attr("font-size","10pt");
		svg.append("text")
		   .attr("transform", "translate("+(projection(nagato)[0])+", "+(projection(nagato)[1])+")")
		   .text("長門市")            //凡例文字の設定
  		   .attr("fill","black")       //線の色を設定
    　　　　　　　 .attr("font-size","10pt");
		svg.append("text")
		   .attr("transform", "translate("+(projection(hagi)[0])+", "+(projection(hagi)[1])+")")
		   .text("萩市")            //凡例文字の設定
  		   .attr("fill","black")       //線の色を設定
    　　　　　　　 .attr("font-size","10pt");
		svg.append("text")
		   .attr("transform", "translate("+(projection(abu)[0])+", "+(projection(abu)[1])+")")
		   .text("阿武町")            //凡例文字の設定
  		   .attr("fill","black")       //線の色を設定
    　　　　　　　 .attr("font-size","10pt");
		svg.append("text")
		   .attr("transform", "translate("+(projection(yamaguchi)[0])+", "+(projection(yamaguchi)[1])+")")
		   .text("山口市")            //凡例文字の設定
  		   .attr("fill","black")       //線の色を設定
    　　　　　　　 .attr("font-size","10pt");
		svg.append("text")
		   .attr("transform", "translate("+(projection(hofu)[0])+", "+(projection(hofu)[1])+")")
		   .text("防府市")            //凡例文字の設定
  		   .attr("fill","black")       //線の色を設定
    　　　　　　　 .attr("font-size","10pt");
		svg.append("text")
		   .attr("transform", "translate("+(projection(shunan)[0])+", "+(projection(shunan)[1])+")")
		   .text("周南市")            //凡例文字の設定
  		   .attr("fill","black")       //線の色を設定
    　　　　　　　 .attr("font-size","10pt");
		svg.append("text")
		   .attr("transform", "translate("+(projection(iwakuni)[0])+", "+(projection(iwakuni)[1])+")")
		   .text("岩国市")            //凡例文字の設定
  		   .attr("fill","black")       //線の色を設定
    　　　　　　　 .attr("font-size","10pt");
		svg.append("text")
		   .attr("transform", "translate("+(projection(kudamatsu)[0])+", "+(projection(kudamatsu)[1])+")")
		   .text("下松市")            //凡例文字の設定
  		   .attr("fill","black")       //線の色を設定
    　　　　　　　 .attr("font-size","10pt");
		svg.append("text")
		   .attr("transform", "translate("+(projection(yanai)[0])+", "+(projection(yanai)[1])+")")
		   .text("柳井市")            //凡例文字の設定
  		   .attr("fill","black")       //線の色を設定
    　　　　　　　 .attr("font-size","10pt");
		svg.append("text")
		   .attr("transform", "translate("+(projection(suo)[0])+", "+(projection(suo)[1])+")")
		   .text("周防大島町")            //凡例文字の設定
  		   .attr("fill","black")       //線の色を設定
    　　　　　　　 .attr("font-size","10pt");
		svg.append("text")
		   .attr("transform", "translate("+(projection(hikari)[0])+", "+(projection(hikari)[1])+")")
		   .text("光市")            //凡例文字の設定
  		   .attr("fill","black")       //線の色を設定
    　　　　　　　 .attr("font-size","10pt");
		svg.append("text")
		   .attr("transform", "translate("+(projection(kamiga)[0])+", "+(projection(kamiga)[1])+")")
		   .text("上関町")            //凡例文字の設定
  		   .attr("fill","black")       //線の色を設定
    　　　　　　　 .attr("font-size","10pt");
		svg.append("text")
		   .attr("transform", "translate("+(projection(hirau)[0])+", "+(projection(hirau)[1])+")")
		   .text("平生町")            //凡例文字の設定
  		   .attr("fill","black")       //線の色を設定
    　　　　　　　 .attr("font-size","10pt");
		svg.append("text")
		   .attr("transform", "translate("+(projection(tabuse)[0])+", "+(projection(tabuse)[1])+")")
		   .text("田布施町")            //凡例文字の設定
  		   .attr("fill","black")       //線の色を設定
    　　　　　　　 .attr("font-size","10pt");
		svg.append("text")
		   .attr("transform", "translate("+(projection(wagi)[0])+", "+(projection(wagi)[1])+")")
		   .text("和木町")            //凡例文字の設定
  		   .attr("fill","black")       //線の色を設定
    　　　　　　　 .attr("font-size","10pt");
};

cityname(); //市町村を実際に描写する。




//##########################################################
//デバッグ用　クリックした場所の緯度経度と、座標を書き出す。
//##########################################################


d3.select(root).on("click",function(){
var coordinates = d3.mouse(this) ;  //クリックした場所の座標を取り込み
var test=projection.invert(coordinates);  //座標→経度緯度表示
var test1=projection(test);//経度緯度　→　座標　変換
console.log(coordinates);
console.log(test);
console.log(test1);

});


}
