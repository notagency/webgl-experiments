const glslify = require('glslify');

export default class {
  constructor(webGl) {
    this.webGl = webGl;

    const geometry = new THREE.BufferGeometry();

    const size = 50.0;
    const positions = [
      0.0,  0.0,  0.0,
      size, 0.0,  0.0,
      0.0,  size, 0.0,
      size, size, 0.0,
      0.0,  0.0,  size,
      size, 0.0,  size,
      0.0,  size, size,
      size, size, size
    ];
    geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));


    /**
     * Indices
     *
     *     6-----7
     *   / |  /  |
     * 2-----3   |
     * |   4-|---5
     * | /   | /
     * 0-----1
     */

    const indices = [
      // front side
      0, 1, 3,
      0, 3, 2,

      // back side
      4, 5, 7,
      4, 7, 6,

      // top side
      2, 3, 7,
      2, 7, 6,

      // bottom side
      0, 1, 5,
      0, 5, 4,

      // left side
      0, 4, 6,
      0, 6, 2,

      // right side
      1, 5, 7,
      1, 7, 3,
    ];
    geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indices), 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: glslify(require('./shaders/default.vert')),
      fragmentShader: glslify(require('./shaders/default.frag')),
      side: THREE.DoubleSide,
      wireframe: true
    });

    this.mesh = new THREE.Mesh(geometry, material);
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