attribute vec3 targetPosition;
uniform float uTime;
varying vec2 vUv;

void main() {
	vUv = uv;

    vec3 morphed = vec3( 0.0 , 0.0 , 0.0 );
    float animationSpeed = 0.3;
    float morphProgress = sin(uTime * animationSpeed) * 0.5 + 0.5;
    morphed += ( targetPosition - position ) * morphProgress;
    morphed += position;

	gl_Position = projectionMatrix * modelViewMatrix * vec4(morphed, 1.0);
}
