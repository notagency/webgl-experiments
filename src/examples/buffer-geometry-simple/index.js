const glslify = require('glslify');

export default class {
  constructor(app) {
    this.app = app;

    const geometry = new THREE.BufferGeometry();

    /**
     *     6-----7
     *   / |  /  |
     * 2-----3   |
     * |   4-|---5
     * | /   | /
     * 0-----1
     */

    const size = 50.0;
    const positions = [

      // front side bottom
      0.0,  0.0,  0.0,
      size, 0.0,  0.0,
      size, size, 0.0,

      // front side top
      0.0,  0.0,  0.0,
      size, size, 0.0,
      0.0,  size, 0.0,

      // back side bottom
      0.0,  0.0,  size,
      size, 0.0,  size,
      size, size, size,

      // back side top
      0.0,  0.0,  size,
      size, size, size,
      0.0,  size, size,

      // up side bottom
      0.0,  size, 0.0,
      size, size, size,
      0.0,  size, size,

      // up side top
      0.0,  size, 0.0,
      size, size, 0.0,
      size, size, size,

      // down side bottom
      0.0,  0.0,  0.0,
      size, 0.0,  size,
      0.0,  0.0,  size,

      // down side top
      0.0,  0.0,  0.0,
      size, 0.0,  0.0,
      size, 0.0,  size,

      // left side bottom
      0.0,  0.0,  0.0,
      0.0,  0.0,  size,
      0.0,  size, size,

      // left side top
      0.0,  0.0,  0.0,
      0.0,  size, size,
      0.0,  size, 0.0,

      // right side top
      size, 0.0,  0.0,
      size, size, size,
      size, size, 0.0,

      // right side bottom
      size, 0.0,  0.0,
      size, 0.0,  size,
      size, size, size,
    ];
    geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));

    const material = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: glslify(require('./shaders/default.vert')),
      fragmentShader: glslify(require('./shaders/default.frag')),
      side: THREE.DoubleSide,
      wireframe: false
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.app.scene.add(this.mesh);
  }
}