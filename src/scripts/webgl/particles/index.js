import {random} from '../../utils/math.utils';

const glslify = require('glslify');

export default class {
  constructor(webGl) {
    this.webGl = webGl;

    const geometry = new THREE.InstancedBufferGeometry();

    const size = 2.0;
    const positions = new Float32Array([
      0.0,  0.0,  0.0,
      size, 0.0,  0.0,
      0.0,  size, 0.0,
      size, size, 0.0
    ]);
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));


    const indices = new Uint16Array([
      0, 1, 3,
      0, 3, 2,
    ]);
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));

    const particlesAmount = 1024 * 1024;
    const offsets = new Float32Array(particlesAmount * 3);
    const colors = new Float32Array(particlesAmount * 3);

    for (let i = 0; i < particlesAmount * 3; i+=3) {
      offsets[i] = random(-1000, 1000);
      offsets[i + 1] = random(-1000, 1000);
      offsets[i + 2] = random(-1000, 1000);

      colors[i] = Math.random();
      colors[i + 1] = Math.random();
      colors[i + 2] = Math.random();
    }

    geometry.addAttribute('offset', new THREE.InstancedBufferAttribute(offsets, 3, false));
    geometry.addAttribute('color', new THREE.InstancedBufferAttribute(colors, 3, false));

    const material = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: glslify(require('./shaders/default.vert')),
      fragmentShader: glslify(require('./shaders/default.frag')),
      // wireframe: true
      side: THREE.DoubleSide
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