export class Misc {

  private _params: any;

  constructor(params: any) {
    this._params = params;   
    window.addEventListener( 'resize', () => this._onWindowResize() );
  }

  private _onWindowResize() {
    this._params.camera.aspect = window.innerWidth / window.innerHeight;
    this._params.camera.updateProjectionMatrix();
    this._params.renderer.setSize( window.innerWidth, window.innerHeight );
  }
}