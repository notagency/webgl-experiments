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
	float animationSpeed = 0.5; // the more value, the faster animation

	color = mix(night, day, sin(uTime * animationSpeed) * 0.5 + 0.5);

	gl_FragColor = color;
}