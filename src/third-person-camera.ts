import * as THREE from 'three';

export class ThirdPersonCamera {

  private _params: any;
  private _camera: THREE.Camera;
  private _currentPosition : THREE.Vector3;
  private _currentLookAt : THREE.Vector3;

  constructor(params: any) {

    this._params = params;
    this._camera = params.camera;

    this._currentPosition = new THREE.Vector3();
    this._currentLookAt = new THREE.Vector3();
  }

  public update(deltaTime: number): void {
    const idealOffset = this.calculateIdealOffset();
    const idealLookAt = this.calculateIdealLookAt();

    const t = 1 - Math.pow(0.001, deltaTime);

    this._currentPosition.lerp(idealOffset, t);
    this._currentLookAt.lerp(idealLookAt, t);

    this._camera.position.copy(this._currentPosition);
    this._camera.lookAt(this._currentLookAt);
  }

  private calculateIdealOffset(): THREE.Vector3 {
    const idealOffset = new THREE.Vector3(-.5, 1, -2.5);
    idealOffset.applyQuaternion(this._params.target.rotation);
    idealOffset.add(this._params.target.position);
    return idealOffset;
  }

  private calculateIdealLookAt(): THREE.Vector3 {
    const idealLookAt = new THREE.Vector3(-.5, 1, 0);
    idealLookAt.applyQuaternion(this._params.target.rotation);
    idealLookAt.add(this._params.target.position);
    return idealLookAt;
  }
}