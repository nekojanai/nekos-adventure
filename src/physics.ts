import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import cannonDebugger from 'cannon-es-debugger';

export class Physics {

  private _world: CANNON.World;
  private _playerBody: CANNON.Body;
  private _bodies: {
    [key: string]: THREE.Mesh;
  };

  get playerBody() {
    return this._playerBody;
  }

  constructor(params?: any) {

    this._world = new CANNON.World();
    // Contact stiffness - use to make softer/harder contacts
    this._world.defaultContactMaterial.contactEquationStiffness = 1e9;
    // Stabilization time in number of timesteps
    this._world.defaultContactMaterial.contactEquationRelaxation = 4
    const solver = new CANNON.GSSolver();
    solver.iterations = 7;
    solver.tolerance = 0.1;
    this._world.solver = solver;

    this._world.gravity.set(0, -9, 0);

    const physicsMaterial = new CANNON.Material('physics');
    const physics_physics = new CANNON.ContactMaterial(physicsMaterial, physicsMaterial, {
      friction: 1,
      restitution: 0.3
    });
    this._world.addContactMaterial(physics_physics);

    // player sphere
    const sphereBody = new CANNON.Body({
      mass: 5,
      material: physicsMaterial,
      shape: new CANNON.Sphere(.5),
      position: new CANNON.Vec3(0, 1, 0),
      linearDamping: 0.9,
      angularDamping: 0.9
    });
    this._playerBody = sphereBody;
    this._world.addBody(sphereBody)

    // floor
    const floorBody = new CANNON.Body({
      mass: 0,
      material: physicsMaterial,
      shape: new CANNON.Plane(),
      position: new CANNON.Vec3(0,0,0),
      quaternion: new CANNON.Quaternion().setFromEuler(-Math.PI / 2, 0, 0)
    });
    this._world.addBody(floorBody);

    const cubeBody = new CANNON.Body({
      mass: 5,
      material: physicsMaterial,
      shape: new CANNON.Box(new CANNON.Vec3(1,1,1)),
      position: new CANNON.Vec3(0,1,3),
      linearDamping: 0.9,
      angularDamping: 0.9
    });
    this._world.addBody(cubeBody)

    const cubeBody1 = new CANNON.Body({
      mass: 0,
      material: physicsMaterial,
      shape: new CANNON.Box(new CANNON.Vec3(1,0.3,1)),
      position: new CANNON.Vec3(2,0.3,3),
      linearDamping: 0.9,
      angularDamping: 0.9
    });
    this._world.addBody(cubeBody1)

    cannonDebugger(params.scene, this._world.bodies, {});
  }

  update(deltaTime: number) {
    this._world.step((1/60), deltaTime, 20);
  }
}