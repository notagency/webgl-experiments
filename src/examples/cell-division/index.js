import * as THREE from 'three';
const glslify = require('glslify');

export default class {
  constructor(app) {
    this.app = app;

    const [width, height] = this.app.getContainerSize();
    const planeGeometry = new THREE.PlaneGeometry(width, height);

    const material = new THREE.ShaderMaterial( {
      uniforms: {
        uAspect: { type: 'f', value: width/height },
        uTime: { type: 'f', value: 0 },
        uStrength: { type: 'f', value: 1 },
        uFade: { type: 'f', value: 1 },
        uMode: { type: 'f', value: 1},
        uClickTime: {type: 'f', value: 0},
        uRotation: new THREE.Uniform(new THREE.Vector3(1, 1, 1)),
      },
      vertexShader: glslify(require('./shaders/default.vert')),
      fragmentShader: glslify(require('./shaders/default.frag')),
      wireframe: false
    });

    this.mesh = new THREE.Mesh(planeGeometry, material);
    this.app.camera.position.z = 800;
    this.app.scene.add(this.mesh);
  }

  onClick() {
    this.mesh.material.uniforms.uClickTime.value = this.mesh.material.uniforms.uTime.value;
    this.mesh.material.uniforms.uMode.value = !this.mesh.material.uniforms.uMode.value;
  }

  update(delta) {
    this.mesh.material.uniforms.uTime.value += delta;
  }
}