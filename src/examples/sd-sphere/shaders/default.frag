varying vec2 vUv;

float sdSphere(vec2 p, float radius) {
    return length(p) - radius;
}

void main() {
    vec2 uv = vUv;
    uv = uv * 2.0 - 1.0; // точка (0,0) теперь в центре вьюпорта, и (-1,-1) < uv < (1,1)

    float alpha = 1.0;
    vec2 position = vec2(0.0, 0.0);
    float color = sdSphere(uv + position, 0.1); // вычисляем длину вектора uv в текущей точке
    color = (color - 1.0) * -1.0; // инвертируем цвет чтобы по центру была точка (1,1), а с краев (0,0)

    gl_FragColor.rgb = vec3(color);
    gl_FragColor.a = alpha;
}