import TweenLite from 'gsap';

const glslify = require('glslify');

export default class {
  constructor(webGl) {
    this.webGl = webGl;

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
      -25.0, 60.0, 0.0, // xyz of the center of each instance
      0.0,   50.0, 0.0,
      35.0,  90.0, 0.0,
    ];

    geometry.addAttribute('offset', new THREE.InstancedBufferAttribute(new Float32Array(offsets), 3, false));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uAnimation: { type: 'f', value: 0 },

      },
      vertexShader: glslify(require('./shaders/default.vert')),
      fragmentShader: glslify(require('./shaders/default.frag')),
    });

    this.enabled = false;
    this.animationStarted = false;
    this.mesh = new THREE.Mesh(geometry, material);
  }

  enable() {
    this.webGl.scene.add(this.mesh);
    this.enabled = true;
    return this;
  }

  disable() {
    this.webGl.scene.remove(this.mesh);
    this.enabled = false;
    return this;
  }

  onInteractiveDown() {
    if (this.animationStarted) {
      this.resetAnimation();
    } else {
      this.animate();
    }
  }

  animate() {
    this.animationStarted = true;
    const time = 1;
    TweenLite.to(this.mesh.material.uniforms.uAnimation, time, {overwrite: true, value: 1, ease: Bounce.easeOut });
  }

  resetAnimation() {
    this.animationStarted = false;
    this.mesh.material.uniforms.uAnimation.value = 0;
  }
}