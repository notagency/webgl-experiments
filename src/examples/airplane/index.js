import * as THREE from 'three';
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader2 } from "three/examples/jsm/loaders/OBJLoader2";


export default class {
  constructor(app) {
    this.app = app;

    new MTLLoader()
      .setPath('textures/boeing757/')
      .load('airliner_757_base_colour.mtl', (materials) => {

        materials.preload();
        const objLoader = new OBJLoader2();
        objLoader.addMaterials(materials.materials);
        objLoader.load('models/airliner_757_base_colour.obj', (object) => {
          this.mesh = object;
          this.app.scene.add(object);
          this.mesh.scale.set(4, 4, 4);
          this.mesh.rotateX(THREE.Math.degToRad(0));
          this.mesh.rotateY(THREE.Math.degToRad(10));

          this.light = new THREE.PointLight(0xffffff, 1, 0);
          this.light.position.y = 100;
          this.light.position.z = 100;
          this.app.scene.add(this.light);

          this.planeLight = new THREE.PointLight(0xfff000, 1, 0);
          this.planeLight.position.y = -10;
          this.app.scene.add(this.planeLight);
        })
      });
  }

  update(delta) {
    if (this.planeLight) {
      this.planeLight.intensity = Math.sin(this.app.clock.elapsedTime) * 0.5 + 0.5;
    }
  }
}