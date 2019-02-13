import {random} from '../../utils/math.utils';

const glslify = require('glslify');

export default class {
  constructor(webGl) {
    this.webGl = webGl;
    this.webGl.camera.position.z = 900;

    this.particlesAmount = 0;

    const geometry = new THREE.InstancedBufferGeometry();

    const size = 1;
    const positions = [
      0.0,  0.0,  0.0,
      size, 0.0,  0.0,
      0.0,  size, 0.0,
      size, size, 0.0
    ];
    geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));

    geometry.addAttribute('positionTo', new THREE.BufferAttribute(new Float32Array(positions), 3));

    const indices = [
      0, 1, 3,
      0, 3, 2,
    ];
    geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indices), 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { type: 'f', value: 0 }
      },
      vertexShader: glslify(require('./shaders/default.vert')),
      fragmentShader: glslify(require('./shaders/default.frag')),
    });


    this.enabled = false;
    this.animationStarted = false;
    this.mesh = new THREE.Mesh(geometry, material);
    this.loadTexture(() => {
      const y = -this.height;
      this.mesh.geometry.attributes.positionTo.array = new Float32Array([
        0, y, 0,
        0, y, 0,
        0, y, 0,
        0, y, 0
      ]);
      this.mesh.geometry.attributes.positionTo.needsUpdate = true;
      this.initAnimationDelay();
      this.centerImage();
    });
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

  loadTexture(onLoad = () => {}) {
    const loader = new THREE.TextureLoader();
    loader.load('textures/logo-small-dark.png', (texture) => {
      this.texture = texture;
      this.texture.minFilter = THREE.LinearFilter;
      this.texture.magFilter = THREE.LinearFilter;
      this.texture.format = THREE.RGBFormat;
      this.width = texture.image.width;
      this.height = texture.image.height;
      const img = this.texture.image;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = this.width;
      canvas.height = this.height;
      // canvas.style.position   = "fixed";
      // canvas.style.bottom     = "0";
      // canvas.style.right      = "0";
      // canvas.style.background = "#2B2B2B";
      document.querySelector('.container').appendChild(canvas);

      ctx.scale(1, -1);
      ctx.drawImage(img, 0, 0, this.width, this.height * -1);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height); //rgba
      this.addParticles(imgData);

      onLoad();
    })
  }

  addParticles(imgData) {

    const threshold = 34;
    const originalColors = Float32Array.from(imgData.data);

    this.particlesAmount = originalColors.length / 4;

    const offsets = [];
    const colors = [];
    for (let i = 0; i < this.particlesAmount ; i++) {
      const redColor = originalColors[i * 4];
      const greenColor = originalColors[i * 4 + 1];
      const blueColor = originalColors[i * 4 + 2];
      if (redColor > threshold) {
        offsets.push((i % (this.width))); // x (changes from 0 to (this.width - 1) and then starts over again)
        offsets.push(Math.floor(i / (this.width))); // y (increments when i >= this.width)
        offsets.push(0); // z

        colors.push(redColor / 255);
        colors.push(greenColor / 255);
        colors.push(blueColor / 255);
      }
    }

    this.mesh.geometry.addAttribute('offset', new THREE.InstancedBufferAttribute(new Float32Array(offsets), 3, false));
    this.mesh.geometry.addAttribute('color', new THREE.InstancedBufferAttribute(new Float32Array(colors), 3, false));
  }

  onInteractiveDown(e) {
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
    const animationDelay = [];
    for (let i = 0; i < this.particlesAmount; i++) {
      animationDelay.push((i / 10000) * random(0.5, 1));
    }
    this.mesh.geometry.addAttribute('animationDelay', new THREE.InstancedBufferAttribute(new Float32Array(animationDelay), 1, false))
  }

  centerImage() {
    this.mesh.geometry.translate(-this.width / 2, -this.height / 2, 0);
  }
}