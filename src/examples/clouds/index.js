import * as THREE from 'three';
const glslify = require('glslify');

export default class {
  constructor(app) {

    this.app = app;

    const geometry = new THREE.Geometry();

    const texture = new THREE.TextureLoader().load('/textures/cloud.png');
    texture.magFilter = THREE.LinearMipMapLinearFilter;
    texture.minFilter = THREE.LinearMipMapLinearFilter;

    const fog = new THREE.Fog(0xf00, -100, 3000);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uMap: {type: "t", value: texture},
        uFogColor: {type: "c", value: fog.color},
        uFogNear: {type: "f", value: fog.near},
        uFogFar: {type: "f", value: fog.far},
      },
      vertexShader: glslify(require('./shaders/default.vert')),
      fragmentShader: glslify(require('./shaders/default.frag')),
      depthWrite: false,
      depthTest: false,
      transparent: true
    });

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(64, 64));

    for (let i = 0; i < 8000; i++) {
      plane.position.x = Math.random() * 1000 - 500;
      plane.position.y = -Math.random() * Math.random() * 200 - 15;
      plane.position.z = i;
      plane.rotation.z = Math.random() * Math.PI;
      plane.scale.x = plane.scale.y = Math.random() * Math.random() * 1.5 + 0.5;
      THREE.GeometryUtils.merge(geometry, plane);
    }

    const mesh1 = new THREE.Mesh(geometry, material);
    this.app.scene.add(mesh1);

    const mesh2 = new THREE.Mesh(geometry, material);
    mesh2.position.z = -8000;
    this.app.scene.add(mesh2);
  }

  update() {
    let position = (this.app.clock.elapsedTime * 10) % 8000;
    this.app.camera.position.z = -position + 8000;
  }

}