import 'three-examples/loaders/TGALoader';

const glslify = require('glslify');

export default class {
  constructor(webGl) {
    this.webGl = webGl;

    const geometry = new THREE.BoxGeometry(1024, 1024, 1024);

    this.loader = new THREE.TGALoader();
    this.loader.setPath('textures/cubemap/');


    const uCubeTexture = this.loadTexture('grimmnight');

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uCubeTexture: { type: 't', value: uCubeTexture }
      },
      vertexShader: glslify(require('./shaders/default.vert')),
      fragmentShader: glslify(require('./shaders/default.frag')),
      side: THREE.BackSide
    });

    this.mesh = new THREE.Mesh(geometry, material);
  }

  loadTexture(textureName) {
    const cubeTexture = (new THREE.CubeTexture());
    const onLoad = (texture, index) => {
      cubeTexture.images[index] = texture.image;
      cubeTexture.needsUpdate = true;
    };
    this.loader.load( `${textureName}/${textureName}_rt.tga`, (texture) => onLoad(texture, 4) ); // px = positiveX = right side
    this.loader.load( `${textureName}/${textureName}_lf.tga`, (texture) => onLoad(texture, 5) ); // nx = negativeX = left side
    this.loader.load( `${textureName}/${textureName}_up.tga`, (texture) => onLoad(texture, 2) ); // py = positiveY = top side
    this.loader.load( `${textureName}/${textureName}_dn.tga`, (texture) => onLoad(texture, 3) ); // ny = negativeY = bottom side
    this.loader.load( `${textureName}/${textureName}_bk.tga`, (texture) => onLoad(texture, 1) ); // pz = positiveZ = back side
    this.loader.load( `${textureName}/${textureName}_ft.tga`, (texture) => onLoad(texture, 0) ); // nz = negativeZ = front side
    return cubeTexture;
  }

  enable() {
    this.webGl.scene.add(this.mesh);
    return this;
  }

  disable() {
    this.webGl.scene.remove(this.mesh);
    return this;
  }
}