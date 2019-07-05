attribute vec3 offset;
attribute vec3 color;

varying vec2 vUv;
varying vec3 vColor;

void main() {
	vUv = uv;
	vColor = color;


	vec3 mvPosition = offset + position;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(mvPosition, 1.0);
}
