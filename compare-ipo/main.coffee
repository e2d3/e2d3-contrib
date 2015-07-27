## require=d3,e2d3model

unit = 'JPY'
selected = null
valueheaders = []
logscale = false
duration = 2000
ease = 'cubic-in-out'
first = true

powerOfTen = (d) -> d / Math.pow(10, Math.ceil(Math.log(d) / Math.LN10 - 1e-12)) == 1

xvalue = (d) -> d
yvalue = (d) -> d / 1000000000
rvalue = (d) -> Math.exp(Math.log(d) / Math.LN10)

margin = top: 80, right: 30, bottom: 30, left: 40
width = root.clientWidth - margin.left - margin.right
height = root.clientHeight - margin.top - margin.bottom

x = d3.time.scale().range([0, width])
y = d3.scale.linear().range([height, 0])
r = d3.scale.linear().range([1, 40])
color = d3.scale.linear().range(['#D30B14', '#014175'])

xAxis = d3.svg.axis().scale(x).orient('bottom')
yAxis = d3.svg.axis().scale(y).orient('left').tickFormat (d) ->
  if !logscale || powerOfTen(d) then (d3.format(',d'))(d) else ''

svg = d3.select(root).append('svg')
  .attr
    width: root.clientWidth
    height: root.clientHeight
  .append('g')
  .attr
    transform: "translate(#{margin.left}, #{margin.top})"

createDetailWindow = () ->
  w = d3.select(root).append('div').attr(class: 'detail-window')
  w.append('div').attr(class: 'detail-heading').text('header')
  w.append('div').attr(class: 'detail-body').text('body')

showDetailWindow = (d) ->
  w = d3.select(root).select('.detail-window')
  w.select('.detail-heading').html(detailHeading(d))
  w.select('.detail-body').html(detailBody(d))

  pos =
    x:
      if x(xvalue(d.date)) < width / 2
        margin.left + x(xvalue(d.date)) + r(rvalue(d[selected])) + 10
      else
        margin.left + x(xvalue(d.date)) - r(rvalue(d[selected])) - 10 - w.node().offsetWidth
    y:
      margin.top + y(yvalue(d[selected])) - (w.node().offsetHeight / 2)

  if pos.y + w.node().offsetHeight > margin.top + height
    pos.y = margin.top + height - w.node().offsetHeight

  w.style
    left: pos.x + 'px'
    top: pos.y + 'px'
    display: 'block'

hideDetailWindow = (d) ->
  w = d3.select(root).select('.detail-window')
  w.style
    left: '-1000px'
    top: '-1000px'

detailHeading = (d) ->
  v = d[valueheaders[0]] / 1000000000
  html = "<span class=\"date\">#{d3.time.format('%Y-%m-%d')(d.date)}</span>"
  html += "<br /><b>#{d.name}</b>"
  html += "<br />#{d.category}"
  html += "<br />value at I.P.O. #{(d3.format(',.0f'))(v)} billions #{unit}"

detailBody = (d) ->
  base = d[valueheaders[0]]
  html = '<table><tr>'
  for i in [1...valueheaders.length]
    v = d[valueheaders[i]] / base - 1.0
    c = if v < 0 then 'negative' else if v > 0 then 'positive' else 'even'
    html += "<td class=\"#{c}\">#{(d3.format('+.1%'))(v)}</td>"
  html += '</tr><tr>'
  html += "<td>#{valueheaders[i]}</td>" for i in [1...valueheaders.length]
  html += '</tr></table>'
  html

createSelectionWindow = () ->
  w = d3.select(root).append('div').attr(class: 'selection-window')

updateSelectionWindow = (selections) ->
  w = d3.select(root).select('.selection-window')
  w.selectAll('.selection').remove()

  w.selectAll('.selection')
    .data(selections)
    .enter().append('a')
    .classed
      selection: true
      selected: (d, i) -> selected == d && logscale
    .attr
      href: '#'
    .on 'click', (d, i) ->
      selectData(i, true)
      d3.event.preventDefault()
    .text (d) -> d

  w.insert('a', ':first-child')
    .classed
      selection: true
      selected: () -> selected == selections[0] && !logscale
    .attr
      href: '#'
    .on 'click', (d, i) ->
      selectData(0, false)
      d3.event.preventDefault()
    .text selections[0] + ' (normal scale)'

selectData = (i, l) ->
  selected = valueheaders[i]
  logscale = l
  if logscale
    y = d3.scale.log().base(10).range([height, 0])
  else
    y = d3.scale.linear().range([height, 0])
  yAxis.scale(y)
  reload()

createDetailWindow()
createSelectionWindow()

update = (data) ->
  data = new e2d3model.ChartDataTable(data.filter(
    (d) -> d[3] != 'NULL' && d[4] != 'NULL' && d[5] != 'NULL'
  ))

  targets = data.toList
    typed: true

  valueheaders = targets.header.filter (h) -> h != 'date' && h != 'name' && h != 'category'

  if !~valueheaders.indexOf(selected)
    selectData(0, true)

  updateSelectionWindow(valueheaders)

  max = d3.max(targets, (d) -> d3.max(valueheaders, (h) -> d[h]))

  x.domain(d3.extent(targets, (d) -> xvalue(d.date)))
  y.domain([1, yvalue(max)])
  r.domain([1, rvalue(max)])
  color.domain(x.domain())

  if first
    y.domain([1, yvalue(max) / 1000])

  setupXAxis = (selection) ->
    selection
      .attr
        class: 'x axis'
        transform: "translate(0,#{height})"
      .call(xAxis)

  setupYAxis = (selection) ->
    selection
      .attr
        class: 'y axis'
      .call(yAxis)

  if svg.select('.x').empty()
    svg.append('g').call(setupXAxis)
  else
    svg.select('.y').transition().duration(duration).ease(ease).call(setupXAxis)

  if svg.select('.y').empty()
    svg.append('g').call(setupYAxis)
      .append('text')
      .style('text-anchor', 'end')
      .attr y: '6px', dy: '.71em', transform: 'rotate(-90)'
      .text("In billions of #{unit}")
  else
    svg.select('.y').transition().duration(duration).ease(ease).call(setupYAxis).each('end', onready)

  plot = svg.selectAll('.target')
    .data(targets)

  setupPlot = (selection) ->
    selection
      .attr
        class: 'target'
        r: (d) -> r(rvalue(d[selected]))
        cx: (d) -> x(xvalue(d.date))
        cy: (d) -> y(yvalue(d[selected]))
        fill: (d) -> color(xvalue(d.date))
        'fill-opacity': 0.7
        stroke: 'black'
        'stroke-width': 0

  plot.transition().duration(duration).ease(ease).call(setupPlot)

  enter = plot.enter().append('circle').call(setupPlot)
    .on 'mouseover', (d) ->
      d3.select(this)
        .attr
          'stroke-width': 3
      showDetailWindow d
    .on 'mouseout', (d) ->
      d3.select(this)
        .attr
          'stroke-width': 0
      hideDetailWindow d

  if !first
    enter
      .attr
        r: 0
      .transition().duration(duration).ease(ease)
      .attr
        r: (d) -> r(rvalue(d[selected]))

  plot.exit()
    .transition().duration(duration).ease(ease)
    .attr
      r: 0
    .remove()

  if first
    first = false
    reload()

  return false
