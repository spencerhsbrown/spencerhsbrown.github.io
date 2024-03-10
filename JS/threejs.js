import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x913f39 } );
const scenecolor = new THREE.Color( 0x918b8a );
material.wireframe = false;

const floooor = new THREE.PlaneGeometry( 1, 1 );
const floormesh = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( floooor, floormesh );
const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light

const cube = new THREE.Mesh( geometry, material );

scene.background = scenecolor;
scene.add( cube );
scene.add( plane );

camera.position.z = 5;  

const controls = new PointerLockControls( camera, renderer.domElement );
document.addEventListener('click', () => controls.lock(), false); // Lock pointer on canvas click
document.addEventListener('keydown', onKeyDown, false);
document.addEventListener('keyup', onKeyUp, false);

import WebGL from 'three/addons/capabilities/WebGL.js';

if ( WebGL.isWebGLAvailable() ) {

	// Initiate function or other initializations here
	animate();

} else {

	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

}

// Event listener for keyup
document.addEventListener('keyup', (event) => {
    delete keysPressed[event.key]; // Remove the key from the tracking object
});


function onKeyDown(event) {
    switch (event.code) {
        case 'KeyW':
            moveForward = true;
            break;
        case 'KeyS':
            moveBackward = true;
            break;
        case 'KeyA':
            moveLeft = true;
            break;
        case 'KeyD':
            moveRight = true;
            break;
    }
}

function onKeyUp(event) {
    switch (event.code) {
        case 'KeyW':
            moveForward = false;
            break;
        case 'KeyS':
            moveBackward = false;
            break;
        case 'KeyA':
            moveLeft = false;
            break;
        case 'KeyD':
            moveRight = false;
            break;
    }
}


function animate() {

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    plane.position.x = 3;

    const moveSpeed = 0.4; // Adjust the speed as needed

    if (moveForward) {
        controls.getObject().translateZ(-moveSpeed);
    }
    if (moveBackward) {
        controls.getObject().translateZ(moveSpeed);
    }
    if (moveLeft) {
        controls.getObject().translateX(-moveSpeed);
    }
    if (moveRight) {
        controls.getObject().translateX(moveSpeed);
    }

	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
controls.update();
animate();