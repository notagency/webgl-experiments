import 'three-examples/loaders/TGALoader';
import { TweenLite } from 'gsap/TweenMax';

const glslify = require('glslify');

export default class {
  constructor(webGl) {
    this.webGl = webGl;

    const geometry = new THREE.BoxGeometry(1024, 1024, 1024);

    const nightTexture = this.loadTexture('grimmnight');
    const dayTexture = this.loadTexture('miramar');

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uNightTexture: { type: 't', value: nightTexture },
        uDayTexture: { type: 't', value: dayTexture },
        uTime: { type: 'f', value: 0 }
      },
      vertexShader: glslify(require('./shaders/default.vert')),
      fragmentShader: glslify(require('./shaders/default.frag')),
      side: THREE.BackSide
    });

    this.mesh = new THREE.Mesh(geometry, material);
  }

  loadTexture(textureName) {
    const cubeTexture = (new THREE.CubeTexture());
    const loadedImages = [];
    const onLoad = (texture, index) => {
      loadedImages.push({index, image: texture.image});
      if (loadedImages.length === 6) {
        updateTexture();
      }
    };
    const updateTexture = () => {
      const loadedImagesSorted = [];
      loadedImages.forEach((loadedImage) => {
        loadedImagesSorted[loadedImage.index] = loadedImage.image;
      });
      cubeTexture.images = loadedImagesSorted;
      cubeTexture.needsUpdate = true;
    };
    this.loader = new THREE.TGALoader();
    this.loader.setPath('textures/cubemap/');
    this.loader.load( `${textureName}/${textureName}_ft.tga`, (texture) => onLoad(texture, 0) ); // nz = negativeZ = front side
    this.loader.load( `${textureName}/${textureName}_bk.tga`, (texture) => onLoad(texture, 1) ); // pz = positiveZ = back side
    this.loader.load( `${textureName}/${textureName}_up.tga`, (texture) => onLoad(texture, 2) ); // py = positiveY = top side
    this.loader.load( `${textureName}/${textureName}_dn.tga`, (texture) => onLoad(texture, 3) ); // ny = negativeY = bottom side
    this.loader.load( `${textureName}/${textureName}_rt.tga`, (texture) => onLoad(texture, 4) ); // px = positiveX = right side
    this.loader.load( `${textureName}/${textureName}_lf.tga`, (texture) => onLoad(texture, 5) ); // nx = negativeX = left side
    return cubeTexture;
  }

  update(delta) {
    this.mesh.material.uniforms.uTime.value += delta;
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