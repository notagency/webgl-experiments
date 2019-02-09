attribute vec3 offset;

void main() {
	vec3 mvPosition = offset + position;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(mvPosition, 1.0);
}
