// uniform sampler2D uTexture;
varying vec2 vUv;
varying vec3 vColor;

void main() {
	vec2 uv = vUv;
    vec4 color;
	color = vec4(uv, 0.0, 1.0);

	// color = texture2D(uTexture, uv);

	gl_FragColor = color;
}