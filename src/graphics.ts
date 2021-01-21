import * as THREE from 'three';

export class Graphics {

  private _renderer: THREE.WebGLRenderer;
  private _camera: any;
  private _scene: any;
  private _meshes: {
    [key: string]: THREE.Mesh
  };

  get renderer() {
    return this._renderer;
  }

  get camera() {
    return this._camera;
  }

  get scene() {
    return this._scene;
  }

  constructor() {

    // renderer
    this._renderer = new THREE.WebGLRenderer({ antialias: true });
    this._renderer.setSize( window.innerWidth, window.innerHeight );
    this._renderer.setPixelRatio( window.devicePixelRatio );
    document.body.appendChild( this._renderer.domElement );

    // camera
    this._camera = new THREE.PerspectiveCamera( 75.0, window.innerWidth / window.innerHeight, 0.1, 1000 );

    // scene
    this._scene = new THREE.Scene();
    this._scene.background = new THREE.Color( 0xffffff );
    this._scene.fog = new THREE.Fog( 0xffffff, 0, 1500 );

    const loader = new THREE.TextureLoader();
    const skyboxTexture = loader.load('./skybox.png', () => {
	  const rt = new THREE.WebGLCubeRenderTarget(skyboxTexture.image.height);
	    rt.fromEquirectangularTexture(this._renderer, skyboxTexture);
	    this._scene.background = rt
    });

    // floor
    let floorGeometry: any = new THREE.PlaneBufferGeometry( 2000, 2000, 100, 100 );
    floorGeometry.rotateX( - Math.PI / 2 );

    let position = floorGeometry.attributes.position;

    position = floorGeometry.attributes.position;

    const textureLoader = new THREE.TextureLoader();
    const floorTexture = textureLoader.load('./cyber.jpg');
    floorTexture.repeat = new THREE.Vector2(2000,2000);
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    const floorMaterial = new THREE.MeshBasicMaterial({
      map: floorTexture
    });

    const floor = new THREE.Mesh( floorGeometry, floorMaterial );
    floor.receiveShadow = true;
    this._scene.add( floor );

    // light
    const light1 = new THREE.DirectionalLight( 0xffffff );
    light1.castShadow = true;
    light1.position.set( 1.0, 1.0, 1.0 ).normalize();
    this._scene.add( light1 );
    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    hemiLight.position.set( 0, 20, 0 );
    this._scene.add( hemiLight );
  }

  update(deltaTime: number) {
    this._renderer.render( this._scene, this._camera );
  }
}