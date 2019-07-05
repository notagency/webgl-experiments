import * as THREE from 'three';
import Stats from 'stats.js';
import OrbitControls from "threejs-orbit-controls";
import Menu from './Menu';

export default class App {

	constructor({examples, sketches}) {
	  this.currentScene = null;
    this.initThree();
    this.initMenu({examples, sketches});
    this.initControls();

    this.initStats();
    this.addListeners();
    this.animate();
    this.resize();
	}

	initMenu({examples, sketches}) {
    new Menu(this, {examples});
    new Menu(this, {sketches});
    document.querySelector('button').click();
  }

  initThree() {
    this.scene = new THREE.Scene();

    this.initCamera();

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(2);
    this.clock = new THREE.Clock();
    document.getElementById('container')
      .appendChild(this.renderer.domElement)
      .addEventListener('click', this.onClick);
  }

  initCamera() {
    const [width, height] = this.getContainerSize();
    this.camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000);
    this.camera.position.z = 300;
  }

  initControls() {
    this.controls = new OrbitControls(this.camera);
  }

	initStats() {
    this.stats = new Stats();
    document.getElementById('stats').appendChild(this.stats.dom);
  }

  clearThree() {
    this.disposeObject(this.scene);
    this.initCamera();
    this.initControls();
  }

  getContainerSize() {
	  const {offsetWidth, offsetHeight} = document.getElementById('container');
	  return [offsetWidth, offsetHeight];
  }

  disposeObject(object) {
    while (object.children.length > 0){
      this.disposeObject(object.children[0]);
      object.remove(object.children[0]);
    }
    if (object.geometry) object.geometry.dispose();
    if (object.material) this.disposeMaterial(object.material);
    if (object.texture) object.texture.dispose();
  }

  disposeMaterial(material) {
	  if (material.length > 0) {
      material.forEach((m) => m.dispose());
    } else {
      material.dispose();
    }
  }

	addListeners() {
		this.handlerAnimate = this.animate.bind(this);

		window.addEventListener('resize', this.resize);
	}

  changeScene(Scene) {
	  this.clearThree();
	  if (this.currentScene && typeof this.currentScene.onDestroy === 'function') {
      this.currentScene.onDestroy();
    }
    this.currentScene = new Scene(this);
  }

	animate() {
		this.update();
		this.draw();

		this.raf = requestAnimationFrame(this.handlerAnimate);
	}

	update() {
		this.stats.begin();
    const delta = this.clock.getDelta();
    if (this.currentScene && typeof this.currentScene.update === 'function') {
      this.currentScene.update(delta);
    }
    if (this.controls) this.controls.update();

  }

	draw() {
    if (this.currentScene && typeof this.currentScene.draw === 'function') {
      this.currentScene.draw();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
    this.stats.end();
	}

	resize = () => {
    if (!this.renderer) return;
    const [width, height] = this.getContainerSize();
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.fovHeight = 2 * Math.tan((this.camera.fov * Math.PI) / 180 / 2) * this.camera.position.z;

    this.renderer.setSize(width, height);
	}

  onClick = (e) => {
	  if (typeof this.currentScene.onClick === 'function') {
      this.currentScene.onClick(e);
    }
  }
}
