import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;


renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const scenecolor = new THREE.Color(0xFFFFFF);

const light = new THREE.DirectionalLight(0xFFFFFF, 2.5); // Soft white light
light.castShadow = true;


scene.add(light);
scene.background = scenecolor;


const sphereGeometry = new THREE.SphereGeometry(3, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.castShadow = true; //default is false
sphere.receiveShadow = false; //default
scene.add(sphere);

//Create a plane that receives shadows (but does not cast them)
//const planeGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
//const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
//const plane = new THREE.Mesh(planeGeometry, planeMaterial);
//plane.receiveShadow = true;
//scene.add(plane);


camera.position.z = 7;
camrea.position.y = 4;
camera.lookAt(0, 0, 0);

function animate() {



	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();