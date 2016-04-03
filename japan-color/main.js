//# require=d3,jquery,topojson
/**
 * Created by yuuu on 14/12/22.
 */
var width = root.clientWidth;
var height = root.clientHeight;
var selectedLabel = 'セブンイレブン';

var svg = d3.select("#e2d3-chart-area").append("svg")
  .attr("width", width)
  .attr("height", height);

var projection = d3.geo.mercator()
  .center([136, 35])
  .scale(Math.min(width, height) * 2.0)
  .translate([width / 2, height / 2]);

var path = d3.geo.path()
  .projection(projection);
var tooltip = d3.select("body")
  .append("div")
  .style("position", "absolute")
  .style("visibility", "hidden")
  .attr("class", "chart-tooltip");

var topo = {};
var colorButtons = $('<div>').attr('id', 'chart-color-selector');
var buttonBrue = $('<button>').addClass('btn red chart-color-selector-button').attr({
  'data-color-min': '#FEFFD1',
  'data-color-max': '#FF0000'
});
var buttonRed = $('<button>').addClass('btn blue chart-color-selector-button').attr({
  'data-color-min': '#C9FDFF',
  'data-color-max': '#0000FF'
});
var buttonMix = $('<button>').addClass('btn multi chart-color-selector-button').attr({
  'data-color-min': '#0000FF',
  'data-color-max': '#FF0000'
});

$(colorButtons).append([buttonBrue, buttonRed, buttonMix]);
$('#e2d3-chart-area').append(colorButtons);

d3.json(baseUrl + "/japan.topojson", function(error, o) {
  svg.selectAll(".states")
    .data(topojson.feature(o, o.objects.japan).features)
    .enter().append("path")
    .attr("stroke", "gray")
    .attr("stroke-width", "0.5")
    .attr("id", function(d) {
      return "state_" + d.properties.id;
    })
    .attr("class", 'states')
    .attr("fill", "#fff")
    .attr("d", path);
  topo = o;

  reload();
});

function update(data) {
  show(data.toMap({ typed: true }));
}

function show(data) {
  console.log('show');
  if (data && topo.objects) {
    //max and slider labels
    var labels = data.header;
    var values = []; // all of data;
    data.keys.forEach(function(d) {
      labels.forEach(function(dd, i) {
        if(dd){
          var v = data[d][dd];
          values.push(v);
        }else{
          labels.splice(i, 1);
        }
      });
    });
    //slider
    var isSelected = false;
    var hasActive = false;
    $('.chart-label').each(function() {
      if($(this).attr('data-chart-label') == selectedLabel) isSelected = true;
    });
    //color
    var colorSelector = $('.chart-color-selector-button');
    var selectedColor = '';
    $(colorSelector).each(function() {
      if ($(this).hasClass('active')) {
        selectedColor = this;
      }
    });
    if (!selectedColor) {
      selectedColor = colorSelector[0];
      $(colorSelector[0]).addClass('active');
    }

    if (!isSelected) {
      selectedLabel = labels[0];
    }
    makeLabels(labels, selectedLabel);

    svg.selectAll(".states")
      .data(topojson.feature(topo, topo.objects.japan).features)
      .on('mouseover', function() {
        return tooltip.style("visibility", "visible");
      })
      .on('mousemove', function(d) {
        var inner = '';
        var noValue = true;
        labels.forEach(function(label, i) {
          var isActive = (label != selectedLabel) ? '' : 'active';

          inner += '<dt class="' + isActive + '">' + label + '</dt><dd class="' + isActive + '">';
          if (data[d.properties.nam_ja] && data[d.properties.nam_ja][label]) {
            inner += data[d.properties.nam_ja][label];
            noValue = false;
          } else {
            inner += '0';
          }
          inner += '</dd>';
        })
        if (!noValue) {
          return tooltip
            .style("top", (d3.event.pageY - 10) + "px")
            .style("left", (d3.event.pageX + 10) + "px")
            .html('<h4>' + d.properties.nam_ja + '</h4><dl class="dl-horizontal">' + inner);
        }
      })
      .on('mouseout', function() {
        return tooltip.style("visibility", "hidden");
      })
      .transition()
      .attr("fill", function(d) {
        return (data[d.properties.nam_ja] && data[d.properties.nam_ja][selectedLabel] && !isNaN(+data[d.properties.nam_ja][selectedLabel])) ? color(data[d.properties.nam_ja][selectedLabel], values, selectedColor) : "#ffffff";
      });
    //onchange label
    $(document).on('click', '.chart-label', function() {
      $('.chart-label').removeClass('active');
      $(this).addClass('active');

      selectedLabel = $(this).attr('data-chart-label');
      console.log('label change : ' + selectedLabel);
      svg.selectAll(".states")
        .data(topojson.feature(topo, topo.objects.japan).features)
        .on('mouseover', function() {
          return tooltip.style("visibility", "visible");
        })
        .on('mousemove', function(d) {
          var inner = '';
          var noValue = true;
          labels.forEach(function(label, i) {
            var isActive = (label != selectedLabel) ? '' : 'active';

            inner += '<dl class="dl-horizontal"><dt class="' + isActive + '">' + label + '</dt><dd class="' + isActive + '">';
            if (data[d.properties.nam_ja] && data[d.properties.nam_ja][label]) {
              inner += data[d.properties.nam_ja][label];
              noValue = false;
            } else {
              inner += '0';
            }
            inner += '</dd>';
          })
          if (!noValue) {
            return tooltip
              .style("top", (d3.event.pageY - 10) + "px")
              .style("left", (d3.event.pageX + 10) + "px")
              .html('<h4>' + d.properties.nam_ja + '</h4><dl class="dl-horizontal">' + inner);
          }
        })
        .on('mouseout', function() {
          return tooltip.style("visibility", "hidden");
        })
        .transition()
        .attr("fill", function(d) {
          return (data[d.properties.nam_ja] && data[d.properties.nam_ja][selectedLabel] && !isNaN(+data[d.properties.nam_ja][selectedLabel])) ? color(data[d.properties.nam_ja][selectedLabel], values, selectedColor) : "#ffffff";
        });
    });
    //change color
    $(document).on('click', '.chart-color-selector-button', function() {
      $('.chart-color-selector-button').removeClass('active');
      $(this).addClass('active');
      console.log('color change : ');
      selectedColor = this;

      svg.selectAll(".states")
        .data(topojson.feature(topo, topo.objects.japan).features)
        .transition()
        .attr("fill", function(d) {
          return (data[d.properties.nam_ja] && data[d.properties.nam_ja][selectedLabel] && !isNaN(+data[d.properties.nam_ja][selectedLabel])) ? color(data[d.properties.nam_ja][selectedLabel], values, selectedColor) : "#ffffff"
        });
    });
  }
}

function makeLabels(labels, value) {
  $('#chart-labels').remove();
  var box = $('<div>').attr('id', 'chart-labels');
  $(labels).each(function() {
    var label = $('<label>').addClass('chart-label').attr('data-chart-label', this).html(this);
    if (value == this) {
      $(label).addClass('active');
    }
    $(box).append(label);
  });

  if (labels) {
    $('#e2d3-chart-area').append(box).hide().fadeIn();
  }
}

function color(d, values, selector) {
  if (!selector) {
    var colorSelector = $('.chart-color-selector-button');
    selector = colorSelector[0];
  }
  var min = d3.min(values);
  var max = d3.max(values);
  var c;
  if (!$(selector).hasClass('multi')) {
    c = d3.scale.linear()
      .domain([min, max])
      .range([$(selector).attr('data-color-min'), $(selector).attr('data-color-max')])
      .interpolate(d3.interpolateLab);
  } else {
    c = d3.scale.linear()
      .domain([min, Math.floor((max - min) * 0.5), max])
      .range([$(selector).attr('data-color-min'), '#FEFCEA', $(selector).attr('data-color-max')])
      .interpolate(d3.interpolateLab);
  }

  return c(d);
}
