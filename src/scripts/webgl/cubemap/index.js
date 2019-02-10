import 'three-examples/loaders/TGALoader';

const glslify = require('glslify');

export default class {
  constructor(webGl) {
    this.webGl = webGl;

    const geometry = new THREE.BoxGeometry(1024, 1024, 1024);

    const loader = new THREE.TGALoader();
    loader.setPath('textures/cubemap/');


    const cubeTexture = (new THREE.CubeTexture());
    const onLoad = (texture, index) => {
      cubeTexture.images[index] = texture.image;
      cubeTexture.needsUpdate = true;
    };
    loader.load( 'grimmnight_rt.tga', (texture) => onLoad(texture, 4) ); // px = positiveX = right side
    loader.load( 'grimmnight_lf.tga', (texture) => onLoad(texture, 5) ); // nx = negativeX = left side
    loader.load( 'grimmnight_up.tga', (texture) => onLoad(texture, 2) ); // py = positiveY = top side
    loader.load( 'grimmnight_dn.tga', (texture) => onLoad(texture, 3) ); // ny = negativeY = bottom side
    loader.load( 'grimmnight_bk.tga', (texture) => onLoad(texture, 1) ); // pz = positiveZ = back side
    loader.load( 'grimmnight_ft.tga', (texture) => onLoad(texture, 0) ); // nz = negativeZ = front side

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uCubeTexture: { type: 't', value: cubeTexture},
      },
      vertexShader: glslify(require('./shaders/default.vert')),
      fragmentShader: glslify(require('./shaders/default.frag')),
      side: THREE.BackSide
    });

    this.object3D = new THREE.Mesh(geometry, material);
    this.webGl.scene.add(this.object3D);
  }
}