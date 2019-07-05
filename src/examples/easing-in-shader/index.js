import * as THREE from 'three';
import {random} from '../../utils/math.utils';

const glslify = require('glslify');

export default class {
  constructor(app) {
    this.app = app;

    const geometry = new THREE.InstancedBufferGeometry();

    const size = 10.0;
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

    const positionsTo = geometry.attributes.position.array.slice();
    geometry.addAttribute('positionTo', new THREE.BufferAttribute(new Float32Array(positionsTo), 3));

    const offsets = [
      -25, 60, 0, // xyz of the center of each instance
      0,   50, 0,
      35,  90, 0,
    ];
    geometry.addAttribute('offset', new THREE.InstancedBufferAttribute(new Float32Array(offsets), 3, false));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { type: 'f', value: 0 },
      },
      vertexShader: glslify(require('./shaders/default.vert')),
      fragmentShader: glslify(require('./shaders/default.frag')),
    });

    this.enabled = false;
    this.animationStarted = false;
    this.mesh = new THREE.Mesh(geometry, material);
    this.initAnimationDelay();
    this.app.scene.add(this.mesh);
  }

  onClick() {
    if (this.animationStarted) {
      this.resetAnimation();
    } else {
      this.animate();
    }
  }

  update(delta) {
    if (this.animationStarted) {
      this.mesh.material.uniforms.uTime.value += delta;
    }
  }

  animate() {
    this.animationStarted = true;
  }

  resetAnimation() {
    this.animationStarted = false;
    this.mesh.material.uniforms.uTime.value = 0;
    this.initAnimationDelay();
  }

  initAnimationDelay() {
    const animationDelay = [
      random(0, 1), // seconds for each instance
      random(0, 1),
      random(0, 1)
    ];
    this.mesh.geometry.addAttribute('animationDelay', new THREE.InstancedBufferAttribute(new Float32Array(animationDelay), 1, false))
  }

}