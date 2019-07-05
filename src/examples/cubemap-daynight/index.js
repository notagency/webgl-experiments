import * as THREE from 'three';
import {TGALoader} from "three/examples/jsm/loaders/TGALoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader2 } from "three/examples/jsm/loaders/OBJLoader2";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { SobelOperatorShader } from "three/examples/jsm/shaders/SobelOperatorShader";
import * as dat from 'dat.gui';

const glslify = require('glslify');

export default class {

  constructor(app) {
    this.app = app;
    this.settings = {
      wireframe: false,
      postProcessing: false,
      lowerGear: true,
      gearPosition: {
        up: 3,
        down: 0
      }
    };

    this.renderCubeBox();
    this.renderAirplane();
    this.renderGui();
    this.initPostProcessing();
  }

  renderCubeBox() {
    const geometry = new THREE.BoxGeometry(1024, 1024, 1024);

    const nightTexture = this.loadTexture('grimmnight');
    const dayTexture = this.loadTexture('miramar');

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uNightTexture: { type: 't', value: nightTexture },
        uDayTexture: { type: 't', value: dayTexture },
        uTime: { type: 'f', value: 0 }
      },
      vertexShader: glslify(require('./shaders/default.vert')),
      fragmentShader: glslify(require('./shaders/default.frag')),
      side: THREE.BackSide
    });

    this.cubeBox = new THREE.Mesh(geometry, material);
    this.app.scene.add(this.cubeBox);
  }

  renderAirplane() {
    new MTLLoader()
      .setPath('textures/boeing757/')
      .load('airliner_757_base_colour.mtl', (materials) => {

        materials.preload();
        const objLoader = new OBJLoader2();
        objLoader.addMaterials(materials.materials);
        objLoader.load('models/airliner_757_base_colour.obj', (object) => {
          this.plane = object;
          this.plane.position.y = 10;
          this.plane.scale.set(2, 2, 2);
          this.plane.rotateX(THREE.Math.degToRad(0));
          this.plane.rotateY(THREE.Math.degToRad(45));
          this.app.scene.add(object);

          this.light = new THREE.DirectionalLight(0xffffff, 1);
          this.light.position.y = 500;
          this.light.position.x = 300;
          this.app.scene.add(this.light);

          this.light2 = new THREE.DirectionalLight(0xffffff, 1);
          this.light2.position.y = 300;
          this.light2.position.x = -300;
          this.app.scene.add(this.light2);

          this.planeLight = new THREE.PointLight(0xfff000, 1, 0);
          this.planeLight.position.y = -10;
          this.app.scene.add(this.planeLight);
        })
      });
  }

  renderGui() {
    this.gui = new dat.GUI();
    this.gui.add(this.settings, 'wireframe').onChange(this.onChangeMaterial);
    this.gui.add(this.settings, 'postProcessing');
    this.gui.add(this.settings, 'lowerGear');
  }

  initPostProcessing() {
    this.composer = new EffectComposer(this.app.renderer);

    const renderPass = new RenderPass(this.app.scene, this.app.camera);
    // renderPass.renderToScreen = true;
    this.composer.addPass(renderPass);

    const sobelPass = new ShaderPass(SobelOperatorShader);
    sobelPass.renderToScreen = true;
    this.composer.addPass(sobelPass);
    this.sobelPass = sobelPass;

    const [width, height] = this.app.getContainerSize();

    this.composer.setSize(width, height);
    this.sobelPass.uniforms.resolution.value.set(width, height);
  }

  onChangeMaterial = () => {
    this.plane.children.forEach((mesh) => {
      if (mesh.material.length > 0) {
        mesh.material.forEach((material) => material.wireframe = this.settings.wireframe);
      } else {
        mesh.material.wireframe = this.settings.wireframe;
      }
    })
  }

  loadTexture(textureName) {
    const cubeTexture = (new THREE.CubeTexture());
    for (let i = 0; i < 6; i++) {
      cubeTexture.images.push(new Image());
    }
    const onLoad = (texture, index) => {
      cubeTexture.images[index] = texture.image;
      cubeTexture.needsUpdate = true;
    };
    this.loader = new TGALoader();
    this.loader.setPath('textures/cubemap/');
    this.loader.load( `${textureName}/${textureName}_ft.tga`, (texture) => onLoad(texture, 0) ); // nz = negativeZ = front side
    this.loader.load( `${textureName}/${textureName}_bk.tga`, (texture) => onLoad(texture, 1) ); // pz = positiveZ = back side
    this.loader.load( `${textureName}/${textureName}_up.tga`, (texture) => onLoad(texture, 2) ); // py = positiveY = top side
    this.loader.load( `${textureName}/${textureName}_dn.tga`, (texture) => onLoad(texture, 3) ); // ny = negativeY = bottom side
    this.loader.load( `${textureName}/${textureName}_rt.tga`, (texture) => onLoad(texture, 4) ); // px = positiveX = right side
    this.loader.load( `${textureName}/${textureName}_lf.tga`, (texture) => onLoad(texture, 5) ); // nx = negativeX = left side
    return cubeTexture;
  }

  draw() {
    if (this.settings.postProcessing) {
      this.composer.render();
    } else {
      this.app.renderer.render(this.app.scene, this.app.camera);
    }
  }

  update() {
    this.cubeBox.material.uniforms.uTime.value = this.app.clock.elapsedTime;
    if (this.cubeBox) {
      this.cubeBox.rotation.y += 0.0001;
    }
    if (this.light2) {
      this.light2.intensity = Math.sin(this.app.clock.elapsedTime * 0.2) * 0.5 + 0.5;
    }
    if (this.planeLight) {
      this.planeLight.intensity = Math.sin(this.app.clock.elapsedTime) * 0.5 + 0.5;
    }
    if (this.plane) {
      this.plane.position.y += Math.sin(this.app.clock.elapsedTime * 0.2) / 50;
      this.plane.position.z += Math.cos(this.app.clock.elapsedTime * 0.2) / 20;
      this.plane.rotateZ(THREE.Math.degToRad(Math.cos(this.app.clock.elapsedTime * 0.2) * 0.03));

      if (this.settings.lowerGear) {
        this.plane.children[1].position.y -= 0.01;
        this.plane.children[1].position.y = Math.max(this.plane.children[1].position.y, this.settings.gearPosition.down)
      } else {
        this.plane.children[1].position.y += 0.01;
        this.plane.children[1].position.y = Math.min(this.plane.children[1].position.y, this.settings.gearPosition.up)
      }
    }
  }

  onDestroy() {
    this.gui.destroy();
  }

}