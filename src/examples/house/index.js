import * as THREE from 'three';
import { OBJLoader2 } from "three/examples/jsm/loaders/OBJLoader2";

export default class {
  constructor(app) {
    this.app = app;
    this.mesh = [];
    this.distance = {
      from: -2000,
      to: 2000,
      gapX: 600,
      gapZ: 1350
    };
    this.initScene();
    this.initCamera();
  }

  initCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    const d = 400;
    this.app.camera = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 1, 10000 );

    this.app.camera.position.set(d, d, d);
    this.app.camera.lookAt( this.app.scene.position ); // or the origin

  }

  initScene() {

    const objLoader = new OBJLoader2();
    objLoader.load( 'models/ulitsa1_4.obj', (object) => {
      object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // let x = 0, z = 0;
          for (let x = this.distance.from; x <= this.distance.to; x += this.distance.gapX) {
            for (let z = this.distance.from; z <= this.distance.to; z += this.distance.gapZ) {
              this.mesh.push(this.getBlock(child.clone(), x, z));
            }
          }
        }
      });

    });
  }

  getBlock(mesh, x, z) {
    mesh.geometry.center();
    mesh.position.set(x, 200, z);
    mesh.rotateY(THREE.Math.degToRad(180));
    mesh.material.color.set('white');
    mesh.material.emissive.set('white');
    mesh.material.side = THREE.FrontSide;
    mesh.material.polygonOffset = true;
    mesh.material.polygonOffsetFactor = 1;
    mesh.material.polygonOffsetUnits = 1;

    const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0x3a7a3c });
    const wireframeGeometry = new THREE.EdgesGeometry(mesh.geometry);
    this.wireFrameMesh = new THREE.LineSegments( wireframeGeometry, wireframeMaterial);
    mesh.add(this.wireFrameMesh);

    this.app.scene.add( mesh );
    mesh.position.set(x, 0, z);
    return mesh;
  }

  update() {
    this.app.scene.position.z += 0.1;
  }
}