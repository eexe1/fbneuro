/**
 * Created by Evan on 2017/5/6.
 */
// Our Javascript will go here.
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

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
$.get( "comment/test2", function( data ) {
    if(data === undefined){
        alert("Error");
        return;
    }
    var json = JSON.parse(data);
    // console.log(json);
    var nodes = json.nodes;
    var relationships = json.relationship;
    for (var i = 0; i < nodes.length; i++) {
        var node_color = calcColor(nodes[i].color);
        // var node = graph.newNode({
        //     label: nodes[i].name,
        //     id: nodes[i].id,
        //     size: nodes[i].size,
        //     color: node_color});
        // console.log(nodes[i]);

        // nodesGlobal[nodes[i].id] = node;
    }
    for (var j = 0; j < relationships.length; j++) {
        var rel =  relationships[j];
    }
});

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;


function render() {
    requestAnimationFrame( render );
    renderer.render( scene, camera );
}
render();