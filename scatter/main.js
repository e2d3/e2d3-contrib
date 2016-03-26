//# require=d3

//	var svgEle = document.getElementById("myGraph");
	var svgWidth = root.clientWidth;
	var svgHeight = root.clientHeight;
        var yohakuY =20;        //グラフ上部の余白のこと
 	var offsetX = 55;	// X座標のオフセット
        var offsetX1 = 10;      //　グラフ右端余白
	var offsetY =45;	// Y座標のオフセット
        var yAxisHeight=svgHeight-offsetY-yohakuY;   //横軸の範囲
        var xAxisWidth=svgWidth-offsetX-offsetX1;     //縦軸の範囲
	var svgElement = d3.select(root).append('svg')
                                        .attr('width', root.clientWidth)
                                        .attr('height', root.clientHeight);


// #############################################



d3.text("data.csv", function(error, text) {
	var data = d3.csv.parseRows(text);  //CSVファイルデータの読み込み
	var dataSet=[];  //配列datasetを定義
	var dSet=[];  //配列dSetを定義
	var dSetL=[];
        var hanrei_X=200;       //凡例のX位置
        var hanrei_Y=200;       //凡例のY位置
        var k=0;




        var circleElements=[];


      // ####################################################
      // csvデータの行数と列数を読み込む
      // ####################################################


	var nagasa=data.length;    //行数(dataの配列深さ)
        var youso=data[0].length;  //列数

        console.log(youso);

       // ####################################################
      // 1の位で切り捨てを行う関数
      // ####################################################

	function kirishute(num){
		num=num/10;
		return 10*Math.floor(num);
		};



       // ####################################################
      // 1の位で切り捨てを行う関数
      // ####################################################

 	function kiriage(num){
		num=num/10;
		return 10*Math.ceil(num);
		};




      // ####################################################
      // 系列名、グラフの色、凡例の位置、X,Y軸のラベル の設定値を取得
      // ####################################################

	var label1=[];   
	label1=data[0];  //ヘッダー格納 

	var iro=[];    
        iro=data[1]; //グラフの線色設定を取得
                    
	var xlab=data[0][0];       //X軸　ラベル名
	var ylab=data[1][0];       //Y軸　ラベル名

 
        var hanrei_X=data[0][youso-1]*1;       //凡例のX位置
        var hanrei_Y=data[1][youso-1]*1;       //凡例のY位置

     





      // ####################################################
      // 系列名、色情報を省き、数値データのみをdataSetに格納する
      // ####################################################

	for(i=2;i<nagasa;i++){
	dataSet[i-2]=data[i];
	};



      // ##########################################################
      // 系列ごとにデータを分割する。 dSet:散布図用 ,dSetL:直線用
      // ##########################################################

	var d0=[];
	var d1=[];
	var d2=[];
	var dd0=[];
	var dd1=[];
	var dd2=[];

	for(k=1;k<youso-1;k++){

		for(j=1;j<nagasa-1;j++){
			d0=dataSet[j-1][0]*1;
			d1=dataSet[j-1][k]*1;
			d2=k*1;

			dd0[j-1]=d0;
			dd1[j-1]=d1;
			dd2[j-1]=k*1;

		dSet[(k-1)*(nagasa-2)+j-1]=[d0,d1,d2];
		}

	dSetL[k-1]=d3.transpose(d3.transpose([dd0,dd1,dd2]));

	}

            // console.log(dSet);

      // ##########################################################
      // データの最大値,最小値を求める。
      // ##########################################################

// X系列,Y系列それぞれ　最大値,最小値が10以下であれば、最大値、最小値をそのまま使う。
 // X系列,Y系列それぞれ　最大値,最小値が10以上であれば、1の位で切り上げ(@最大値) , 1の位で切り捨て(@最小値)

	function getMin(num){
        	 if(Math.abs(num)<10) {
			return num;
                             }	
	         else {
                        return kirishute(num);
                      }

                  };

	function getMax(num){
        	 if(Math.abs(num)<10) {
			return num;	
                             }	
	       else {
                        return kiriage(num);
                    }

                 };

     TrdSet=d3.transpose(dSet); //transposeを行わないと、d3.max, d3.minが使えない

 		var maxX  = d3.max(TrdSet[0]);
                    maxX  = getMin(maxX);// X座標値最大

		var maxY = d3.max(TrdSet[1]);
                    maxY = getMax(maxY); // Y座標値最大
            

		var minX = d3.min(TrdSet[0]);
                    minX = getMin(minX);

 		var minY = d3.min(TrdSet[1]);
                    minY = getMin(minY);


      // ##########################################################
      // スケール設定値計算
      // ##########################################################



		// 横の目盛りを表示するためにD3スケールを設定
		var xScale = d3.scale.linear()  // スケールを設定
			.domain([minX, maxX])   // 元のサイズ
			.range([0, xAxisWidth]) // 実際の出力サイズ


		// 縦の目盛りを表示するためにD3スケールを設定
		var yScale = d3.scale.linear()  // スケールを設定
			.domain([minY, maxY])   // 元のサイズ
			.range([yAxisHeight,0]) // 実際の出力サイズ


      // ##########################################################
      // 散布図データをプロットする。
      // ##########################################################


//	var circleElements=d3.select("#myGraph")
	var circleElements=svgElement
		             .selectAll("path")
		             .data(dSet)
                             .enter()
                             .append("path")
                             .attr("transform",function(d) { return "translate(" + (xScale(d[0]*1)+offsetX) + " , " +(yScale(d[1]*1)+yohakuY) + ")"; })
                             .attr("d", d3.svg.symbol().type("circle").size(40))
                             .attr("fill",function(d) { return iro[d[2]]})

      // ##########################################################
      // 関数 drawScaleの定義
      // ##########################################################


	function drawScale(){


      // ##########################################################
      // Y軸の描写設定をする。    Y軸のラベル描写
      // ##########################################################


	
	svgElement.append("g")	                // g要素を追加。これが目盛りを表示する要素になる
		   .attr("class", "axis")	// CSSクラスを指定
		   .attr("transform", "translate("+offsetX*1+", "+(svgHeight-yAxisHeight-1*offsetY)+")")    //軸の描写位置の設定
		   .call(
		           d3.svg.axis()       //y軸の設定
			     .scale(yScale)    //スケールを適用する
			     .orient("left")   //目盛りの表示位置を左側に指定
			)
                   .append("text")     //Y軸のラベル描写
                   .attr("dx", "-10em")   //y座標
                   .attr("dy", "-2.2em")
                   .attr("transform", "rotate(" + -90 + ")" )
                   .text(ylab);

      // ##########################################################
      // X軸の描写設定をする。 & X軸のラベル位置設定
      // ##########################################################


		// 目盛りを表示  //X座標表示
		svgElement.append("g")	// g要素を追加。これが目盛りを表示する要素になる
			.attr("class", "axis")	// CSSクラスを指定
			.attr("transform", "translate("+offsetX*1+", "+(svgHeight-offsetY)+")")
			.call(
				d3.svg.axis()
				.scale(xScale)  //スケールを適用する
				.orient("bottom") //目盛りの表示位置を左側に指定
			)      
                        .append("text")     //X座標ラベルを表示
                        .attr("transform", "translate("+(svgWidth*0.4)+", "+(offsetY*0.75)+")")
                        .text(xlab);

      // ##########################################################
      // 凡例表示位置設定
      // ##########################################################

	for(k=0;k<youso-2;k++){
		svgElement.append("text")
		   .attr("transform", "translate("+(hanrei_X)+", "+(hanrei_Y+20*k)+")")
		   .text(label1[k+1])            //凡例文字の設定
  		   .attr("fill",iro[k+1]);       //線の色を設定
			}
	
      // ##########################################################
      // 補助線設定
      // ##########################################################



		divX=kirishute((maxX-minX)/5);   //X軸補助線 間隔計
		divY=kirishute((maxY-minY)/5);   //Y軸補助線 間隔計
		var grid = svgElement.append("g");
		var rangeX = d3.range(minX, maxX, 20);   // 横方向と縦方向のグリッド間隔を自動生成
		var rangeY = d3.range(minY, maxY, 20);

      // ##########################################################
      // // 水平方向のグリッドを描写         
      // ##########################################################		


		grid.selectAll("line.y")	// line要素のyクラスを選択
			.data(rangeY)	// 縦方向の範囲をデータセットとして設定
			.enter()
			.append("line")	// line要素を追加
			.attr("class", "grid")	// CSSクラスのgridを指定
			.attr("x1", offsetX)     // (x1,y1)-(x2,y2)の座標値を設定
			.attr("y1", function(d, i){
//				return svgHeight - yScale(d) + yohakuY-offsetY;
                                    return yohakuY+yScale(d);
			})
			.attr("x2", xScale(maxX) + offsetX)
			.attr("y2", function(d, i){
//				return svgHeight - yScale(d) + yohakuY-offsetY;
                                     return yohakuY+yScale(d);
			});

      // ##########################################################
      // // 垂直方向のグリッドを描写         
      // ##########################################################



		grid.selectAll("line.x")	// line要素のxクラスを選択
			.data(rangeX)	// 横方向の範囲をデータセットとして設定
			.enter()
			.append("line")	// line要素を追加
			.attr("class", "grid")	// CSSクラスのgridを指定
			// (x1,y1)-(x2,y2)の座標値を設定
			.attr("x1", function(d, i){
				return xScale(d) + offsetX;
			})
			.attr("y1", svgHeight - offsetY)
			.attr("x2", function(d, i){
				return xScale(d) + offsetX;
			})
			.attr("y2", svgHeight -offsetY - yAxisHeight)


      // ##########################################################
      //   データ間を直線で結ぶ。         
      // ##########################################################





            // ##########################################################
            //  データ間に引かれた線をオブジェクトとして定義する。
            // ##########################################################


		var line = d3.svg.line()
		.x(function(d){ return xScale(d[0]*1) + offsetX; })
		.y(function(d){ return yScale(d[1]*1) + yohakuY; })
	

            // ##########################################################
            //  各系列ごとに線を描写する。
            // ##########################################################


	for(k=0;k<youso-2;k++){
		dSetL[k]=d3.transpose(dSetL[k]);

		       var     line0=svgElement.append("path")            // パスを追加
					.attr("d", line(dSetL[k]))        // 配列の座標を渡してpath要素のd属性に設定
					.attr("stroke", iro[k+1])         // 線の色を指定する。
					.attr("fill", "none")             // 線の塗りを無しにする
			                .attr("stroke-width",4)           // 線の太さを設定。
			                .style("visibility", "visible")   // 線を表示状態にする。
			                .attr("class",dSetL[k][0][2])      // 系列情報を持たせたいだけ。 classの本来の使い方とは違う
					.on("click",function(){                                               // 線の上のカーソルがライン上から外れたとき
						var iro_state=d3.select(this).attr("stroke");                    // 線の色情報を取得。
 			                	var keiretsu_line= d3.select(this).attr("class"); 
							if(iro_state== "#fbf1f4"){                               // 線の色が灰色ならば
								d3.select(this).attr("stroke", iro[keiretsu_line])     // 線の系列ごとに定めた色に変更する。
										}
							else if(iro_state==iro[keiretsu_line]){                 //    線の系列ごとに定めた色ならば
								d3.select(this).attr("stroke", "#fbf1f4");     // 線の色を灰色にする。
											      }                
								 }); //mouseoutイベント終わり

			     }; //for文の終わり  








};   //drawScale()関数の終わり


            // ##########################################################
            // グラフ全体の描写を行う。
            // ##########################################################

	drawScale();



});   // d3.txt関数の終わり













            // ##########################################################
            // 以下は余分なコード
            // ##########################################################


// var tooltip1 = d3.select("body")
//	.append("div")
//	.style("position", "absolute")
//	.style("z-index", "100")
//	.style("visibility", "hidden")
//	.text("a simple tooltip");


//	var circleElements = svg
//		.selectAll("circle")	// circle要素を追加
//		.data(dSet)	// データセットを要素に設定
//	circleElements
//		.enter()
//		.append("circle")	// データの数だけcircle要素が追加される
//		.attr("class", "mark")	// CSSクラスを指定
//		.attr("cx", function(d, i){
//			return xScale(d[0]*1) + offsetX;	// 最初の要素をX座標にする
//		})
//		.attr("cy", function(d, i){
//			return yScale(d[1]*1)+yohakuY;	// 2番目の要素をY座標にする
//		})
//		.attr("r", 5)	// 半径を指定する
//		.attr("opacity",1.0)
//         .attr("fill",d[2]);


//function mouse11(){
//circleElements.attr("fill", "#fbf1f4");
//	}
//function mouse12(){
//circleElements.attr("fill", iro);
//	}



          //(4) ツールチップを生成
	//var tooltip = d3.select("body")
	//	.append("div")
	//	.attr("class", "tip")
// ツールチップに時間表示
        // circleElements
	//	.on("mouseover", function(d){
	//		var x = parseInt(xScale(d[0]*1));	// 円のX座標値
	//		var y = parseInt(yScale(d[1]*1)+yohakuY);	// 円のY座標値
	//		var data = d3.select(this).datum();
          //            console.log(data);
// 要素のデータを読み出す
//	var t=parseInt(data[2]);
            //        var t="aaaa";
	//		tooltip
	//			.style("left", offsetX+x+"px")
	//			.style("top", y+offsetY+ "px")
	//			.style("visibility", "visible")	// ツールチップを表示する
	//			.text(t)
	//	})
	//	.on("mouseout", function(){
	//		tooltip.style("visibility", "hidden")	// ツールチップを非表示にする
          //
	//	});
//     	svgWidth = parseFloat(svgWidth);	// 値は単位付きなので単位を削除する
//	svgHeight = parseFloat(svgHeight);	// 値は単位付きなので単位を削除する
        
//	var svg = d3.select("#myGraph");	// SVG要素を指定

// #############################################

//var margin = { top: 20, right: 30, bottom: 30, left: 40 };       //グラフが表示されない周囲の余白のこと
//var margin = { top: 0, right: 0, bottom: 0, left: 0 };
//var  width = root.clientWidth - margin.left - margin.right;      //root.clientWidth 表示画面のWidth
//var  height = root.clientHeight - margin.top - margin.bottom;    //root.clientHeight 表示画面のWidth

//var x = d3.scale.ordinal() //x軸の設定
//  .rangeRoundBands([0, width], .1)//root.clientHeight 表示画面のWidth(整数にする)

//var y = d3.scale.linear()//y軸の設定
//  .rangeRound([height, 0])//height , 0 の順番で原点0が下側になる。

//var color = d3.scale.category10();//棒グラフの色設定

//var xAxis = d3.svg.axis()//x軸項目表示設定
  //  .scale(x)
    //.orient('bottom');
//var yAxis = d3.svg.axis()//y軸数値表示設定
  //  .scale(y)
  //  .orient('left')

//var chart = d3.select(root).append('svg')
  //  .attr('width', root.clientWidth)
  //  .attr('height', root.clientHeight)
 // .append('g')
   // .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');