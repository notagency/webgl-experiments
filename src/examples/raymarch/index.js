import * as THREE from 'three';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer';
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";

const glslify = require('glslify');

export default class {
  constructor(app) {
    this.app = app;
    const [width, height] = this.app.getContainerSize();

    const geometry = new THREE.BoxGeometry(50, 50, 50);

    const material = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load( 'textures/crate.gif' )
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.app.scene.add(this.mesh);

    this.aspect = width / height;
    this.composer = new EffectComposer( this.app.renderer );

    // const renderPass = new RenderPass(this.app.scene, this.app.camera);
    // renderPass.renderToScreen = true;
    // this.composer.addPass(renderPass);

    const raymarch = new ShaderPass(this.raymarchShader.call(this), 'uDiffuse');
    raymarch.renderToScreen = true;
    this.composer.addPass(raymarch);


  }

  draw() {
    this.composer.render();
  }

  raymarchShader() {
    return {
      uniforms: {
        uDiffuse: new THREE.Uniform(null),
        uAspect: new THREE.Uniform(this.aspect)
      },
      vertexShader: glslify(require('./shaders/default.vert')),
      fragmentShader: glslify(require('./shaders/default.frag')),
    }
  }

}