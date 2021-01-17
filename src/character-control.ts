import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

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

  constructor(params: any) {
    this._params = params;
    document.addEventListener( 'keydown', (event) => this._onKeyDown(event) );
    document.addEventListener( 'keyup', (event) => this._onKeyUp(event) );

    const loader = new GLTFLoader();
    loader.load('./green.glb', ( gltf: GLTF ) => {
        gltf.scene.traverse((o:any) => {
          if (!o.isMesh) return;
          o.material.roughness = 1;
          o.material.metalness = 0;
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
      ( progress ) => console.log( 'Loading model...', 100.0 * ( progress.loaded / progress.total ), '%' ),
      ( error ) => console.error( error )
    );
  }

  public update(deltaTime: number): void {

    this._velocity.x -= this._velocity.x * 10 * deltaTime;
    this._velocity.z -= this._velocity.z * 10 * deltaTime;
  
    this._direction.z = Number( this._moveForward ) - Number( this._moveBackward );
    this._direction.x = Number( this._moveRight ) - Number( this._moveLeft );
    this._direction.normalize(); // this ensures consistent movements in all directions
  
    if ( this._moveForward || this._moveBackward ) this._velocity.z += this._direction.z * .5 * deltaTime;
    if ( this._moveLeft || this._moveRight ) this._velocity.x += this._direction.x * .5 * deltaTime;
    if ( this._moveForward || this._moveBackward || this._moveLeft || this._moveRight ) {
      this._idleAction?.stop();
      this._walkAction?.play();
    } else {
      this._idleAction?.play();
      this._walkAction?.stop();
    }

    this._mixer?.update(deltaTime);
  
    if (this._model) {
      const charHips = this._model;
      const charPos = charHips.position;
      this._position = charPos;
      this._rotation = charHips.quaternion;
      charHips.translateX(-this._velocity.x);
      charHips.translateZ(this._velocity.z);
      if (this._rotateLeft) {
        charHips.rotateY(0.05);
      }
      if (this._rotateRight) {
        charHips.rotateY(-0.05);
      }
    }
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