import 'three';
import 'three-examples/controls/TrackballControls';

import 'three-examples/shaders/CopyShader';
import 'three-examples/shaders/SobelOperatorShader';

import 'three-examples/postprocessing/EffectComposer';
import 'three-examples/postprocessing/RenderPass';
import 'three-examples/postprocessing/ShaderPass';

import OrbitControls from 'threejs-orbit-controls';

import BufferGeometrySimple from './buffer-geometry-simple/';
import BufferGeometryIndices from './buffer-geometry-indices/';
import Box from './box/';
import Particles from './particles/';
import BoxTextured from './box-textured/';
import Cubemap from './cubemap/';
import CubemapDayNight from './cubemap-daynight/';
import DropLogo from './drop-logo/';
import EasingInJS from './easing-in-js/';
import EasingInShader from './easing-in-shader/';
import WireFrameVsTexture from './wireframe-vs-texture';
import Airplane from './airplane';
import House from './house';
import MeshLineExample from './mesh-line';

export default class WebGLView {

	constructor(app) {
		this.app = app;

		this.initThree();
    this.initObjects();
    this.initPresets();
		this.initControls();
		this.initPostProcessing();
	}

	initThree() {
		this.scene = new THREE.Scene();

		this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
		this.camera.position.z = 300;

		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

		this.clock = new THREE.Clock();
	}

  initObjects() {
    this.box = new Box(this);
    this.boxTextured = new BoxTextured(this);
    this.bufferGeometrySimple = new BufferGeometrySimple(this);
    this.bufferGeometryIndices = new BufferGeometryIndices(this);
    this.cubemap = new Cubemap(this);
    this.cubemapDayNight = new CubemapDayNight(this);
    this.particles = new Particles(this);
    this.dropLogo = new DropLogo(this);
    this.easingInJS = new EasingInJS(this);
    this.easingInShader = new EasingInShader(this);
    this.wireframeVsTexture = new WireFrameVsTexture(this);
    this.airplane = new Airplane(this);
    this.house = new House(this);
    this.meshLine = new MeshLineExample(this);
  }

  initPresets() {
    this.presets = [
      'Day & night',
      'Billion particles',
      'Mesh line',
      'House'
    ];
    this.currentPresetIndex = 3;
    this.updatePreset()
  }

	initControls() {
    this.controls = new OrbitControls(this.camera);
	}

	initPostProcessing() {
		this.composer = new THREE.EffectComposer(this.renderer);

		const renderPass = new THREE.RenderPass(this.scene, this.camera);
		// renderPass.renderToScreen = true;
		this.composer.addPass(renderPass);

		const sobelPass = new THREE.ShaderPass(THREE.SobelOperatorShader);
		sobelPass.renderToScreen = true;
		this.composer.addPass(sobelPass);
		this.sobelPass = sobelPass;
	}

	// ---------------------------------------------------------------------------------------------
	// PUBLIC
	// ---------------------------------------------------------------------------------------------

	update() {
    const delta = this.clock.getDelta();

    if (this.cubemapDayNight.enabled) this.cubemapDayNight.update(delta);
    if (this.easingInShader.enabled) this.easingInShader.update(delta);
    if (this.dropLogo.enabled) this.dropLogo.update(delta);

		if (this.controls) this.controls.update();
	}

	draw() {
		if (this.composer && this.composer.enabled) this.composer.render();
		else this.renderer.render(this.scene, this.camera);
	}

	// ---------------------------------------------------------------------------------------------
	// EVENT HANDLERS
	// ---------------------------------------------------------------------------------------------

	resize() {
		if (!this.renderer) return;
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();

		this.fovHeight = 2 * Math.tan((this.camera.fov * Math.PI) / 180 / 2) * this.camera.position.z;

		this.renderer.setSize(window.innerWidth, window.innerHeight);

		this.composer.setSize(window.innerWidth, window.innerHeight);
		this.sobelPass.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
	}

	onInteractiveDown(e) {
	  if (this.dropLogo.enabled) this.dropLogo.onInteractiveDown(e);
    if (this.easingInJS.enabled)   this.easingInJS.onInteractiveDown(e);
    if (this.easingInShader.enabled)   this.easingInShader.onInteractiveDown(e);
  }

  updatePreset() {
    this.box.disable();
    this.boxTextured.disable();
    this.bufferGeometrySimple.disable();
    this.bufferGeometryIndices.disable();
    this.cubemap.disable();
    this.cubemapDayNight.disable();
    this.particles.disable();
    this.house.disable();
    this.meshLine.disable();

    switch (this.currentPresetIndex) {
      case 0: // day & night
        this.boxTextured.enable();
        this.cubemapDayNight.enable();
        break;
      case 1: // particles
        this.particles.enable();
        break;
      case 2: // mesh line
        this.meshLine.enable();
        break;
      case 3: // house
        this.house.enable();
        break;
      case 4: // dev
        // this.easingInJS.enable();
        // this.easingInShader.enable();
        // this.dropLogo.enable();
        // this.wireframeVsTexture.enable();
        this.airplane.enable();
        break;
    }
  }
}
