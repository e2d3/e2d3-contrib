//# require=d3

/*
** Created by jw on 2017/04/10
*/


/* initial settings ********************************/

//Screen size
var margin = {
	top: 0,
	right: 0,
	bottom: 0,
	left: 0
};
var width = root.clientWidth - margin.left - margin.right;
var height = root.clientHeight - margin.top - margin.bottom;

var svg = d3.select(root).append('svg')
  .attr('width', width) 
  .attr('height', height) 
  .attr('style', 'display: block; margin: auto;');


function update(data) {
  /* tsv形式を一括取り込みする */
  var rowdata = data.toList();

  /* Node情報とリンク情報にふるい分けする */
  var arrNodes = [];
  var arrNodeColor = [];
  var arrNodeSize = [];
  var arrLinks = [];
  var arrLinkColor = [];
  var arrLinkWidth = [];
  var arrLinkDistance = [];
  var intX;
  var intSource;
  var intTarget;
  var intValue;

  var strTemp = "";
  for(key in rowdata){
    strTemp = "";
    strTemp = String(rowdata[key].id) + String(rowdata[key].label);
    if (strTemp != "" && typeof(rowdata[key].id) != "undefined"){
      arrNodes.push({id:rowdata[key].id,label:rowdata[key].label});  
      if (typeof(rowdata[key].color) != "undefined"){
        arrNodeColor.push(rowdata[key].color);
      }else{
        arrNodeColor.push("#000000");
      }
      if (typeof(rowdata[key].size) != "undefined"){
        arrNodeSize.push(rowdata[key].size);
      }else{
        arrNodeSize.push(30);
      }
    }

    strTemp = "";
    strTemp = String(rowdata[key].source) + String(rowdata[key].target) + String(rowdata[key].value);
    if (typeof rowdata[key].source === "undefined") {
      intSource = -1;
    }else{
      intSource = Number(rowdata[key].source);
    }
    if (typeof rowdata[key].target === "undefined") {
      intTarget = -1;
    }else{
      intTarget = Number(rowdata[key].target);
    }
    if (typeof rowdata[key].value === "undefined") {
      intValue = -1;
    }else{
      intValue = Number(rowdata[key].value);
    }
//    intX = Number(rowdata[key].source) + Number(rowdata[key].target) + Number(rowdata[key].value);
    intX = intSource + intTarget + intValue;
    if (intX != -3){
      arrLinks.push({source:intSource,target:intTarget,value:intValue});
      if (typeof(rowdata[key].color) != "undefined"){
        arrLinkColor.push(rowdata[key].color);
      }else{
        arrLinkColor.push("#333333");
      }
      if (typeof(rowdata[key].width) != "undefined"){
        arrLinkWidth.push(rowdata[key].width);
      }else{
        arrLinkWidth.push(3);
      }
      if (typeof(rowdata[key].distance) != "undefined"){
        arrLinkDistance.push(rowdata[key].distance);
      }else{
        arrLinkDistance.push(3);
      }
    }
  }
console.log(arrNodeColor);
console.log(JSON.stringify(arrLinks,null,'\t'));
console.log(arrLinks.length);
// d3.dataで一括代入するときは下記で処理する。
// d3.data(objJson);
// var objJson = JSON.parse("{\"nodes\":[" + JSON.stringify(arrNodes) + "],\"links\":[" + JSON.stringify(arrLinks) + "]}");
//var svg = d3.select(root).append('svg')
//  .attr('width', width) 
//  .attr('height', height) 
//  .attr('style', 'display: block; margin: auto;');

  var force = d3.layout.force()
                       .nodes(arrNodes)
                       .links(arrLinks)
                       .size([width, height])
                       .distance(function(d,i){return arrLinkDistance[i];}) // node間距離
                       .friction(0.5) // 摩擦力
                       .charge(-5000) // 反発力
                       .gravity(0.7) // 引力。
                       .start();
// link線の描画(svgのline描画機能を利用)
  var link = svg.selectAll("line")
      .data(arrLinks)
      .enter()
      .append("line")
      .style({stroke: function(d,i){return arrLinkColor[i];},
      "stroke-width": function(d,i){return arrLinkWidth[i];}
  });
  // nodes描画
  var node = svg.selectAll("circle")
                .data(arrNodes)
                .enter()
                .append("circle")
                .attr({
          //半径をランダムにする
          r: function(d,i){return arrNodeSize[i];}
      })
      .style({
        fill: function(d,i){return arrNodeColor[i];}
      })
      .call(force.drag);

  // nodeのラベル設定
  var label = svg.selectAll('text')
      .data(arrNodes)
      .enter()
      .append('text')
      .attr({
          "text-anchor":"middle",
          "fill":"blue",
          "font-size": "12px"
      })
      .text(function(data) { return data.label; });

  // tickイベント
  force.on("tick", function() {
      link.attr({
          x1: function(data) { return data.source.x;},
          y1: function(data) { return data.source.y;},
          x2: function(data) { return data.target.x;},
          y2: function(data) { return data.target.y;}
      });
      node.attr({
          cx: function(data) { return data.x;},
          cy: function(data) { return data.y;}
      });
      // labelも追随させる
      label.attr({
          x: function(data) { return data.x;},
          y: function(data) { return data.y;}
      });
  });
}