import 'three-examples/loaders/LoaderSupport';
import 'three-examples/loaders/OBJLoader2';
import 'three-examples/loaders/MTLLoader';

export default class {
  constructor(webGl) {
    this.webGl = webGl;
    this.mesh = [];
    this.enabled = false;
  }

  enable() {
    this.enabled = true;
    this.initCamera();

    const objLoader = new THREE.OBJLoader2();
    objLoader.load( 'models/h1_4.obj', (event) => {
      const object = event.detail.loaderRootNode;
      object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // let x = 0, z = 0;
          for (let x = -1000; x <= 2000; x +=220) {
            for (let z = -1000; z <= 2000; z += 270) {
              this.mesh.push(this.addBlock(child, x, z));
            }
          }
        }
      });

    });

    return this;
  }

  initCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    const d = 300;
    this.webGl.camera = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 1, 10000 );

    this.webGl.camera.position.set(d, d, d);
    this.webGl.camera.lookAt( this.webGl.scene.position ); // or the origin
    this.webGl.initControls();
  }

  addBlock(house, x, z) {
    const ground = this.getGround();
    const house1 = this.getHouse(house.clone(), 0, 0);
    const house2 = this.getHouse(house.clone(), 0, 600);

    const block = new THREE.Group();
    block.add(ground);
    block.add(house1);
    block.add(house2);

    this.webGl.scene.add( block );
    block.position.set(x, 0, z);
    block.scale.set(0.2, 0.2, 0.2);
  }

  getHouse(mesh, x, z) {
    mesh.geometry.center();
    mesh.position.set(x, 200, z);
    // console.log(this.mesh);

    mesh.material.emissive.set('white');

    mesh.material.polygonOffset = true;
    mesh.material.polygonOffsetFactor = 1;
    mesh.material.polygonOffsetUnits = 1;

    const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0x3a7a3c });
    const wireframeGeometry = new THREE.EdgesGeometry(mesh.geometry);
    this.wireFrameMesh = new THREE.LineSegments( wireframeGeometry, wireframeMaterial);
    mesh.add(this.wireFrameMesh);
    return mesh;
  }

  getGround() {
    const geometry = new THREE.PlaneGeometry( 900, 1200 );
    const material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
    const mesh = new THREE.Mesh( geometry, material );
    mesh.position.z = 300;
    mesh.rotateX(THREE.Math.degToRad(-90));
    return mesh;
  }

  disable() {
    this.enabled = false;

    this.webGl.scene.remove(this.mesh);
    this.webGl.scene.remove(this.wireFrameMesh);
    this.webGl.initCamera();
    this.webGl.initControls();
    return this;
  }

  update(delta) {
    this.webGl.scene.position.z++;
  }
}