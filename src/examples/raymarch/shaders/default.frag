uniform float uAspect;

varying vec2 vUv;

vec3 HeatMapColor(float value, float minValue, float maxValue){
    float percents = value / (maxValue - minValue);
    return vec3(percents, 1.0 - percents, 0.0);
}

float opUnion( float d1, float d2 ) {
    return min(d1,d2);
}

float opSmoothUnion( float d1, float d2, float k ) {
    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h);
}

float sdSphere(vec3 p, float radius) {
    return length(p) - radius;
}

float scene(vec3 p) {
    vec3 sphere1pos = vec3(2.0, 0.0, 0.0);
    float sphere1 = sdSphere(p + sphere1pos, 0.7);
    vec3 sphere2pos = vec3(0.0, 0.0, 3.0);
    float sphere2 = sdSphere(p + sphere2pos, 0.7);

    return opSmoothUnion(sphere1, sphere2, 2.0);
}

// the actual raymarching from:
// https://github.com/stackgl/glsl-raytrace/blob/master/index.glsl
vec2 raymarching(vec3 rayOrigin, vec3 rayDir) {
    float accuracy = 0.01; // погрешность при которой считаем что луч достигнул поверхности
    float maxDistance = 15.0; // максимальная дистанция луча

    float latest = accuracy * 2.0; // последняя точка нахождения луча
    float dist = 0.0; // текущая дистанция
    vec2 res = vec2(-1.0, maxDistance);
    float closest = maxDistance; // расстояние до ближайшего объекта

    const int maxRaySteps = 64; // максимальное количество шагов луча

    for (int i = 0; i < maxRaySteps; i++) {
        if (latest < accuracy || dist > maxDistance) break; // если луч достиг объекта или прошел мимо объекта...

        // Get the shortest distance to a point on the shape
        float result = scene(rayOrigin + rayDir * dist); // находим расстояние до ближайшего объекта
        latest = result;
        closest = min(closest, latest);

        dist += latest; // двигаем луч далее
    }

    res.x = mix(dist, -1.0, step(accuracy, latest)); // достигли объекта или нет

    // Closest it got - for halo
    res.y = closest;

    return res;
}

//https://github.com/stackgl/glsl-look-at/blob/gh-pages/index.glsl
mat3 calcLookAtMatrix(vec3 origin, vec3 target, float roll) {
    vec3 rr = vec3(sin(roll), cos(roll), 0.0);
    vec3 ww = normalize(target - origin);
    vec3 uu = normalize(cross(ww, rr));
    vec3 vv = normalize(cross(uu, ww));
    return mat3(uu, vv, ww);
}

//https://github.com/stackgl/glsl-camera-ray
vec3 getRay(mat3 camMat, vec2 uv, float lensLength) {
    return normalize(camMat * vec3(uv, lensLength));
}
vec3 getRay(vec3 origin, vec3 target, vec2 uv, float lensLength) {
    mat3 camMat = calcLookAtMatrix(origin, target, 0.0);
    return getRay(camMat, uv, lensLength);
}

void main() {

    vec3 color = vec3(0.1);
    vec2 uv = vUv;
    uv = uv * 2.0 - 1.0; // точка (0,0) теперь в центре вьюпорта, и (-1,-1) < uv < (1,1)
    uv *= vec2(uAspect, 1.0);

    float alpha = 1.0;
    float cameraAngle = 1.0;
    float cameraRadius = 8.0; // smaller is larger pov
    float lensLength = 3.0;
    vec2 position = vec2(0.0, 0.0);
    vec3 rayOrigin = vec3(cameraRadius * sin(cameraAngle), 0.0, cameraRadius * cos(cameraAngle));
    vec3 rayTarget = vec3(0.0, 0.0, 0.0);
    vec3 rayDirection = getRay(rayOrigin, rayTarget, uv, lensLength);

    vec2 collision = raymarching(rayOrigin, rayDirection);

    if (collision.x > -0.5) {
        vec3 pos = rayOrigin + rayDirection * collision.x;
        color = rayOrigin + rayDirection + sin(vec3(collision.x - 1.0));
        color = vec3 (HeatMapColor(collision.x - 8.0, 0.0, 2.0));
    }

    gl_FragColor.rgb = color;
    gl_FragColor.a = alpha;
}