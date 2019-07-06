import * as THREE from 'three';
const glslify = require('glslify');

export default class {
  constructor(app) {
    this.app = app;

    const planeGeometry = new THREE.PlaneGeometry(256, 256);

    const material = new THREE.ShaderMaterial( {
      uniforms: {
        uTime: { type: 'f', value: 0 }
      },
      vertexShader: glslify(require('./shaders/default.vert')),
      fragmentShader: glslify(require('./shaders/default.frag')),
      wireframe: false
    } );

    const plane = new THREE.Mesh(planeGeometry, material);
    this.app.scene.add(plane);
  }
}