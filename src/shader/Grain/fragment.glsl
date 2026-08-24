uniform sampler2D uOriginMap;
// uniform vec3 uOriginColor; // 如果没贴图，用这个

varying vec2 vUv;
varying vec3 vInstanceColor;

void main() {
    // 1. 采样设计师的原始贴图，拿到原本的颜色
    vec4 baseColor = texture2D(uOriginMap, vUv);
    
    // 如果设计师没用贴图，你可以直接用 baseColor = vec4(uOriginColor, 1.0);

    // 2. 混合你的逻辑 (正片叠底)
    // 如果 vInstanceColor 是白色 (1,1,1)，乘出来就是原色
    // 如果 vInstanceColor 是红色 (1,0,0)，乘出来就变成了红色滤镜效果
    vec3 finalColor = baseColor.rgb * vInstanceColor;

    gl_FragColor = vec4(finalColor, baseColor.a);
}