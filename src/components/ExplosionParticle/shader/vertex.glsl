/*
* 自定义粒子shader
*/
attribute vec3 instanceColor;
attribute vec2 instanceLifeTime;
attribute vec3 instanceDirection;
attribute float instanceSpeed;
attribute vec3 instanceEndColor;

uniform float gravity;
uniform float uTime;

varying vec2 vUv;
varying vec3 vInstanceColor;
varying float vProgress;
mat4 rotationX (float angle){
    float s = sin(angle);
    float c = cos(angle);
    return mat4(
        1, 0, 0, 0,
        0, c, -s, 0,
        0, s, c, 0,
        0, 0, 0, 1 
    );
}

mat4 rotationY(float angle){
    float s = sin(angle);
    float c = cos(angle);
    return mat4(
        c, 0, s, 0,
        0, 1, 0, 0,
        -s, 0, c, 0,
        0, 0, 0, 1
    );
}

mat4 rotationZ(float angle){
     float s = sin(angle);
    float c = cos(angle);

    return mat4(
        c, -s, 0, 0,
        s, c, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    );
}

/*
* 缓动函数
*/
float easeOutCirc(float x){
    return sqrt(1.0 - pow(x - 1.0, 2.0));
}

void main (){
    /*
    * 计算开始位置和最终位置的距离 受到重力的影响, 最终位置就是生命周期乘速度
    */

    float startTime = instanceLifeTime.x;
    float duration = instanceLifeTime.y;

    float age = uTime - startTime;
    vProgress = age / duration;

    float easeProgress = easeOutCirc(vProgress);

    vec4 startPosition = instanceMatrix * vec4(position, 1.0);
    // startPosition.xyz += uTime * 0.5;
    /*
    * 取每个粒子的运动方向
    */

    vec3 normalizeDirection = length(instanceDirection) > 0.0 ? normalize(instanceDirection) : vec3(0.0);

    /*
    * 计算移动的距离 move 这里加入缓动函数
    */
    float maxDistance = duration * instanceSpeed;

    vec3 offset = normalizeDirection * maxDistance * easeProgress;
    /*
    * 加入重力效果
    */
    offset.y -= gravity * age * age * 0.5;
    vec3 finalPosition = startPosition.xyz + offset;

    /*
    * 销毁 因为父亲 group 偏移了20米 所以需要加上
    */
    if (finalPosition.y + 20.0 < -5.0) {
    gl_Position = vec4(vec3(9999.0), 1.0);
    return;
  }

    gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPosition, 1.0);

    vInstanceColor = instanceColor;
    vUv = uv;
}