import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

uniform vec2 resolution;

//the signed distance field function
//used in the ray march loop
float sdf(vec3 p) {

    //a sphere of radius 1.
    return length( p ) - 1.;
}

void main( void ) {

//1 : retrieve the fragment's coordinates
	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	//preserve aspect ratio
	uv.x *= resolution.x / resolution.y;


//2 : camera position and ray direction
	vec3 pos = vec3( 0.,0.,-3.);
	vec3 dir = normalize( vec3( uv, 1. ) );


//3 : ray march loop
    //ip will store where the ray hits the surface
	vec3 ip;

	//variable step size
	float t = 0.0;
	for( int i = 0; i < 32; i++) {

        //update position along path
        ip = pos + dir * t;

        //gets the shortest distance to the scene
		float temp = sdf( ip );

        //break the loop if the distance was too small
        //this means that we are close enough to the surface
		if( temp < 0.01 ) break;

		//increment the step along the ray path
		t += temp;

	}

//4 : apply color to this fragment
    //we use the result position as the color
	gl_FragColor = vec4( ip, 1.0);

}
