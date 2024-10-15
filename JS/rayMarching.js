import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const backgroundColor = new THREE.Color(0x99bbff)
renderer.setClearColor(backgroundColor, 1);

const controls = new OrbitControls(camera, renderer.domElement);
controls.maxDistance = 10;
controls.minDistance = 2;
controls.enableDamping = true;

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1);
scene.add(light);


//add screen plane
const geometry = new THREE.PlaneGeometry();
const material = new THREE.ShaderMaterial();
const rayMarchPlane = new THREE.Mesh(geometry, material);

// width and height of plane
const nearPlaneWidth = camera.near * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect * 2;
const nearPlaneHeight = nearPlaneWidth / camera.aspect;
rayMarchPlane.scale.set(nearPlaneWidth, nearPlaneHeight, 1);

scene.add(rayMarchPlane)

let cameraForwardPos = new THREE.Vector3(0, 0, -1);
const VECTOR3ZERO = new THREE.Vector3(0, 0, 0);

let time = Date.now();

const animate = () => {
    requestAnimationFrame(animate)

    cameraForwardPos = camera.position.clone().add(camera.getWorldDirection(VECTOR3ZERO).multiplyScalar(camera.near));
    rayMarchPlane.position.copy(cameraForwardPos);
    rayMarchPlane.rotation.copy(camera.rotation);

    renderer.render(scene, camera);

    controls.update();
}