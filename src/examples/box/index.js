const glslify = require('glslify');

export default class {
  constructor(app) {
    this.app = app;

    const geometry = new THREE.BoxGeometry(50, 50, 50);

    const material = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: glslify(require('./shaders/default.vert')),
      fragmentShader: glslify(require('./shaders/default.frag')),
      wireframe: true
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.app.scene.add(this.mesh);
  }
}