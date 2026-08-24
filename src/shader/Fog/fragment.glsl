uniform float uTime;
uniform sampler2D uBackImg; // 你的背景贴图
uniform vec3 uFilterColor;
uniform float uFrequency;
// 1. 基础随机发生器 (生成平滑的伪随机值)
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// 2. 平滑值噪音 (Value Noise) - 消除颗粒感的核心，用 smoothstep 做了插值
float noise(in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // 使用多项式曲线进行极其平滑的过渡
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a) * u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

// FBM 叠加噪音函数
float fbm(in vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    // 叠加 4 层噪音，层数越多烟雾细节越丰富
    for (int i = 0; i < 4; i++) {
        value += amplitude * noise(st);
        st *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor){
    vec2 center = vec2(0.5, 0.5);
    
    // 基础距离
    float dist = distance(uv, center);
    // 控制波动频率
    float noiseVal = fbm(uv * 4.0 + uTime * uFrequency); 

    // 每个像素点到 中心的距离，但是这个距离是加上噪音函数开始的距离
    float finalDist = dist + (noiseVal - 0.5) * 0.2; 

    // 控制暗角的安全区半径和模糊渐变区
    float radius = 0.45;
    float fuzziness = 0.18; 
    
    // smoothstep 划分噪音函数波浪开始到雾气最浓的过渡
    float darkness = smoothstep(radius, radius + fuzziness, finalDist);
    vec4 uvTexture = texture2D(uBackImg, uv);
    
    vec3 finalColor = mix(inputColor.rgb, uFilterColor, darkness);
    
    outputColor = vec4(finalColor, 1.0);
}