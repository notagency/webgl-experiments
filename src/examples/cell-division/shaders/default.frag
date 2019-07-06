uniform float uAspect;
uniform float uTime;
uniform vec3 uRotation;
uniform float uStrength;
uniform vec4 uSphere1;
uniform vec4 uSphere2;
uniform float uFade;
uniform float uMode;
uniform float uClickTime;

varying vec2 vUv;

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

// vec2 matcap(vec3 eye, vec3 normal) {
//     vec3 reflected = reflect(eye, normal);
//     float m = 2.8284271247461903 * sqrt(reflected.z + 1.0);
//     return reflected.xy / m + 0.5;
// }

float sdSphere(vec3 p, float s) {
    return length(p) - s;
}

float opSmoothUnion(float d1, float d2, float k) {
    float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
    return mix(d2, d1, h) - k * h * (1.0 - h);
}

mat3 rotationMatrix3(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;

    return mat3(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c          );
}

void addSphere(inout float o, vec3 p, vec4 random) {
    float t = smoothstep(0.0, mix(0.8, 1.0, random.w * 0.5 + 0.5), uStrength + mix(1.5, 0.0, uFade));
    vec3 pos = random.xyz * 1.5 * mix(2.0, 1.0, uFade);
    float animationSpeed = (uTime - uClickTime) * random.w * 10.0;
    if (uMode == 1.0) {
        pos = min(random.xyz, animationSpeed);
    } else {
        pos = max(vec3(0.0), vec3(random.xyz - (animationSpeed)));
    }
    // pos.y = ((sin(uTime * 0.3)) * 0.5 + 0.5) * 1.8;
    // pos *= rotationMatrix3(normalize(random.zxy), uTime * random.z);

    float r = mix(0.0, mix(0.4, 0.9, random.w * 0.5 + 0.5), t);
    // r *= 1.0 + 0.2 * smoothstep(0.5, 1.2, sin(uTime * 6.0));
    o = opSmoothUnion(o, sdSphere(p - mix(vec3(0.0), pos, vec3(t)), r), 0.5);
}

float field(vec3 p) {

    // Add a bit of noise to the ray, more warpy
    // p.x += sin(p.y * 3.0 + p.z * 2.0 + uTime * 1.0 + 3.2) * 0.1 * (uStrength + mix(1.5, 0.0, uFade));
    // p.y += sin(p.x * 2.8 + p.z * 4.1 + uTime * 0.8 + 1.7) * 0.1 * (uStrength + mix(1.5, 0.0, uFade));
    // p.z += sin(p.y * 3.0 + p.x * 2.0 + uTime * 0.3 + 4.1) * 0.1 * (uStrength + mix(1.5, 0.0, uFade));
    // p.x += sin(p.y * 10.0 + uTime) * 0.1 * uStrength * smoothstep(0.5, 1.0, sin(uTime * 7.0));

    // float s = sin(uTime);
    // float c = sin(uTime + 2.34);

    float r = mix(1.7, 0.7, uStrength + mix(1.5, 0.0, uFade));
    // r *= 1.0 + 0.05 * smoothstep(0.5, 1.2, sin(uTime * 6.0));
    float o = sdSphere(p, r);
    addSphere(o, p, vec4(0.0, 2.0, 0.0, 0.3));
    addSphere(o, p, vec4(0.0, 0.0, 2.0, 0.6));
    addSphere(o, p, vec4(2.0, 2.0, 2.0, 0.3));
    // addSphere(o, p, uSphere2);
    // addSphere(o, p, uSpheres[2]);
    // addSphere(o, p, uSpheres[3]);
    // addSphere(o, p, uSpheres[4]);
    // addSphere(o, p, uSpheres[5]);
    // addSphere(o, p, uSpheres[6]);
    // addSphere(o, p, uSpheres[7]);
    return o;

}

//https://github.com/stackgl/glsl-sdf-normal
vec3 calcNormal(vec3 pos, float eps) {
    const vec3 v1 = vec3( 1.0,-1.0,-1.0);
    const vec3 v2 = vec3(-1.0,-1.0, 1.0);
    const vec3 v3 = vec3(-1.0, 1.0,-1.0);
    const vec3 v4 = vec3( 1.0, 1.0, 1.0);

    return normalize( v1 * field( pos + v1 * eps ) +
                      v2 * field( pos + v2 * eps ) +
                      v3 * field( pos + v3 * eps ) +
                      v4 * field( pos + v4 * eps ) );
}

const int steps = 50;

// the actual raymarching from:
// https://github.com/stackgl/glsl-raytrace/blob/master/index.glsl
vec2 raymarching(vec3 rayOrigin, vec3 rayDir) {
    float precis = 0.01;
    float maxd = 15.0;

    float latest = precis * 2.0;
    float dist = 0.0;
    vec2 res = vec2(-1.0, maxd);
    float closest = maxd;
    for (int i = 0; i < steps; i++) {
        if (latest < precis || dist > maxd) break;

        // Get the shortest distance to a point on the shape
        float result = field(rayOrigin + rayDir * dist);
        latest = result;
        closest = min(closest, latest);

        // Move that distance along the ray
        dist += latest;
    }

    // Hit or not
    res.x = mix(dist, -1.0, step(precis, latest));

    // Closest it got - for halo
    res.y = closest;

    return res;
}

float raymarchingBack(vec3 rayOrigin, vec3 rayDir) {
    float precis = 0.01;
    float maxd = 35.0;

    float latest = precis * 2.0;
    float dist = maxd;
    float res = -1.0;
    for (int i = 0; i < steps; i++) {
        if (latest < precis || dist < 0.0) break;

        // Get the shortest distance to a point on the shape
        float result = field(rayOrigin + rayDir * dist);
        latest = result;

        // Move that distance along the ray
        dist -= latest;
    }

    return mix(dist, -1.0,  step(precis, latest));
}

float getStripes(vec3 pos) {
    float t = abs(mod(pos.x * mix(5.0, 6.0, uStrength + mix(1.5, 0.0, uFade)) + sin(pos.z * 10.0 - uTime) * (uStrength + mix(1.5, 0.0, uFade)) * 0.3 + sin(pos.y * 8.3 + uTime * 4.0) * sin(pos.y * 4.34 + uTime * 1.8) * (uStrength + mix(1.5, 0.0, uFade)) * 0.2 + uTime * 1.0, 1.0) - 0.5);
    float line = smoothstep(0.1, 0.04, t);
    float halo = pow(smoothstep(0.5, 0.04, t), 2.0);
    return min(1.0, line + halo * 0.2);
}

void main() {
    vec3 color = vec3(0.0);
    float alpha = 1.0;

    float cameraAngle = uRotation.y;
    float cameraRadius = 8.0; // smaller is larger pov
    float lensLength = 3.0;
    vec2 uv = (2.0 * vUv - 1.0);
    uv *= vec2(uAspect, 1.0);
    vec3 rayOrigin = vec3(cameraRadius * sin(cameraAngle), 0.0, cameraRadius * cos(cameraAngle));
    vec3 rayTarget = vec3(0.0, 0.0, 0.0);
    vec3 rayDirection = getRay(rayOrigin, rayTarget, uv, lensLength);


    vec2 collision = raymarching(rayOrigin, rayDirection);
    // float collisionBack = raymarchingBack(rayOrigin, rayDirection);

    if (collision.x > -0.5) {
        vec3 pos = rayOrigin + rayDirection * collision.x;
        color = mix(color, vec3(1.0), getStripes(pos));
    }

    // if (collisionBack > -0.5) {
    //     vec3 pos = rayOrigin + rayDirection * collisionBack;
    //     vec3 nor = calcNormal(pos, 0.02);
    //     float backFade = smoothstep(0.0, 0.5, nor.b * 0.5 + 0.5);
    //     color = mix(color, vec3(1.0), getStripes(pos) * backFade);
    // }

    // Halo
    color += smoothstep(0.1, 0.0, collision.y) * 0.2;

    gl_FragColor.rgb = color * uFade;
    gl_FragColor.a = alpha;
}