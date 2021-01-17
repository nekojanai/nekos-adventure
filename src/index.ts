import './style.scss';

import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { CharacterControl } from './character-control';
import { ThirdPersonCamera } from './third-person-camera';
import { Misc } from './misc';

let prevTime = performance.now();

// renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );
document.body.appendChild( renderer.domElement );

// camera
const camera = new THREE.PerspectiveCamera( 75.0, window.innerWidth / window.innerHeight, 0.1, 1000 );

// scene
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffffff );
scene.fog = new THREE.Fog( 0xffffff, 0, 1750 );

// floor
let floorGeometry: any = new THREE.PlaneBufferGeometry( 2000, 2000, 100, 100 );
floorGeometry.rotateX( - Math.PI / 2 );

let position = floorGeometry.attributes.position;

floorGeometry = floorGeometry.toNonIndexed(); // ensure each face has unique vertices

position = floorGeometry.attributes.position;
const colorsFloor = [];
const color = new THREE.Color();

for ( let i = 0, l = position.count; i < l; i ++ ) {

	color.setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
	colorsFloor.push( color.r, color.g, color.b );

}

floorGeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colorsFloor, 3 ) );

const floorMaterial = new THREE.MeshBasicMaterial( { vertexColors: true } );

const floor = new THREE.Mesh( floorGeometry, floorMaterial );
scene.add( floor );

// light
const light1 = new THREE.DirectionalLight( 0xffffff );
light1.position.set( 1.0, 1.0, 1.0 ).normalize();
scene.add( light1 );
const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
hemiLight.position.set( 0, 20, 0 );
scene.add( hemiLight );

new Misc({ camera, renderer });
const characterControl = new CharacterControl({ scene });
const thirdPersonCamera = new ThirdPersonCamera({ camera, target: characterControl });

const loader = new THREE.TextureLoader();
const texture = loader.load('./BlueSkySkybox.png', () => {
	const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
	rt.fromEquirectangularTexture(renderer, texture);
	scene.background = rt
});

function animate() {
	requestAnimationFrame( animate );
	const time = performance.now();
	const deltaTime = ( time - prevTime ) / 1000;

	characterControl.update(deltaTime);
	thirdPersonCamera.update(deltaTime);

	prevTime = time;

  renderer.render( scene, camera );
}

animate();