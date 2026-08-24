import { useThree, useFrame } from "@react-three/fiber"
import { useMemo, useEffect, useRef } from "react"
import { EffectComposer, RenderPass, EffectPass } from "postprocessing"
import { Effect, BlendFunction } from "postprocessing"
import FogFragmentShader from '../../shader/Fog/fragment.glsl'
import { Color, Uniform } from "three"
import { useTexture } from "@react-three/drei"
import { useControls } from "leva"
import { filterTextureUrl } from '@/assets/mazeAssets'

class FogEffect extends Effect {
    constructor(texture, fogFrequency, filterColor, blendFunction = BlendFunction.NORMAL) {
        super('FogEffect', FogFragmentShader, {
            uniforms: new Map([
                ['uTime', new Uniform(0)],
                ['uBackImg', new Uniform(texture)],
                ['uFilterColor', new Uniform(new Color(filterColor))],
                ['uFrequency', new Uniform(fogFrequency)]
            ]),
            blendFunction
        })
    }
    update(renderer, inputBuffer, deltaTime) {
        this.uniforms.get('uTime').value += deltaTime
    }
}

const CameraFilter = () => {
    const { gl, scene, camera } = useThree()
    const composerRef = useRef()
    const texture = useTexture(filterTextureUrl)
    const { fogFrequency, filterColor, noiseCount } = useControls('后期处理', {
        fogFrequency: {
            min: 0,
            max: 2,
            value: 0.3,
            step: 0.1
        },
        filterColor: '#7897ac',
        noiseCount: {
            min: 0,
            max: 8,
            value: 4,
            step: 1,
        }
    })
    const effect = useMemo(() => new FogEffect(texture, fogFrequency, filterColor), [fogFrequency, filterColor])

    useEffect(() => {
        const composer = new EffectComposer(gl)
        composer.addPass(new RenderPass(scene, camera))
        composer.addPass(new EffectPass(camera, effect))
        composerRef.current = composer
        return () => composer.dispose()
    }, [gl, scene, camera, effect])

    useFrame((_, delta) => {
        composerRef.current?.render(delta)
    }, 1)

    return null
}

export default CameraFilter