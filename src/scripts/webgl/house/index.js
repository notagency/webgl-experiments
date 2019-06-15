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
    const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0x3a7a3c });
    objLoader.load( 'models/h1_4.obj', (event) => {
      const object = event.detail.loaderRootNode;
      object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          this.mesh = child;
          this.webGl.scene.add(this.mesh);

          this.mesh.material.emissive.set('white');

          this.mesh.material.polygonOffset = true;
          this.mesh.material.polygonOffsetFactor = 1;
          this.mesh.material.polygonOffsetUnits = 1;

          this.mesh.geometry.center();
          const wireframeGeometry = new THREE.EdgesGeometry(this.mesh.geometry);
          this.wireFrameMesh = new THREE.LineSegments( wireframeGeometry, wireframeMaterial);
          this.mesh.add(this.wireFrameMesh);
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
    this.webGl.scene.remove(this.wireFrameMesh);
    this.webGl.camera.position.x = 0;
    this.webGl.camera.position.y = 0;
    this.webGl.camera.position.z = 200;
    return this;
  }
}