import * as THREE from 'three';
const glslify = require('glslify');

export default class {
  constructor(app) {
    this.app = app;

    const planeGeometry = new THREE.PlaneGeometry(256, 256);

    const material = new THREE.ShaderMaterial( {
      vertexShader: glslify(require('./shaders/default.vert')),
      fragmentShader: glslify(require('./shaders/default.frag')),
      wireframe: false
    } );

    this.mesh = new THREE.Mesh(planeGeometry, material);
    this.app.scene.add(this.mesh);
  }
}