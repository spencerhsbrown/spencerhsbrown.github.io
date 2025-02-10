// following https://medium.com/@nabilnymansour/ray-marching-in-three-js-66b03e3a6af2

import * as THREE from 'https://esm.sh/three';
import { OrbitControls } from "https://esm.sh/three/examples/jsm/controls/OrbitControls";;

//value sliders for controlling visuals start here

var checkbox = document.getElementById("movementCheckBox");

// Add an event listener for the 'change' event
checkbox.addEventListener("change", function () {
    if (checkbox.checked) {
        console.log("Checkbox is checked");
        uniforms.u_movementEnabled.value = 1;
    } else {
        uniforms.u_movementEnabled.value = 0;
        console.log("Checkbox is not checked");
    }
});
       
//if (checkBox.checked == true) {

    //    uniforms.u_movementEnabled == true;
    //} else {
     //   uniforms.u_movementEnabled == false;
   // } 

class SliderControl {
    constructor(sliderId, outputId, uniformProperty) {
        this.slider = document.getElementById(sliderId);
        this.output = document.getElementById(outputId);
        this.uniformProperty = uniformProperty;

        // Set initial value
        this.output.innerHTML = this.slider.value;

        // Bind event listener
        this.slider.oninput = () => this.updateValue();
    }

    updateValue() {
        this.output.innerHTML = this.slider.value;
        uniforms[this.uniformProperty].value = parseFloat(this.slider.value);
    }
}

// Create slider instances
const sliders = [
    new SliderControl("xRange", "xTextValue", "u_spherePositionX"),
    new SliderControl("yRange", "yTextValue", "u_spherePositionY"),
    new SliderControl("zRange", "zTextValue", "u_spherePositionZ"),
    new SliderControl("maxStepsRange", "maxStepsTextValue", "u_maxSteps"),
    new SliderControl("shapeSelectedRange", "shapeSelectedTextValue", "u_shapeSelected"),
    new SliderControl("modifierRange", "modifierTextValue", "u_shapeModifier"),
    new SliderControl("blendFactorRange","blendFactorTextValue","u_blendFactor"),
];

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const backgroundColor = new THREE.Color(0x3399ff)
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


// Uniforms
const uniforms = {
    u_epsilonValue: { value: 0.0001 },
    u_maxDis: { value: 1000 },
    u_maxSteps: { value: 1000 },

    u_clearColor: { value: backgroundColor },

    u_camPos: { value: camera.position },
    u_camToWorldMat: { value: camera.matrixWorld },
    u_camInvProjMat: { value: camera.projectionMatrixInverse },

    u_lightDir: { value: light.position },
    u_lightColor: { value: light.color },

    u_diffIntesity: { value: 0.2 },
    u_specIntensity: { value: 0.2 },
    u_ambientIntesity: { value: 0.2 },
    u_shininess: { value: 0.2 },

    u_time: { value: 0 },

    u_spherePositionX: { value: 0.0 },
    u_spherePositionY: { value: 1.0 },
    u_spherePositionZ: { value: 0.0 },
    u_shapeSelected: { value: 1 },
    u_shapeModifier: { value: 0.5 },
    u_movementEnabled: { value: 0 },
    u_blendFactor: {value: 0.2},
};
material.uniforms = uniforms;

const vertCode = `
out vec2 vUv;

void main() {
    vec4 worldPos = modelViewMatrix * vec4(position, 1.0);
    vec3 viewDir = normalize(-worldPos.xyz);

    gl_Position = projectionMatrix * worldPos;

    vUv = uv;
}
`;

const fragCode = `
precision mediump float;

in vec2 vUv;

uniform vec3 u_clearColor;

uniform float u_epsilonValue;
uniform float u_maxDis;
uniform int u_maxSteps;

uniform vec3 u_camPos;
uniform mat4 u_camToWorldMat;
uniform mat4 u_camInvProjMat;

uniform vec3 u_lightDir;
uniform vec3 u_lightColor;

uniform float u_diffIntesity;
uniform float u_specIntensity;
uniform float u_ambientIntesity;
uniform float u_shininess;

uniform float u_time;
uniform float u_spherePositionX;
uniform float u_spherePositionY;
uniform float u_spherePositionZ;
uniform int u_shapeSelected;
uniform float u_shapeModifier;
uniform float u_blendFactor;
uniform bool u_movementEnabled;

//shape SDF's
float sdTorus(vec3 currentPosition, vec2 radius)
{
  vec2 q = vec2(length(currentPosition.xy) - radius.x, currentPosition.z);
    return length(q) - radius.y;
}

float sphere(vec3 currentPosition, vec3 center, float radius) {
    return distance(currentPosition, center) - radius;
}
float movingSphere(vec3 currentPosition, vec3 center, float radius) {
    if(u_movementEnabled)
    {
        return distance(currentPosition, center-(vec3(sin(u_time), cos(u_time), 0)))-radius;
    }
    else
    {
    return distance(currentPosition, center) - radius;
    }
}

float boxFrame( vec3 p, vec3 b, float e )
{
       p = abs(p  )-b;
  vec3 q = abs(p+e)-e;
  return min(min(
      length(max(vec3(p.x,q.y,q.z),0.0))+min(max(p.x,max(q.y,q.z)),0.0),
      length(max(vec3(q.x,p.y,q.z),0.0))+min(max(q.x,max(p.y,q.z)),0.0)),
      length(max(vec3(q.x,q.y,p.z),0.0))+min(max(q.x,max(q.y,p.z)),0.0));
}

float sdOctahedron( vec3 p, float s )
{
  p = abs(p);
  float m = p.x+p.y+p.z-s;
  vec3 q;
       if( 3.0*p.x < m ) q = p.xyz;
  else if( 3.0*p.y < m ) q = p.yzx;
  else if( 3.0*p.z < m ) q = p.zxy;
  else return m*0.57735027;

  float k = clamp(0.5*(q.z-q.y+s),0.0,s);
  return length(vec3(q.x,q.y-s+k,q.z-k));
}

float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

float currentShape(vec3 currentPosition)
{
    float shape;
    if(u_shapeSelected == 2)
    {
        shape = sdTorus(currentPosition, vec2(u_shapeModifier,0.5));
    }
    else if(u_shapeSelected == 3)
    {
        shape = boxFrame(currentPosition, vec3(u_shapeModifier), 0.1);
    }
    else if(u_shapeSelected == 4)
    {
        shape = sdOctahedron(currentPosition, u_shapeModifier);
    }
    else
    {
        shape = sphere(currentPosition,vec3(0.0), u_shapeModifier);
    }
    return shape;
}

float scene(vec3 currentPosition){

    float selectedShape = currentShape(currentPosition);
    float spheres = movingSphere(currentPosition, vec3(u_spherePositionX, u_spherePositionY, u_spherePositionZ), 0.5);

    return smin(selectedShape, spheres, u_blendFactor);
}

float rayMarch(vec3 rayOrigin, vec3 rayDirection)
{
    float totalDistance = 0.;  // total distance travelled
    float currentDistance; // current scene distance
    vec3 currentPosition; // current position of ray

    for (int i = 0; i < u_maxSteps; ++i) {
        currentPosition = rayOrigin + totalDistance * rayDirection;
        currentDistance = scene(currentPosition);

        if (currentDistance < u_epsilonValue || totalDistance >= u_maxDis) break;

        totalDistance += currentDistance;
    }

    return totalDistance;
}

vec3 sceneCol(vec3 currentPosition){

    vec3 color1 = vec3(0.0, 0.0, 1.0);
    vec3 color2 = vec3(1.0, 0.0, 0.0);

    float selectedShape = currentShape(currentPosition);
    float spheresDist = movingSphere(currentPosition, vec3(u_spherePositionX, u_spherePositionY, u_spherePositionZ), 0.5);

    float threshold = 0.1;
    float blendFactor = smoothstep(-threshold, threshold, abs(selectedShape - spheresDist));

    if (selectedShape < spheresDist) {
        return mix(color1, color2, blendFactor);
    }
    else if (spheresDist < selectedShape) {
        return mix(color2, color1, blendFactor);
    }
    else {
        return vec3(0.1, 0.1, 0.1);
    }

}

vec3 normal(vec3 p) // from https://iquilezles.org/articles/normalsSDF/
{
    vec3 n = vec3(0, 0, 0);
    vec3 e;
    for (int i = 0; i < 4; i++) {
        e = 0.5773 * (2.0 * vec3((((i + 3) >> 1) & 1), ((i >> 1) & 1), (i & 1)) - 1.0);
        n += e * scene(p + e * u_epsilonValue);
    }
    return normalize(n);
}

void main() {

    vec2 uv = vUv.xy;

    vec3 rayOrigin = u_camPos;
    vec3 rayDirection = (u_camInvProjMat * vec4(uv * 2. - 1., 0, 1)).xyz;
    rayDirection = (u_camToWorldMat * vec4(rayDirection, 0)).xyz;
    rayDirection = normalize(rayDirection);

    float disTravelled = rayMarch(rayOrigin, rayDirection);

    vec3 hitPosition = rayOrigin + disTravelled * rayDirection;

    vec3 norm = normal(hitPosition);

    if (disTravelled >= u_maxDis) {
        gl_FragColor = vec4(u_clearColor, 1);
    } else {
        float dotNL = dot(norm, u_lightDir);
        float diff = max(dotNL, 0.0) * u_diffIntesity;
        float spec = pow(diff, u_shininess) * u_specIntensity;
        float ambient = u_ambientIntesity;

        vec3 color = u_lightColor * (sceneCol(hitPosition) * (spec + ambient + diff));
        gl_FragColor = vec4(color, 1);

    }
}
`;

material.vertexShader = vertCode;
material.fragmentShader = fragCode;

scene.add(rayMarchPlane)

let spherePosition = new THREE.Vector3();
let cameraForwardPos = new THREE.Vector3(0, 0, -1);

const VECTOR3ZERO = new THREE.Vector3(0, 0, 0);
const moveSpeed = 0.1;

let time = Date.now();

const animate = () => {
    requestAnimationFrame(animate)

    cameraForwardPos = camera.position.clone().add(camera.getWorldDirection(VECTOR3ZERO).multiplyScalar(camera.near));
    rayMarchPlane.position.copy(cameraForwardPos);
    rayMarchPlane.rotation.copy(camera.rotation);

    renderer.render(scene, camera);

    uniforms.u_time.value = (Date.now() - time) / 2000;

    controls.update();

}
animate();