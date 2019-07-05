import ControlKit from '@brunoimbrizi/controlkit';
import Stats from 'stats.js';

export default class GUIView {

	constructor(app) {
		this.app = app;

		this.postProcessing = false;
		this.wireframe = false;
		this.doubleSide = false;

		this.initControlKit();
		this.initStats();

		this.disable();
	}

	initControlKit() {
		this.controlKit = new ControlKit();
		this.controlKit
      .addPanel({ width: 300, enable: false })
      .addGroup({label: 'Presets', enable: true })
      .addSelect(this.app.webgl, 'presets', {
        label: 'preset',
        selected: this.app.webgl.currentPresetIndex,
        onChange: (index) => this.onPresetChange(index)
      })
      .addGroup({label: 'Texture', enable: true })
      .addCheckbox(this, 'wireframe', { label: 'wireframe', onChange: () => this.onWireframeChange() })
      .addCheckbox(this, 'doubleSide', { label: 'double side', onChange: () => this.onDoubleSideChange() })
		  .addGroup({label: 'Post Processing', enable: true })
		  // .addSlider(this, 'postOpacity', 'range', { label: 'opacity', onChange: () => { this.onPostProcessingChange(); } })
		  .addCheckbox(this, 'postProcessing', { label: 'post processing', onChange: () => this.onPostProcessingChange() })
	}

	initStats() {
		this.stats = new Stats();

		document.body.appendChild(this.stats.dom);
	}

	// ---------------------------------------------------------------------------------------------
	// PUBLIC
	// ---------------------------------------------------------------------------------------------

	enable() {
		// this.controlKit.enable();
		if (this.stats) this.stats.dom.style.display = '';
	}

	disable() {
		// this.controlKit.disable();
		if (this.stats) this.stats.dom.style.display = 'none';
	}

	toggle() {
		if (this.controlKit._enabled) this.disable();
		else this.enable();
	}

  onPresetChange(index) {
    if (!this.app.webgl.presets) return;
    this.app.webgl.currentPresetIndex = index;
    this.app.webgl.updatePreset();
    this.onWireframeChange();
    this.onDoubleSideChange();
  }

	onPostProcessingChange() {
		if (!this.app.webgl.composer) return;
		this.app.webgl.composer.enabled = this.postProcessing;
	}

  onWireframeChange() {
    this.app.webgl.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.wireframe = this.wireframe;
        child.material.needsUpdate = true;
      }
    })
  }

  onDoubleSideChange() {
    this.app.webgl.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.side = this.doubleSide ? THREE.DoubleSide : THREE.FrontSide;
        child.material.needsUpdate = true;
      }
    })
  }

}
