import 'three-examples/loaders/TGALoader';

const glslify = require('glslify');

export default class {
  constructor(webGl) {
    this.webGl = webGl;

    const geometry = new THREE.BoxGeometry(10000, 10000, 10000);

    const loader = new THREE.TGALoader();
    // const front = loader.load( 'textures/skybox/grimmnight_ft.tga' );
    // const back = loader.load( 'textures/skybox/grimmnight_bk.tga' );
    // const up = loader.load( 'textures/skybox/grimmnight_up.tga' );
    // const down = loader.load( 'textures/skybox/grimmnight_dn.tga' );
    // const left = loader.load( 'textures/skybox/grimmnight_lf.tga' );
    // const right = loader.load( 'textures/skybox/grimmnight_rt.tga' );

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uCubeTexture: { type: 't', value: new THREE.CubeTextureLoader()
            .setPath('textures/cubemap/')
            .load([
              'crate.gif',
              'crate.gif',
              'crate.gif',
              'crate.gif',
              'crate.gif',
              'crate.gif',
              // 'grimmnight_ft.tga',
              // 'grimmnight_bk.tga',
              // 'grimmnight_up.tga',
              // 'grimmnight_dn.tga',
              // 'grimmnight_lf.tga',
              // 'grimmnight_rt.tga',
            ]) },
      },
      vertexShader: glslify(require('./shaders/default.vert')),
      fragmentShader: glslify(require('./shaders/default.frag')),
      side: THREE.BackSide
    });

    this.object3D = new THREE.Mesh(geometry, material);
    this.webGl.scene.add(this.object3D);
  }
}