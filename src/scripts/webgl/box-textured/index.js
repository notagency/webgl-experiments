const glslify = require('glslify');

export default class {
  constructor(webGl) {
    this.webGl = webGl;

    const geometry = new THREE.BoxGeometry(50, 50, 50);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { type: 't', value: new THREE.TextureLoader().load( 'textures/crate.gif' ) }
      },
      vertexShader: glslify(require('./shaders/default.vert')),
      fragmentShader: glslify(require('./shaders/default.frag'))
    });

    this.object3D = new THREE.Mesh(geometry, material);
    this.webGl.scene.add(this.object3D);
  }
}