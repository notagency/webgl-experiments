import * as THREE from 'three';
import { MeshLine, MeshLineMaterial } from 'three.meshline';
import { OBJLoader2 } from "three/examples/jsm/loaders/OBJLoader2";

export default class {
  constructor(app) {
    this.app = app;

    const resolution = new THREE.Vector2( window.innerWidth, window.innerHeight );

    const material = new MeshLineMaterial( {
      // map: THREE.ImageUtils.loadTexture( 'assets/stroke.png' ),
      useMap: false,
      color: new THREE.Color(0x5ca4a9),
      opacity: .5,
      resolution: resolution,
      sizeAttenuation: false,
      lineWidth: 10,
      // near: camera.near,
      // far: camera.far,
      depthWrite: false,
      depthTest: false,
      transparent: true
    });

    const objLoader = new OBJLoader2();
    objLoader.load( 'models/house.obj', (source) => {

      let total = 0;
      source.children.forEach( function( o ) {
        total += o.geometry.attributes.position.count;
      });
      const g = new THREE.BufferGeometry();
      g.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( total * 3 ), 3 ) );

      let offset = 0;
      source.children.forEach( function( o ) {
        g.merge( o.geometry, offset );
        offset += o.geometry.attributes.position.count;
      });

      g.center( g );

      const o = new THREE.Mesh( g, new THREE.MeshNormalMaterial() );
      this.app.scene.add( o );

      const raycaster = new THREE.Raycaster();

      const vertices = [];

      let y = -200;
      let a = 0;
      const r = 1000;
      const origin = new THREE.Vector3();
      let direction = new THREE.Vector3();
      for( let j = 0; j < 6000; j++ ) {
        a += .1;
        y += .075;
        origin.set( r * Math.cos( a ), y, r * Math.sin( a ) );
        direction.set( -origin.x, 0, -origin.z );
        direction = direction.normalize();
        raycaster.set( origin, direction );

        const i = raycaster.intersectObject( o, true );
        if( i.length ) {
          vertices.push( i[ 0 ].point.x, i[ 0 ].point.y, i[ 0 ].point.z );
        }
      }

      this.app.scene.remove( o );

      const meshLine = new MeshLine();
      meshLine.setGeometry(vertices, (vertex) => vertex);
      this.mesh = new THREE.Mesh( meshLine.geometry, material );
      this.app.scene.add(this.mesh);
      this.app.camera.position.z = 900;

    });
  }
}