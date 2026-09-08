
uniform vec3 color;
uniform vec2 uFadeAlpha;
varying vec3 vInstanceColor;
varying vec2 vUv;
varying float vProgress;

void main (){
    if(vProgress < 0.0 || vProgress > 1.0){
        discard;
    }

    float fadeAlpha = smoothstep(0.0, uFadeAlpha.x, vProgress) * smoothstep(1.01,uFadeAlpha.y,  vProgress);
    gl_FragColor = vec4(vInstanceColor, fadeAlpha);
}