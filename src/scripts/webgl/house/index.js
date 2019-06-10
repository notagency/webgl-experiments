import { MeshLine, MeshLineMaterial } from 'three.meshline';
import 'three-examples/loaders/LoaderSupport';
import 'three-examples/loaders/OBJLoader2';
import 'three-examples/loaders/MTLLoader';

export default class {
  constructor(webGl) {
    this.webGl = webGl;
  }

  enable() {
    const objLoader = new THREE.OBJLoader2();
    const color = 0x3a7a3c;
    const wireframeMaterial = new THREE.LineBasicMaterial({ color });
    objLoader.load( 'models/house.obj', (event) => {
      this.mesh = event.detail.loaderRootNode;
      this.mesh.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          this.webGl.scene.add(child);

          child.material.emissive.set('white');
          child.geometry.center();
          const wireframeGeometry = new THREE.EdgesGeometry(child.geometry);
          const wireframe = new THREE.LineSegments( wireframeGeometry, wireframeMaterial );
          child.add(wireframe);
        }
      });


      this.webGl.camera.position.x = 900;
      this.webGl.camera.position.y = 900;
      this.webGl.camera.position.z = 900;
    });


    return this;
  }

  disable() {
    this.webGl.scene.remove(this.mesh);
    this.webGl.camera.position.x = 0;
    this.webGl.camera.position.y = 0;
    this.webGl.camera.position.z = 200;
    return this;
  }
}