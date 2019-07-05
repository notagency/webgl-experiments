uniform float uTime;

attribute vec3 offset;
attribute vec3 color;
attribute vec3 positionTo;
attribute float animationDelay;

varying vec3 vColor;

#pragma glslify: ease = require(glsl-easings/cubic-in)

float getTotalDistance() {
    float fromPositionY = position.y + offset.y;
    float toPositionY = positionTo.y;
    // дистанция, которую необходимо преодалеть частичке по оси Y, вычисляется как:
    // модуль от разности стартовой позиции (~100) и позиции назначения (0)
    return abs(toPositionY - fromPositionY);
}

// Возвращает уже пройденное расстояние частицей
float getPassedDistance() {
    // uAnimation изменяется от 0 до 1 и по сути является процентом выполненной анимации
    float distancePassedPercent = min((uTime * 1.5) - animationDelay, 1.0);
    return getTotalDistance() * ease(distancePassedPercent);
}

// Возвращает позицию вершины с учетом анимации
vec3 getPosition() {
    // получаем текущую позицию вершины
    vec3 newPosition = position + offset;

    // если таймер больше animationDelay - сдвигаем вершину вниз
    if (uTime > animationDelay) {
        newPosition.y -= getPassedDistance();
    }

    return newPosition;
}

void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4(getPosition(), 1.0);
	vColor = color;
}
