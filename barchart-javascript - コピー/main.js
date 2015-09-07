//# require=d3


var width = 1100, height = 610, margin ={b:90, t:40, l:180, r:50};
var svg = d3.select("body")
	.append("svg").attr('width',width).attr('height',(height+margin.b+margin.t))
	.append("g").attr("transform","translate("+ margin.l+","+margin.t+")");
var data = [ 
	{data:bP.partData(sales_data,2), id:'SalesAttempts', header:["A","B", "C"]},
];
bP.draw(data, svg);


!function(){
	var bP={};	
	var b=30, bb=150, height=600, buffMargin=1, minHeight=14;
	var c1=[-150, 40], c2=[-50, 170], c3=[-10, 240]; //Column positions of labels.
	var colors =["#3366CC", "#DC3912",  "#FF9900","#109618", "#990099", "#0099C6"];
	
	bP.partData = function(data,p){
		var sData={};
		
		sData.keys=[
			d3.set(data.map(function(d){ return d[0];})).values().sort(function(a,b){ return ( a<b? -1 : a>b ? 1 : 0);}),
			d3.set(data.map(function(d){ return d[1];})).values().sort(function(a,b){ return ( a<b? -1 : a>b ? 1 : 0);})		
		];
		
		sData.data = [	sData.keys[0].map( function(d){ return sData.keys[1].map( function(v){ return 0; }); }),
						sData.keys[1].map( function(d){ return sData.keys[0].map( function(v){ return 0; }); }) 
		];
		
		data.forEach(function(d){ 
			sData.data[0][sData.keys[0].indexOf(d[0])][sData.keys[1].indexOf(d[1])]=d[p];
			sData.data[1][sData.keys[1].indexOf(d[1])][sData.keys[0].indexOf(d[0])]=d[p]; 
		});
		
		return sData;
	}
	
	function visualize(data){
		var vis ={};
		function calculatePosition(a, s, e, b, m){
			var total=d3.sum(a);
			var sum=0, neededHeight=0, leftoverHeight= e-s-2*b*a.length;
			var ret =[];
			
			a.forEach(
				function(d){ 
					var v={};
					v.percent = (total == 0 ? 0 : d/total); 
					v.value=d;
					v.height=Math.max(v.percent*(e-s-2*b*a.length), m);
					(v.height==m ? leftoverHeight-=m : neededHeight+=v.height );
					ret.push(v);
				}
			);
			
			var scaleFact=leftoverHeight/Math.max(neededHeight,1), sum=0;
			
			ret.forEach(
				function(d){ 
					d.percent = scaleFact*d.percent; 
					d.height=(d.height==m? m : d.height*scaleFact);
					d.middle=sum+b+d.height/2;
					d.y=s + d.middle - d.percent*(e-s-2*b*a.length)/2;
					d.h= d.percent*(e-s-2*b*a.length);
					d.percent = (total == 0 ? 0 : d.value/total);
					sum+=2*b+d.height;
				}
			);
			return ret;
		}

		vis.mainBars = [ 
			calculatePosition( data.data[0].map(function(d){ return d3.sum(d);}), 0, height, buffMargin, minHeight),
			calculatePosition( data.data[1].map(function(d){ return d3.sum(d);}), 0, height, buffMargin, minHeight)
		];
		
		vis.subBars = [[],[]];
		vis.mainBars.forEach(function(pos,p){
			pos.forEach(function(bar, i){	
				calculatePosition(data.data[p][i], bar.y, bar.y+bar.h, 0, 0).forEach(function(sBar,j){ 
					sBar.key1=(p==0 ? i : j); 
					sBar.key2=(p==0 ? j : i); 
					vis.subBars[p].push(sBar); 
				});
			});
		});
		vis.subBars.forEach(function(sBar){
			sBar.sort(function(a,b){ 
				return (a.key1 < b.key1 ? -1 : a.key1 > b.key1 ? 
						1 : a.key2 < b.key2 ? -1 : a.key2 > b.key2 ? 1: 0 )});
		});
		
		vis.edges = vis.subBars[0].map(function(p,i){
			return {
				key1: p.key1,
				key2: p.key2,
				y1:p.y,
				y2:vis.subBars[1][i].y,
				h1:p.h,
				h2:vis.subBars[1][i].h
			};
		});
		vis.keys=data.keys;
		return vis;
	}
	
	function arcTween(a) {
		var i = d3.interpolate(this._current, a);
		this._current = i(0);
		return function(t) {
			return edgePolygon(i(t));
		};
	}
	
	function drawPart(data, id, p){
		d3.select("#"+id).append("g").attr("class","part"+p)
			.attr("transform","translate("+( p*(bb+b))+",0)");
		d3.select("#"+id).select(".part"+p).append("g").attr("class","subbars");
		d3.select("#"+id).select(".part"+p).append("g").attr("class","mainbars");
		
		var mainbar = d3.select("#"+id).select(".part"+p).select(".mainbars")
			.selectAll(".mainbar").data(data.mainBars[p])
			.enter().append("g").attr("class","mainbar");

		mainbar.append("rect").attr("class","mainrect")
			.attr("x", 0).attr("y",function(d){ return d.middle-d.height/2; })
			.attr("width",b).attr("height",function(d){ return d.height; })
			.style("shape-rendering","auto")
			.style("fill-opacity",0).style("stroke-width","0.5")
			.style("stroke","black").style("stroke-opacity",0);
			
		mainbar.append("text").attr("class","barlabel")
			.attr("x", c1[p]).attr("y",function(d){ return d.middle+5;})
			.text(function(d,i){ return data.keys[p][i];})
			.attr("text-anchor","start" );
			
		mainbar.append("text").attr("class","barvalue")
			.attr("x", c2[p]).attr("y",function(d){ return d.middle+5;})
			.text(function(d,i){ return d.value ;})
			.attr("text-anchor","end");
			
		mainbar.append("text").attr("class","barpercent")
			.attr("x", c3[p]).attr("y",function(d){ return d.middle+5;})
			.text(function(d,i){ return "( "+Math.round(100*d.percent)+"%)" ;})
			.attr("text-anchor","end").style("fill","grey");
			
		d3.select("#"+id).select(".part"+p).select(".subbars")
			.selectAll(".subbar").data(data.subBars[p]).enter()
			.append("rect").attr("class","subbar")
			.attr("x", 0).attr("y",function(d){ return d.y})
			.attr("width",b).attr("height",function(d){ return d.h})
			.style("fill",function(d){ return colors[d.key1];});
	}
	
	function drawEdges(data, id){
		d3.select("#"+id).append("g").attr("class","edges").attr("transform","translate("+ b+",0)");

		d3.select("#"+id).select(".edges").selectAll(".edge")
			.data(data.edges).enter().append("polygon").attr("class","edge")
			.attr("points", edgePolygon).style("fill",function(d){ return colors[d.key1];})
			.style("opacity",0.5).each(function(d) { this._current = d; });	
	}	
	
	function drawHeader(header, id){
		d3.select("#"+id).append("g").attr("class","header").append("text").text(header[2])
			.style("font-size","20").attr("x",108).attr("y",-20).style("text-anchor","middle")
			.style("font-weight","bold");
		
		[0,1].forEach(function(d){
			var h = d3.select("#"+id).select(".part"+d).append("g").attr("class","header");
			
			h.append("text").text(header[d]).attr("x", (c1[d]+5))
				.attr("y", -5).style("fill","grey");
			
			h.append("text").text("通信量(MByte)").attr("x", (c2[d]-25))
				.attr("y", -5).style("fill","grey");
			
			h.append("line").attr("x1",c1[d]-10).attr("y1", -2)
				.attr("x2",c3[d]+10).attr("y2", -2).style("stroke","black")
				.style("stroke-width","1").style("shape-rendering","crispEdges");
		});
	}
	
	function edgePolygon(d){
		return [0, d.y1, bb, d.y2, bb, d.y2+d.h2, 0, d.y1+d.h1].join(" ");
	}	
	
	function transitionPart(data, id, p){
		var mainbar = d3.select("#"+id).select(".part"+p).select(".mainbars")
			.selectAll(".mainbar").data(data.mainBars[p]);
		
		mainbar.select(".mainrect").transition().duration(500)
			.attr("y",function(d){ return d.middle-d.height/2;})
			.attr("height",function(d){ return d.height;});
			
		mainbar.select(".barlabel").transition().duration(500)
			.attr("y",function(d){ return d.middle+5;});
			
		mainbar.select(".barvalue").transition().duration(500)
			.attr("y",function(d){ return d.middle+5;}).text(function(d,i){ return d.value ;});
			
		mainbar.select(".barpercent").transition().duration(500)
			.attr("y",function(d){ return d.middle+5;})
			.text(function(d,i){ return "( "+Math.round(100*d.percent)+"%)" ;});
			
		d3.select("#"+id).select(".part"+p).select(".subbars")
			.selectAll(".subbar").data(data.subBars[p])
			.transition().duration(500)
			.attr("y",function(d){ return d.y}).attr("height",function(d){ return d.h});
	}
	
	function transitionEdges(data, id){
		d3.select("#"+id).append("g").attr("class","edges")
			.attr("transform","translate("+ b+",0)");

		d3.select("#"+id).select(".edges").selectAll(".edge").data(data.edges)
			.transition().duration(500)
			.attrTween("points", arcTween)
			.style("opacity",function(d){ return (d.h1 ==0 || d.h2 == 0 ? 0 : 0.5);});	
	}
	
	function transition(data, id){
		transitionPart(data, id, 0);
		transitionPart(data, id, 1);
		transitionEdges(data, id);
	}
	
	bP.draw = function(data, svg){
		data.forEach(function(biP,s){
			svg.append("g")
				.attr("id", biP.id)
				.attr("transform","translate("+ (550*s)+",0)");
				
			var visData = visualize(biP.data);
			drawPart(visData, biP.id, 0);
			drawPart(visData, biP.id, 1); 
			drawEdges(visData, biP.id);
			drawHeader(biP.header, biP.id);
			
			[0,1].forEach(function(p){			
				d3.select("#"+biP.id)
					.select(".part"+p)
					.select(".mainbars")
					.selectAll(".mainbar")
					.on("mouseover",function(d, i){ return bP.selectSegment(data, p, i); })
					.on("mouseout",function(d, i){ return bP.deSelectSegment(data, p, i); });	
			});
		});	
	}
	
	bP.selectSegment = function(data, m, s){
		data.forEach(function(k){
			var newdata =  {keys:[], data:[]};	
				
			newdata.keys = k.data.keys.map( function(d){ return d;});
			
			newdata.data[m] = k.data.data[m].map( function(d){ return d;});
			
			newdata.data[1-m] = k.data.data[1-m]
				.map( function(v){ return v.map(function(d, i){ return (s==i ? d : 0);}); });
			
			transition(visualize(newdata), k.id);
				
			var selectedBar = d3.select("#"+k.id).select(".part"+m).select(".mainbars")
				.selectAll(".mainbar").filter(function(d,i){ return (i==s);});
			
			selectedBar.select(".mainrect").style("stroke-opacity",1);			
			selectedBar.select(".barlabel").style('font-weight','bold');
			selectedBar.select(".barvalue").style('font-weight','bold');
			selectedBar.select(".barpercent").style('font-weight','bold');
		});
	}	
	
	bP.deSelectSegment = function(data, m, s){
		data.forEach(function(k){
			transition(visualize(k.data), k.id);
			
			var selectedBar = d3.select("#"+k.id).select(".part"+m).select(".mainbars")
				.selectAll(".mainbar").filter(function(d,i){ return (i==s);});
			
			selectedBar.select(".mainrect").style("stroke-opacity",0);			
			selectedBar.select(".barlabel").style('font-weight','normal');
			selectedBar.select(".barvalue").style('font-weight','normal');
			selectedBar.select(".barpercent").style('font-weight','normal');
		});		
	}
	
	this.bP = bP;
}();

var sales_data=[
['業務通信','02:00～02:59',16,0],
['その他','02:00～02:59',1278,4],
['エラー','02:00～02:59',27,0],
['保守通信','02:00～02:59',58,0],
['基幹装置','02:00～02:59',1551,15],
['顧客通信','02:00～02:59',141,0],
['業務通信','01:00～01:59',5453,35],
['その他','01:00～01:59',683,1],
['エラー','01:00～01:59',862,0],
['基幹装置','01:00～01:59',6228,30],
['業務通信','00:00～00:59',15001,449],
['その他','00:00～00:59',527,3],
['エラー','00:00～00:59',836,0],
['保守通信','00:00～00:59',28648,1419],
['基幹装置','00:00～00:59',3,0],
['業務通信','03:00～03:59',13,0],
['その他','03:00～03:59',396,0],
['エラー','03:00～03:59',362,0],
['保守通信','03:00～03:59',78,10],
['基幹装置','03:00～03:59',2473,32],
['顧客通信','03:00～03:59',2063,64],
['エラー','04:00～04:59',203,0],
['基幹装置','04:00～04:59',686,2],
['顧客通信','04:00～04:59',826,0],
['業務通信','11:00～11:59',1738,110],
['その他','11:00～11:59',12925,13],
['エラー','11:00～11:59',15413,0],
['その他','06:00～06:59',2166,2],
['エラー','06:00～06:59',86,0],
['保守通信','06:00～06:59',348,3],
['基幹装置','06:00～06:59',4244,18],
['顧客通信','06:00～06:59',1536,1],
['その他','07:00～07:59',351,0],
['基幹装置','07:00～07:59',405,1],
['その他','09:00～09:59',914,1],
['エラー','09:00～09:59',127,0],
['基幹装置','09:00～09:59',1470,7],
['顧客通信','09:00～09:59',516,1],
['業務通信','10:00～10:59',43,0],
['その他','10:00～10:59',667,1],
['エラー','10:00～10:59',172,0],
['保守通信','10:00～10:59',149,1],
['基幹装置','10:00～10:59',1380,5],
['顧客通信','10:00～10:59',791,23],
['その他','05:00～05:59',1,0],
['基幹装置','05:00～05:59',1,0],
['その他','12:00～12:59',1070,1],
['基幹装置','12:00～12:59',1171,2],
['顧客通信','12:00～12:59',33,0],
['保守通信','22:00～22:59',1,0],
['その他','14:00～14:59',407,0],
['エラー','14:00～14:59',3,0],
['基幹装置','14:00～14:59',457,2],
['顧客通信','14:00～14:59',20,0],
['その他','15:00～15:59',557,0],
['エラー','15:00～15:59',167,0],
['保守通信','15:00～15:59',95,1],
['基幹装置','15:00～15:59',1090,5],
['顧客通信','15:00～15:59',676,6],
['業務通信','16:00～16:59',1195,99],
['その他','16:00～16:59',350,3],
['エラー','16:00～16:59',212,0],
['基幹装置','16:00～16:59',1509,8],
['業務通信','17:00～17:59',3899,389],
['その他','17:00～17:59',147,0],
['エラー','17:00～17:59',455,0],
['保守通信','17:00～17:59',1,1],
['基幹装置','17:00～17:59',4100,16],
['業務通信','18:00～18:59',12,0],
['その他','18:00～18:59',634,2],
['エラー','18:00～18:59',749,0],
['保守通信','18:00～18:59',119,1],
['基幹装置','18:00～18:59',3705,19],
['顧客通信','18:00～18:59',3456,25],
['その他','19:00～19:59',828,2],
['エラー','19:00～19:59',288,0],
['保守通信','19:00～19:59',141,0],
['基幹装置','19:00～19:59',2625,7],
['顧客通信','19:00～19:59',1920,10],
['その他','20:00～20:59',1146,2],
['エラー','20:00～20:59',212,0],
['保守通信','20:00～20:59',223,4],
['基幹装置','20:00～20:59',1803,6],
['顧客通信','20:00～20:59',761,8],
['その他','21:00～21:59',527,0],
['エラー','21:00～21:59',90,0],
['基幹装置','21:00～21:59',930,4],
['顧客通信','21:00～21:59',395,1],
['業務通信','13:00～13:59',7232,58],
['その他','13:00～13:59',1272,0],
['エラー','13:00～13:59',1896,0],
['保守通信','13:00～13:59',1,0],
['基幹装置','13:00～13:59',10782,33],
['顧客通信','13:00～13:59',1911,3],
['その他','23:00～23:59',495,0],
['エラー','23:00～23:59',32,0],
['保守通信','23:00～23:59',7,0],
['基幹装置','23:00～23:59',1557,12],
['顧客通信','23:00～23:59',24,0],
['その他','23:00～23:59',460,1],
['保守通信','23:00～23:59',88,3],
['基幹装置','23:00～23:59',956,3],
['その他','15:00～15:59',232,0],
['エラー','15:00～15:59',71,0],
['基幹装置','15:00～15:59',575,2],
['顧客通信','15:00～15:59',368,3]
];
