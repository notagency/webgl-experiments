uniform float uTime;

attribute vec3 offset;
attribute vec3 positionTo;
attribute float animationDelay;

#pragma glslify: bounceOut = require(glsl-easings/bounce-out)

float getTotalDistance() {
    float fromPositionY = position.y + offset.y;
    float toPositionY = positionTo.y;
    // дистанция, которую необходимо преодалеть частичке по оси Y, вычисляется как:
    // модуль от разности стартовой позиции (~100) и позиции назначения (0)
    return abs(toPositionY - fromPositionY);
}

float getPassedDistance() {
    // uAnimation изменяется от 0 до 1 и по сути является процентом выполненной анимации
    float distancePassedPercent = min(uTime - animationDelay, 1.0);
    return getTotalDistance() * bounceOut(distancePassedPercent);
}

vec3 getPosition() {
    vec3 newPosition = position + offset;
    if (uTime > animationDelay) {
        newPosition.y -= getPassedDistance();
    }
    return newPosition;
}

void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4(getPosition(), 1.0);
}
