precision mediump float;

uniform samplerCube uNightTexture;
uniform samplerCube uDayTexture;
uniform float uTime;
varying vec3 vPosition;

void main() {
	vec3 position = vPosition;
    vec4 color;

	vec4 night = textureCube(uNightTexture, position);
	vec4 day = textureCube(uDayTexture, position);

	color = mix(night, day, sin(uTime * 0.1) * 0.5 + 0.5);

	gl_FragColor = color;
}