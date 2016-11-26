C3.js Charts
====
折れ線グラフ、曲線グラフ、階段状グラフ、棒グラフの切り替えが可能なグラフです。  
左上のプルダウンメニューからグラフ形式を変更します。  
下記のライブラリを用いて作成しています。  

C3.js Line Chart  
<http://c3js.org/samples/simple_multiple.html>  
C3.js Spline Chart  
<http://c3js.org/samples/chart_spline.html>  
C3.js Step Chart  
<http://c3js.org/samples/chart_step.html>  
C3.js Area Chart  
<http://c3js.org/samples/chart_area.html>  
C3.js Bar Chart  
<http://c3js.org/samples/chart_bar.html>  



## Data Format  
| Data Label 1 | Data 11 | Data 12 | ... | Data 1n |  
|:-------------|:--------|:--------|:----|:--------|  
| Data Label 2 | Data 21 | Data 22 | ... | Data 2n |  
| Data Label 3 | Data 31 | Data 31 | ... | Data 3n |  
| ...          | ...     | ...     | ... | ...     |  
| Data Label m | Data m1 | Data m2 | ... | Data mn |  
  
1列目の"Data Label"はデータの系列名になります。  
2列目以降の"Data"は数値データを前提としています。  
グラフの横軸は自動的に 1, 2, ..., n の連番になります。  
