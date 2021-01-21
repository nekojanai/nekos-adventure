import './style.scss';

import * as THREE from 'three';
import { Graphics } from './graphics';
import { Physics } from './physics';
import { CharacterControl } from './character-control';
import { ThirdPersonCamera } from './third-person-camera';
import { Misc } from './misc';

const graphics = new Graphics();
const physics = new Physics({ scene: graphics.scene });
new Misc({ camera: graphics.camera, renderer: graphics.renderer });
const characterControl = new CharacterControl({ playerBody: physics.playerBody, scene: graphics.scene });
const thirdPersonCamera = new ThirdPersonCamera({ camera: graphics.camera, target: characterControl });


let clock = new THREE.Clock();

graphics.renderer.setAnimationLoop(() => {
	const deltaTime = clock.getDelta();
	graphics.update(deltaTime);
	physics.update(deltaTime);
	characterControl.update(deltaTime);
	thirdPersonCamera.update(deltaTime);
});