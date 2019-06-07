const glslify = require('glslify');

export default class {
  constructor(webGl) {
    this.webGl = webGl;

    const geometry = new THREE.SphereGeometry(50, 20, 20);

    const material1 = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: glslify(require('./shaders/default.vert')),
      fragmentShader: glslify(require('./shaders/default.frag')),
      wireframe: true
    });

    const material2 = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: glslify(require('./shaders/default.vert')),
      fragmentShader: glslify(require('./shaders/default.frag')),
      transparent: true,
      wireframe: false
    });

    this.mesh1 = new THREE.Mesh(geometry, material1);
    this.mesh2 = new THREE.Mesh(geometry, material2);
  }

  enable() {
    this.webGl.scene.add(this.mesh1);
    this.webGl.scene.add(this.mesh2);
    return this;
  }

  disable() {
    this.webGl.scene.remove(this.mesh1);
    this.webGl.scene.remove(this.mesh2);
    return this;
  }
}