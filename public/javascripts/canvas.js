/**
 * Created by Evan on 2017/5/6.
 */
var graph = new Springy.Graph();

var dennis = graph.newNode({
    label: 'Dennis',
    ondoubleclick: function() { console.log("Hello!"); },
    size: 25,
    color: 'rgb(255,255,0)'});
var michael = graph.newNode({label: 'Michael',
    size: 25,
    color: 'rgb(255,255,0)'});
var jessica = graph.newNode({label: 'Jessica',
    size: 40,
    color: 'rgb(255,255,0)'});
var timothy = graph.newNode({label: 'Timothy',
    size: 55,
    color: 'rgb(255,255,0)'});
var barbara = graph.newNode({label: 'Barbara', color: 'rgb(255,255,0)'});
var franklin = graph.newNode({label: 'Franklin', color: 'rgb(255,255,0)'});
var monty = graph.newNode({label: 'Monty', color: 'rgb(255,255,0)'});
var james = graph.newNode({label: 'James', color: 'rgb(255,255,0)'});
var bianca = graph.newNode({label: 'Bianca', color: 'rgb(255,255,0)'});

var nodes = [];
nodes.push(dennis);
nodes.push(michael);
nodes.push(jessica);
nodes.push(barbara);

graph.newEdge(dennis, michael, {color: '#00A0B0'});
graph.newEdge(michael, dennis, {color: '#6A4A3C'});
graph.newEdge(michael, jessica, {color: '#CC333F'});
graph.newEdge(jessica, barbara, {color: '#EB6841'});
graph.newEdge(michael, timothy, {color: '#EDC951'});
graph.newEdge(franklin, monty, {color: '#7DBE3C'});
graph.newEdge(dennis, monty, {color: '#000000'});
graph.newEdge(monty, james, {color: '#00A0B0'});
graph.newEdge(barbara, timothy, {color: '#6A4A3C'});
graph.newEdge(dennis, bianca, {color: '#CC333F'});
graph.newEdge(bianca, monty, {color: '#EB6841'});

jQuery(function(){
    var springy = window.springy = jQuery('#ncanvas').springy({
        graph: graph,
        nodeSelected: function(node){
            console.log('Node selected: ' + JSON.stringify(node.data));
        }
    });
});
for (var i = 0; i < nodes.length; i++) {
    calcColor(nodes[i], [5,5,0,2,3,1]);
}

function calcColor(node, colors){
    var total = 0;
    for(j in colors){
        total += Number(j);
    }

    var colorPercentage = [colors[0]/total,colors[1]/total,colors[2]/total,colors[3]/total,colors[4]/total,colors[5]/total];

    var colorMixedR = (colorPercentage[0] + colorPercentage[1])*255;
    var colorMixedG = (colorPercentage[2] + colorPercentage[3])*255;
    var colorMixedB = (colorPercentage[4] + colorPercentage[5])*255;
    node.data.color = "rgb("+ colorMixedR +","+ colorMixedG +","+ colorMixedB +")";
}