/**
 * Created by Evan on 2017/5/6.
 */
var graph = new Springy.Graph();

jQuery(function(){
    var springy = window.springy = jQuery('#ncanvas').springy({
        graph: graph,
        nodeSelected: function(node){
            console.log('Node selected: ' + JSON.stringify(node.data));
            $("#nodetext").html("Content:" + node.data.label);
        }
    });
});

function calcColor(colors) {
    var total = 0;
    for (j in colors) {
        total += Number(j);
    }
    var colorPercentage = [colors[0] / total, colors[1] / total, colors[2] / total, colors[3] / total, colors[4] / total, colors[5] / total];
    var colorMixedR = (colorPercentage[0] + colorPercentage[1]) * 255;
    var colorMixedG = (colorPercentage[2] + colorPercentage[3]) * 255;
    var colorMixedB = (colorPercentage[4] + colorPercentage[5]) * 255;
    return "rgb(" + parseInt(colorMixedR) + "," + parseInt(colorMixedG) + "," + parseInt(colorMixedB) + ")";
}

var nodesGlobal = {};
var index = 2;
function getLive() {
    if(index > 109){
        return;
    }
    $.get("comment/getdata?time=" + index, function (data) {
        if (data === undefined) {
            alert("Error");
            return;
        }
        for (var property in nodesGlobal) {
            if (nodesGlobal.hasOwnProperty(property)) {
                graph.removeNode(nodesGlobal[property]);
            }
        }
        nodesGlobal = {};
        console.log(data);
        var json = JSON.parse(data);
        // console.log(json);
        var nodes = json.nodes;
        var relationships = json.relationship;
        console.log(json);
        for (var i = 0; i < nodes.length; i++) {
            var node_color = calcColor(nodes[i].color);
            var node = graph.newNode({
                label: nodes[i].name,
                id: nodes[i].id,
                size: nodes[i].size,
                color: node_color
            });
            // console.log(nodes[i]);

            nodesGlobal[nodes[i].id] = node;
        }
        for (var j = 0; j < relationships.length; j++) {
            var rel = relationships[j];
            graph.newEdge(nodesGlobal[rel.id_1], nodesGlobal[rel.id_2], {color: '#EB6841'});
        }
        index ++;
    });
}
getLive();
setInterval(function() {
    getLive();
}, 1000);