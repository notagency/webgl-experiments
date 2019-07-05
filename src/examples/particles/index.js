import * as THREE from 'three';
import {random} from '../../utils/math.utils';

const glslify = require('glslify');

export default class {
  constructor(app) {
    this.app = app;

    const geometry = new THREE.InstancedBufferGeometry();

    const size = 2.0;
    const positions = [
      0.0,  0.0,  0.0,
      size, 0.0,  0.0,
      0.0,  size, 0.0,
      size, size, 0.0
    ];
    geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));


    const indices = [
      0, 1, 3,
      0, 3, 2,
    ];
    geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indices), 1));

    const particlesAmount = 1024 * 1024;
    const offsets = [];
    const colors = [];


    for (let i = 0; i < particlesAmount; i++) {
      offsets.push(random(-1000, 1000)); // x
      offsets.push(random(-1000, 1000)); // y
      offsets.push(random(-1000, 1000)); // z

      colors.push(Math.random()); // r
      colors.push(Math.random()); // g
      colors.push(Math.random()); // b
    }

    geometry.addAttribute('offset', new THREE.InstancedBufferAttribute(new Float32Array(offsets), 3, false));
    geometry.addAttribute('color', new THREE.InstancedBufferAttribute(new Float32Array(colors), 3, false));

    const material = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: glslify(require('./shaders/default.vert')),
      fragmentShader: glslify(require('./shaders/default.frag')),
      // wireframe: true
      side: THREE.DoubleSide
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.app.scene.add(this.mesh);
  }

}