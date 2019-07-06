import * as THREE from 'three';
import {distanceBetweenPoints} from "../../utils/math.utils";

const glslify = require('glslify');

export default class {
  constructor(app) {
    this.app = app;

    const sphereGeometry = new THREE.SphereBufferGeometry(50, 50, 50);
    const boxGeometry = new THREE.BoxBufferGeometry(100, 100, 100, 5, 5, 5);

    const material = new THREE.ShaderMaterial( {
      uniforms: {
        uTime: { type: 'f', value: 0 }
      },
      vertexShader: glslify(require('./shaders/default.vert')),
      fragmentShader: glslify(require('./shaders/default.frag')),
      wireframe: true
    } );

    const boxMaterial = new THREE.MeshStandardMaterial({
      color: 'yellow',
      wireframe: true
    });

    const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
    // this.app.scene.add(mesh);

    sphereGeometry.addAttribute('targetPosition', this.getTargetGeometry(sphereGeometry, boxGeometry).attributes.position);
    this.mesh = new THREE.Mesh(sphereGeometry, material);

    this.lights = [];
    this.lights[0] = new THREE.PointLight( 0xffffff, 1, 0 );
    this.lights[1] = new THREE.AmbientLight( 0xffffff, 0.1 );
    this.lights[0].position.set( -1000, 1500, 1000 );
    this.lights[1].position.set( 1000, 3000, 1000 );
    this.app.scene.add(this.mesh);
    this.lights.forEach(light => this.app.scene.add(light));
  }

  getTargetGeometry(sphereGeometry, boxGeometry) {
    const bufferGeometry = new THREE.BufferGeometry();
    const targetPositions = new Float32Array(sphereGeometry.attributes.position.array.length);
    for (let i = 0; i < sphereGeometry.attributes.position.array.length; i+=sphereGeometry.attributes.position.itemSize) {
      const x = sphereGeometry.attributes.position.array[i];
      const y = sphereGeometry.attributes.position.array[i + 1];
      const z = sphereGeometry.attributes.position.array[i + 2];
      let minDistance = null;
      for (let j = 0; j < boxGeometry.attributes.position.array.length; j+=boxGeometry.attributes.position.itemSize) {
        const xTarget = boxGeometry.attributes.position.array[j];
        const yTarget = boxGeometry.attributes.position.array[j + 1];
        const zTarget = boxGeometry.attributes.position.array[j + 2];
        const distance = distanceBetweenPoints(x, y, z, xTarget, yTarget, zTarget);
        if (!minDistance || minDistance > distance) {
          targetPositions[i] = xTarget;
          targetPositions[i+1] = yTarget;
          targetPositions[i+2] = zTarget;
          minDistance = distance;
        }
      }
    }
    bufferGeometry.addAttribute( 'position', new THREE.BufferAttribute( targetPositions, 3 ) );
    return bufferGeometry;
  }

  update(delta) {
    this.mesh.material.uniforms.uTime.value += delta;
  }
}