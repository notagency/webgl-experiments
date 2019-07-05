import * as THREE from 'three';
const glslify = require('glslify');

export default class {
  constructor(app) {
    this.enabled = false;
    this.app = app;

    const sphereGeometry = new THREE.SphereBufferGeometry(50, 50, 50);

    const material = new THREE.ShaderMaterial( {
      uniforms: {
        uTime: { type: 'f', value: 0 }
      },
      vertexShader: glslify(require('./shaders/default.vert')),
      fragmentShader: glslify(require('./shaders/default.frag')),
      wireframe: true
    } );

    this.mesh = new THREE.Mesh(sphereGeometry, material);
    this.app.scene.add(this.mesh);

    this.setupLights();
  }

  setupLights() {
    this.lights = [];
    this.lights[0] = new THREE.PointLight( 0xffffff, 1, 0 );
    this.lights[1] = new THREE.AmbientLight( 0xffffff, 0.1 );
    this.lights[0].position.set( -1000, 1500, 1000 );
    this.lights[1].position.set( 1000, 3000, 1000 );
    this.lights.forEach(light => this.app.scene.add(light));
  }

  update(delta) {
    // this.mesh.material.uniforms.uTime.value += delta;
  }
}