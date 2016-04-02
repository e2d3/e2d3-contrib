//# require=d3

var margin = { top: 20, right: 20, bottom: 20, left: 20 };
var w = root.clientWidth - margin.left - margin.right;
var h = root.clientHeight - margin.top - margin.bottom;

function select_nodes(data){
    var res = [];
    for(var i=1; i<data.length; i++){
        if(data[i][0]=="node"){
            res.push({id:parseInt(data[i][1]),label:data[i][2]});
        }
    }
    return res
}

function select_links(data){
    var res = [];
    for(var i=1; i<data.length; i++){
        console.log(data[i]);
        if(data[i][0]=="link"){
            res.push({source:parseInt(data[i][1]),target:parseInt(data[i][2])});
        }
    }
    return res
}

function update(data) {
    d3.select(root).selectAll('*').remove();

    nodes = select_nodes(data);
    links = select_links(data);

    // nodesの整形
    nodes.sort(function(a, b) {
        if (a.id < b.id) return -1;
        if (a.id > b.id) return 1;
        return 0;
    });
    console.log(nodes);

    // linksの整形
    var links2 = removeSorceLinks(links);
    var links3 = removeTargetLinks(links2);

    links = links3;

    var force = d3.layout.force()
        .nodes(nodes)
        .links(links)
        .size([w, h])
        .linkStrength(0.3)
        .friction(0.9)
        .linkDistance(100)
        .chargeDistance(-100)
        .charge(-1000)
        .gravity(0.05) /*0.1*/
        /*.theta(0.8)*/
        .alpha(0)
        .start();

    var svg = d3.select(root).append("svg").attr({width:w, height:h});

    var link = svg.selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .style({stroke: "#ccc",
            "stroke-width": 1});

    var node = svg.selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr({r:15,opacity:0.5})
        .style({fill:function(d,i){
            if (d.t == "p"){
                return "red" ;
            }else{
                return "green";
            }
        }})
        .call(force.drag);

    var label = svg.selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .attr({"text-ancher":"middle","fill":"black"})
        .style({"font-size":14})
        .text(function(d){return d.label})
        .call(force.drag);

    force.on("tick", function() {
        link.attr({x1: function(d) { return d.source.x; },
            y1: function(d) { return d.source.y; },
            x2: function(d) { return d.target.x; },
            y2: function(d) { return d.target.y; }});
        node.attr({cx: function(d) { return d.x; },
            cy: function(d) { return d.y; }});
        label.attr({x:function(d){return d.x-7;},
            y: function(d){return d.y+7;}});
    });
}

function removeSorceLinks(links) {
    var newLinks = [];
    for (var i = 0; i < links.length; i++) {
        for (var n = 0; n < nodes.length; n++) {
            if (nodes[n].id == links[i].source) {
                newLinks.push({source: links[i].source, target: links[i].target});
                break;
            }
        }
    }
    return newLinks;
}

function removeTargetLinks(links) {
    var newLinks = [];
    for (var i = 0; i < links.length; i++) {
        for (var n = 0; n < nodes.length; n++) {
            if (nodes[n].id == links[i].target) {
                newLinks.push({source: links[i].source, target: links[i].target});
                break;
            }
        }
    }
    return newLinks;
}