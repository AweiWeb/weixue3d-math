varying vec2 vUv;
varying vec3 vInstanceColor;

void main() {
    // 1. 把自带的 uv 传给片段着色器，用来读取贴图
    vUv = uv; 

    // 2. 接收 <Instance color="xxx"/> 传过来的颜色参数
    #ifdef USE_INSTANCING
        vInstanceColor = instanceColor;
    #else
        vInstanceColor = vec3(1.0);
    #endif

    // 3. 计算实例化模型的位置 (必须这么写才能支持 Instances)
    vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
}