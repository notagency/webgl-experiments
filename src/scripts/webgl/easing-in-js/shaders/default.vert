uniform float uAnimation;

attribute vec3 offset;
attribute vec3 positionTo;
attribute float animationDelay;

float getTotalDistance() {
    float fromPositionY = position.y + offset.y;
    float toPositionY = positionTo.y;
    // дистанция, которую необходимо преодалеть частичке по оси Y, вычисляется как:
    // модуль от разности стартовой позиции (~100) и позиции назначения (0)
    return abs(toPositionY - fromPositionY);
}

float getPassedDistance() {
    // uAnimation изменяется от 0 до 1 и по сути является процентом выполненной анимации
    float distancePassedPercent = uAnimation;
    return getTotalDistance() * distancePassedPercent;
}

vec3 getPosition() {
    vec3 newPosition = position + offset;
    // вычисляем уже "пройденное" расстояние частички в соответствии с uAnimation
    newPosition.y -= getPassedDistance();
    return newPosition;
}

void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4(getPosition(), 1.0);
}
