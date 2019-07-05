import App from './App';

import CubemapDayNight from './examples/cubemap-daynight/';
import Airplane from './examples/airplane';
import BufferGeometrySimple from './examples/buffer-geometry-simple/';
import BufferGeometryIndices from './examples/buffer-geometry-indices/';
import Box from './examples/box/';
import Particles from './examples/particles/';
import BoxTextured from './examples/box-textured/';
import Cubemap from './examples/cubemap/';
import DropLogo from './examples/drop-logo/';
import EasingInJS from './examples/easing-in-js/';
import EasingInShader from './examples/easing-in-shader/';
import WireFrameVsTexture from './examples/wireframe-vs-texture';
import House from './examples/house';
import MeshLine from './examples/mesh-line';
import SphereToCubeMorph from './examples/sphere-to-cube-morph';
import CellDivision from './examples/cell-division';

new App({
  examples: {
    CubemapDayNight,
    CellDivision,
    House,
  },
  sketches: {
    MeshLine,
    // Airplane,
    // BufferGeometrySimple,
    // BufferGeometryIndices,
    // Box,
    Particles,
    BoxTextured,
    // Cubemap,
    // DropLogo,
    EasingInJS,
    EasingInShader,
    WireFrameVsTexture,
    SphereToCubeMorph,
  },
});