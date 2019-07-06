uniform sampler2D uMap;

uniform vec3 uFogColor;
uniform float uFogNear;
uniform float uFogFar;

varying vec2 vUv;

void main() {

    float depth = gl_FragCoord.z / gl_FragCoord.w;
    float fogFactor = smoothstep( uFogNear, uFogFar, depth );

    gl_FragColor = texture2D( uMap, vUv );
    gl_FragColor.w *= pow( gl_FragCoord.z, 20.0 );
    gl_FragColor = mix( gl_FragColor, vec4( uFogColor, gl_FragColor.w ), fogFactor );

}