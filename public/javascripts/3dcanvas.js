/**
 * Created by Evan on 2017/5/6.
 */
// Our Javascript will go here.

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

var SCREEN_WIDTH = window.innerWidth,
    SCREEN_HEIGHT = window.innerHeight,
    mouseX = 0, mouseY = 0,
    windowHalfX = window.innerWidth / 2,
    windowHalfY = window.innerHeight / 2,
    SEPARATION = 200,
    AMOUNTX = 10,
    AMOUNTY = 10,
    camera, scene, renderer;
init();
animate();
function textSprite(text, _color, params) {
    var font = "Helvetica",
        size = 10,
        color = _color;

    font = "bold " + size + "px " + font;

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.font = font;

    // get size data (height depends only on font size)
    var metrics = context.measureText(text),
        textWidth = metrics.width;

    canvas.width = textWidth + 3;
    canvas.height = size + 3;

    context.font = font;
    context.fillStyle = color;
    context.fillText(text, 0, size + 3);

    // canvas contents will be used for a texture
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    var mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(canvas.width, canvas.height),
        new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide
        }));

    console.log(canvas.width + 'x' + canvas.height);
    console.log(texture);
    console.log(mesh);

    return mesh;
}
function init() {
    var container, separation = 100, amountX = 50, amountY = 50,
        particles, particle, text;
    container = document.createElement('div');
    document.body.appendChild(container);
    camera = new THREE.PerspectiveCamera(75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000);
    camera.position.z = 1000;
    // EditorControls(THREE);
    const controls = new THREE.EditorControls(camera, container);
    scene = new THREE.Scene();
    renderer = new THREE.CanvasRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    container.appendChild(renderer.domElement);
    // particles
    var PI2 = Math.PI * 2;
    var material = new THREE.SpriteCanvasMaterial({
        color: 0xffffff,
        program: function (context) {
            context.beginPath();
            context.arc(0, 0, 0.5, 0, PI2, true);
            context.fill();
        }
    });
    for (var i = 0; i < 1000; i++) {
        // particle = new THREE.Sprite( material );
        text = textSprite("LIKE", "#00FF00", {});
        text.position.x = Math.random() * 2 - 1;
        text.position.y = Math.random() * 2 - 1;
        text.position.z = Math.random() * 2 - 1;
        text.position.normalize();
        text.position.multiplyScalar(Math.random() * 10 + 450);
        text.scale.multiplyScalar(2);
        scene.add(text);
    }
    for (var i = 0; i < 1000; i++) {
        particle = new THREE.Sprite(material);
        particle.position.x = Math.random() * 2 - 1;
        particle.position.y = Math.random() * 2 - 1;
        particle.position.z = Math.random() * 2 - 1;
        particle.position.normalize();
        particle.position.multiplyScalar(Math.random() * 10 + 450);
        particle.scale.multiplyScalar(2);
        scene.add(particle);
    }
    // lines
    for (var i = 0; i < 300; i++) {
        var geometry = new THREE.Geometry();
        var vertex = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
        vertex.normalize();
        vertex.multiplyScalar(450);
        geometry.vertices.push(vertex);
        var vertex2 = vertex.clone();
        vertex2.multiplyScalar(Math.random() * 0.3 + 1);
        geometry.vertices.push(vertex2);
        var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: 0xffffff, opacity: Math.random()}));
        scene.add(line);
    }
}
    // document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    // document.addEventListener( 'touchstart', onDocumentTouchStart, false );
    // document.addEventListener( 'touchmove', onDocumentTouchMove, false );
    //
//     window.addEventListener( 'resize', onWindowResize, false );
// }
// function onWindowResize() {
//     windowHalfX = window.innerWidth / 2;
//     windowHalfY = window.innerHeight / 2;
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize( window.innerWidth, window.innerHeight );
// }
//
// function onDocumentMouseMove(event) {
//     mouseX = event.clientX - windowHalfX;
//     mouseY = event.clientY - windowHalfY;
// }
// function onDocumentTouchStart( event ) {
//     if ( event.touches.length > 1 ) {
//         event.preventDefault();
//         mouseX = event.touches[ 0 ].pageX - windowHalfX;
//         mouseY = event.touches[ 0 ].pageY - windowHalfY;
//     }
// }
// function onDocumentTouchMove( event ) {
//     if ( event.touches.length == 1 ) {
//         event.preventDefault();
//         mouseX = event.touches[ 0 ].pageX - windowHalfX;
//         mouseY = event.touches[ 0 ].pageY - windowHalfY;
//     }
// }
//
function animate() {
    requestAnimationFrame( animate );
    render();
}
function render() {
    // camera.position.x += ( mouseX - camera.position.x ) * .05;
    // camera.position.y += ( - mouseY + 200 - camera.position.y ) * .05;
    camera.lookAt( new THREE.Vector3(0,0,0) );
    renderer.render( scene, camera );
}
