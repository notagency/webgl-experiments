varying vec2 vUv;

void main() {
    float alpha = 1.0;
    alpha = mix(0.0, 1.0, cos(vUv.y));
	vec4 color = vec4(1.0, 1.0, 1.0, alpha);
	gl_FragColor = color;
}