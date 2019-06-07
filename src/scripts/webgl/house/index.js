import 'three-examples/loaders/LoaderSupport';
import 'three-examples/loaders/OBJLoader2';
import 'three-examples/loaders/MTLLoader';

export default class {
  constructor(webGl) {
    this.webGl = webGl;
  }

  enable() {
    const objLoader = new THREE.OBJLoader2();
    objLoader.load( 'models/house.obj', (event) => {
      this.mesh = event.detail.loaderRootNode;
      this.webGl.scene.add(this.mesh);
      this.mesh.position.set(0, 0, -350);
      this.webGl.camera.position.z = 900;
    });

    this.ambientLight = new THREE.AmbientLight( 0xffffff );
    this.webGl.scene.add(this.ambientLight);

    this.directionLight = new THREE.DirectionalLight( 0xffffff );
    this.directionLight.position.set( 100, 100, 100 ).normalize();
    this.webGl.scene.add(this.directionLight);

    this.directionLight2 = new THREE.DirectionalLight( 0xffffff );
    this.directionLight2.position.set( -100, -100, -100 ).normalize();
    this.webGl.scene.add(this.directionLight2);

    return this;
  }

  disable() {
    this.webGl.scene.remove(this.mesh);
    this.webGl.scene.remove(this.ambientLight);
    this.webGl.scene.remove(this.directionLight);
    this.webGl.scene.remove(this.directionLight2);
    this.webGl.camera.position.z = 200;
    return this;
  }
}