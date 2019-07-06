import * as THREE from 'three';
const glslify = require('glslify');

export default class {
  constructor(app) {
    this.app = app;

    const [width, height] = this.app.getContainerSize();

    const planeGeometry = new THREE.PlaneGeometry(width, height);

    const material = new THREE.ShaderMaterial( {
      vertexShader: glslify(require('./shaders/default.vert')),
      fragmentShader: glslify(require('./shaders/default.frag')),
      wireframe: false,
      uniforms: {
        uAspect: new THREE.Uniform(width/height, 'f')
      }
    } );

    this.app.camera.position.z = 800;

    this.mesh = new THREE.Mesh(planeGeometry, material);
    this.app.scene.add(this.mesh);
  }
}