import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.SphereGeometry(2, 32, 16);;
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const scenecolor = new THREE.Color(0x33e0ff);

const directionalLight = new THREE.directionalLight(0x404040, 0.5); // Soft white light

scene.add(directionalLight);
scene.background = scenecolor;

camera.position.z = 5; 

function animate() {



	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();