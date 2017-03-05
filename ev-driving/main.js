//# require=d3,leaflet

function update(data) {
    tick = null;
    show(data.toList({typed: false}));
}

/**
 * Created by osoken on 2016/05/16.
 */

/**
 * Extends by Daiki Kawanuma on 2017/03/04.
 */

// map handler
!(function (d3, L) {
    var map = {};
    var zoom = 13;
    var mapLayer = null;
    var svgLayer = null;
    var plotLayer = null;
    var selection = null;
    var margin = 100;

    map.init = function (s) {

        selection = s;
        selection.style('height', root.clientHeight + 'px');
        selection.style('width', root.clientWidth + 'px');
        var point = [35.44907404 ,139.42086556];
        mapLayer = L.map(selection.attr('id')).setView(point, zoom);

        var tileLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapLayer);

        svgLayer = d3.select(mapLayer.getPanes().overlayPane).append("svg");

        plotLayer = svgLayer.append('g');
        timeLayer = svgLayer.append('g');
        mapLayer.on("viewreset", map.reset);
        d3.rebind(map, mapLayer, 'on');
        map.reset();
    }

    map.projectPoint = function (lat, lng) {
        if (lng === void 0) {
            return mapLayer.latLngToLayerPoint(lat);
        }
        return mapLayer.latLngToLayerPoint(new L.LatLng(lat, lng));
    }
    map.invertPoint = function (x, y) {
        if (y === void 0) {
            return mapLayer.layerPointToLatLng(x);
        }
        return mapLayer.layerPointToLatLng(new L.point(x, y));
    }
    map.getBounds = function () {
        return mapLayer.getBounds();
    }
    map.svg = function () {
        return svgLayer;
    }
    map.plotLayer = function () {
        return plotLayer;
    }
    map.timeLayer = function () {
        return timeLayer;
    }
    map.bound = function () {
        var bounds = plotLayer.node().getBBox();

        return {
            x: bounds.x - margin,
            y: bounds.y - margin,
            width: bounds.width + 2 * margin,
            height: bounds.height + 2 * margin
        };
    }
    map.reset = function () {
        var bounds = map.getBounds();
        var topLeft = map.projectPoint(bounds.getNorthWest());
        var bottomRight = map.projectPoint(bounds.getSouthEast());

        svgLayer.attr("width", bottomRight.x - topLeft.x)
            .attr("height", bottomRight.y - topLeft.y)
            .style("left", topLeft.x + "px")
            .style("top", topLeft.y + "px");
        timeLayer.selectAll('line').attr('opacity', function (d) {
            return (bounds.getWest() <= d.longitude && d.longitude <= bounds.getEast() &&
            bounds.getSouth() <= d.latitude && d.latitude <= bounds.getNorth()) ? 1.0 : 0.08;
        });
        plotLayer.attr('transform', 'translate(' + -topLeft.x + ',' + -topLeft.y + ')');
    }
    this.map = map;
}(d3, L));

map.init(d3.select(root).append('div').attr('id', 'map-container'))
var tick = null;

function show(data) {
    if (data.length == 0) {
        return;
    }

    var width = root.clientWidth;
    var height = root.clientHeight;

    var margin = {left: 20, bottom: 60, top: 0, right: 20};
    var padding = {left: 10, bottom: 20, top: 10, right: 10};

    var panelHeight = 60;
    var panelWidth = width - margin.left - margin.right;
    var graphHeight = panelHeight - padding.left - padding.right;
    var graphWidth = panelWidth - padding.top - padding.bottom;

    var timeFormat = d3.time.format('%Y-%m-%dT%H:%M:%S');
    var timeDispFormat = d3.time.format('%H:%M:%S');

    var colored = function (gids) {

        console.log((gids / 282) * 240);

        return d3.hsl((gids / 282) * 240, 1.0, 0.5);
    }

    var timeScale = d3.time.scale();
    var graphXScale = d3.time.scale().range([0, graphWidth]);
    var graphYScale = d3.scale.linear().range([0, graphHeight]);

    var drag = d3.behavior.drag();

    var getMouseX = function (event) {
        if (event.offsetX != null) {
            getMouseX = function (event) {
                return event.offsetX;
            };
            return event.offsetX;
        }
        if (event.layerX != null) {
            getMouseX = function (event) {
                return event.layerX;
            };
            return event.layerX;
        }
        getMouseX = function (event) {
            return event.x;
        }
        return event.x;
    }

    drag.on('dragstart', function () {
        d3.event.sourceEvent.stopPropagation();
    }).on('dragend', function () {
        d3.event.sourceEvent.stopPropagation();
    }).on('drag', function () {
        d3.event.sourceEvent.stopPropagation();
    });

    var tick = null;

    data.forEach(function (d) {
        d.time = timeFormat.parse(d.time);
        d.latitude = +d.latitude;
        d.longitude = +d.longitude;
        d.color = colored(d['gids']);
    });

    timeScale.domain(d3.extent(data, function (d) {
        return d.time;
    }));
    graphXScale.domain(d3.extent(data, function (d) {
        return d.time;
    }));
    graphYScale.domain([0, 1]);

    var svgLayer = map.svg();
    var plotLayer = map.plotLayer();
    var timeLayer = map.timeLayer().attr('transform', 'translate(' + margin.left + ',' + (height - margin.bottom - panelHeight) + ')');

    var showAll = null;

    var startAnim = function (t0, dt) {
        if (showAll != null) {
            clearTimeout(showAll);
            showAll = null;
        }
        if (tick != null) {
            tick = null;
        }
        plotLayer.selectAll('circle').transition().duration(0).attr('opacity', 0.0);
        var t1 = timeScale.domain()[1];
        var tc = t0;
        textLabel.text(timeDispFormat(tc))
            .transition().duration(0)
            .attr({'opacity': 0.8});
        indicator.transition().duration(0).attr('opacity', 0.8);
        var lastTime = new Date().getTime();
        tick = function () {
            if (t1 < tc) {
                tick = null;
                if (showAll != null) {
                    clearTimeout(showAll);
                    showAll = null;
                }
                showAll = setTimeout(function () {
                    textLabel.transition().duration(0).attr('opasity', 0.0).text('');
                    plotLayer.selectAll('circle').transition().duration(2000)
                        .attr('opacity', 0.8);
                    showAll = null;
                    indicator.transition().attr('opacity', 0.0);
                }, 2000);
                return;
            }
            indicator.moveTo(tc);
            textLabel.text(timeDispFormat(tc));
            var currentTime = new Date().getTime();
            delta = (currentTime - lastTime) * dt;
            plotLayer.selectAll('circle').filter(function (d) {
                return tc < d.time && (new Date(tc.getTime() + delta) >= d.time);
            }).attr('opacity', 0.8).transition().delay(1000).attr('opacity', 0.0);
            tc = new Date(tc.getTime() + delta);
            lastTime = currentTime;
            setTimeout(tick, 10);
        }
        tick();
    };

    timeLayer.selectAll('rect').remove();
    timeLayer.append('rect').attr({x: 0, y: 0, width: panelWidth, height: panelHeight})
        .style({fill: 'rgba(255,255,255,0.2)'});
    var textLabel = timeLayer.append('text')
        .attr({
            x: 0,
            y: -8,
            'text-anchor': 'start',
            'font-size': 64,
            'opacity': 0.0,
            fill: '#000',
            stroke: 'none'
        }).text('');
    timeLayer.selectAll('g').remove();
    var graphLayer = timeLayer.append('g')
        .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')');
    graphLayer.selectAll('line')
        .data(data).enter().append('line')
        .style({
            stroke: function (d) {
                return d.color;
            }, fill: 'none', 'stroke-width': 1
        })
        .attr({
            x1: function (d) {
                return graphXScale(d.time);
            },
            x2: function (d) {
                return graphXScale(d.time);
            },
            y1: graphHeight,
            y2: function (d) {
                return 0;
            },
            opacity: 0.4
        });
    var indicator = graphLayer.append('rect')
        .attr({
            x: -4,
            y: -8,
            width: 8,
            height: graphHeight + 16,
            fill: 'none',
            stroke: '#333',
            'stroke-width': 3,
            opacity: 0.0
        });
    indicator.moveTo = function (t) {
        indicator.attr('x', graphXScale(t) - 8);
    };
    graphLayer.append('rect')
        .attr({
            x: -padding.left,
            y: -padding.top,
            width: panelWidth,
            height: panelHeight
        })
        .style({fill: 'rgba(0,0,0,0)', stroke: 'none'})
        .on('click', function () {
            d3.event.preventDefault();
            d3.event.stopPropagation();
            startAnim(graphXScale.invert(
                Math.min(
                    Math.max(
                        0,
                        getMouseX(d3.event) - margin.left - padding.left
                    ),
                    graphWidth
                )
            ), (timeScale.domain()[1].getTime() - timeScale.domain()[0].getTime()) / 80000);
        }).call(drag);

    var updatePosition = function (d) {
        d.pos = map.projectPoint(d.latitude, d.longitude);
        d3.select(this).attr({cx: d.pos.x, cy: d.pos.y});
    }

    var reset = function () {
        var bounds = map.getBounds();
        var topLeft = map.projectPoint(bounds.getNorthWest());
        var bottomRight = map.projectPoint(bounds.getSouthEast());

        svgLayer.attr("width", bottomRight.x - topLeft.x)
            .attr("height", bottomRight.y - topLeft.y)
            .style("left", topLeft.x + "px")
            .style("top", topLeft.y + "px");
        graphLayer.selectAll('line').attr('opacity', function (d) {
            return (bounds.getWest() <= d.longitude && d.longitude <= bounds.getEast() &&
            bounds.getSouth() <= d.latitude && d.latitude <= bounds.getNorth()) ? 0.4 : 0;
        });
        plotLayer.attr('transform', 'translate(' + -topLeft.x + ',' + -topLeft.y + ')');
        plotLayer.selectAll('circle').each(updatePosition);
    }

    plotLayer.selectAll('circle').remove();
    plotLayer.selectAll('circle').data(data).enter().append('circle')
        .attr({
            opacity: 0.75, r: 8, fill: function (d) {
                return d.color;
            }, stroke: 'rgba(255,255,255,0.1)', 'stroke-width': 3
        })
        .each(updatePosition);
    map.on('move', reset);
}