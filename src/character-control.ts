import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Vector3 } from 'three';

export class CharacterControl {

  private _params: any;

  private _position = new THREE.Vector3();
  private _rotation = new THREE.Quaternion();

  public get position() {
    return this._position;
  }

  public get rotation() {
    return this._rotation;
  }

  private _rotationAngle: number = 0;

  private _moveForward = false;
  private _moveBackward = false;
  private _moveLeft = false;
  private _moveRight = false;
  private _jump = false;
  private _shift = false;
  private _rotateLeft = false;
  private _rotateRight = false;

  private _direction = new THREE.Vector3();
  private _velocity = new THREE.Vector3();

  private _model: THREE.Group;
  private _mixer: THREE.AnimationMixer;
  private _idleAction: THREE.AnimationAction;
  private _walkAction: THREE.AnimationAction;
  private _actions: THREE.AnimationAction[];

  private _playerBody: CANNON.Body;

  constructor(params: any) {
    this._params = params;
    this._playerBody = params.playerBody;
    document.addEventListener( 'keydown', (event) => this._onKeyDown(event) );
    document.addEventListener( 'keyup', (event) => this._onKeyUp(event) );

    const loader = new GLTFLoader();
    loader.load('./green.glb', ( gltf: GLTF ) => {
      gltf.scene.traverse((o:any) => {
        if (!o.isMesh) return;
        o.material.roughness = 1;
        o.material.metalness = 0;
        o.receiveShadow = true;
        o.castShadow = true;
      });
      this._model = gltf.scene;
      params.scene.add( gltf.scene );
      const animations = gltf.animations;
      this._mixer = new THREE.AnimationMixer( gltf.scene );
      this._idleAction = this._mixer.clipAction( animations[0] );
      this._walkAction = this._mixer.clipAction( animations[1] );
      this._actions = [ this._idleAction, this._walkAction ];
      this._actions.forEach((action) => {
        action.setEffectiveWeight(1);
        action.enabled = true;
        action.setEffectiveTimeScale( 1 );
      });
      },
      ( progress ) => console.log( 'Loading player model...', 100.0 * ( progress.loaded / progress.total ), '%' ),
      ( error ) => console.error( error )
    );
  }

  public update(deltaTime: number): void {
  
    if ( this._moveForward || this._moveBackward || this._moveLeft || this._moveRight ) {
      this._idleAction?.stop();
      this._walkAction?.play();
    } else {
      this._idleAction?.play();
      this._walkAction?.stop();
    }

    this._playerBody.quaternion.setFromEuler(0, this._rotationAngle, 0);

    const moveSpeed = 2;

    if (this._rotateLeft) {
      this._rotationAngle += moveSpeed * deltaTime;
    } else if (this._rotateRight) {
      this._rotationAngle -= moveSpeed * deltaTime;
    }
    if(this._moveForward) this._playerBody.applyLocalImpulse(new CANNON.Vec3(0,0,moveSpeed));
    if(this._moveBackward) this._playerBody.applyLocalImpulse(new CANNON.Vec3(0,0,-moveSpeed));
    if(this._moveLeft) this._playerBody.applyLocalImpulse(new CANNON.Vec3(moveSpeed,0,0));
    if(this._moveRight) this._playerBody.applyLocalImpulse(new CANNON.Vec3(-moveSpeed,0,0));

    this._mixer?.update(deltaTime);

    this._rotation = this._playerBody.quaternion as any;
    this._position = this._position.addVectors((this._playerBody.position as any), new THREE.Vector3(0,-.5,0));
    this._model?.position.copy(this._position);
    this._model?.quaternion.copy(this._rotation);
  }

  private _onKeyDown ( event: any ) {
    event.preventDefault();
    event.stopPropagation();
    switch ( event.keyCode ) {
      case 38: // up
      case 87: // w
        this._moveForward = true;
        break;
      case 37: // left
      case 65: // a
        this._moveLeft = true;
        break;
      case 40: // down
      case 83: // s
        this._moveBackward = true;
        break;
      case 39: // right
      case 68: // d
        this._moveRight = true;
        break;
      case 32: // space
        this._jump = true;
        break;
      case 16: // shift
        this._shift = true;
        break;
      case 81: // q
        this._rotateLeft = true;
        break;
      case 69: // e
        this._rotateRight = true;
        break;
    }
  };
  
  private _onKeyUp ( event: any ) {
    event.preventDefault();
    event.stopPropagation();
    switch ( event.keyCode ) {
      case 38: // up
      case 87: // w
        this._moveForward = false;
        break;
      case 37: // left
      case 65: // a
        this._moveLeft = false;
        break;
      case 40: // down
      case 83: // s
        this._moveBackward = false;
        break;
      case 39: // right
      case 68: // d
        this._moveRight = false;
        break;
      case 32: // space
        this._jump = false;
        break;
      case 16: // shift
        this._shift = false;
        break;
      case 81: // q
        this._rotateLeft = false;
        break;
      case 69: // e
        this._rotateRight = false;
        break;
    }
  };
}