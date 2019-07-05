precision mediump float;

uniform samplerCube uCubeTexture;
varying vec3 vPosition;

void main() {
	vec3 position = vPosition;
    vec4 color;

	color = textureCube(uCubeTexture, position);

	gl_FragColor = color;
}