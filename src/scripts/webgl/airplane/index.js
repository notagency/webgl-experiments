import 'three-examples/loaders/OBJLoader';
import 'three-examples/loaders/MTLLoader';

export default class {
  constructor(webGl) {
    this.webGl = webGl;
  }

  enable() {

    const mtlLoader = new THREE.MTLLoader();
    mtlLoader.load( 'textures/boeing757/airliner_757_base_colour.mtl', (materials) => {
      const objLoader = new THREE.OBJLoader();
      objLoader.setMaterials( materials );
      objLoader.load( 'models/airliner_757_base_colour.obj', (obj) => {
        this.mesh = obj;
        this.webGl.scene.add(this.mesh);
      });
    });
    return this;
  }

  disable() {
    this.webGl.scene.remove(this.mesh);
    return this;
  }
}