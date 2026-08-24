/*
* 顶部光源
*/
import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import * as THREE from 'three'
import useMaze from "../../store/index"
import { useControls } from "leva"
const TopLight = () => {
    const characterPos = useMaze((state) => state.recordPosition)
    const rotationY = useMaze((state) => state.rotationY)
    const { offsetX, offsetZ, offsetY, lightIntensity, lerpParams, lightColor } = useControls('灯光调试', {
        offsetX: {
            min: -2,
            max: 2,
            value: 0
        },
        offsetY: {
            min: -2,
            max: 2,
            value: 1
        },
        offsetZ: {
            min: -2,
            max: 2,
            value: 1
        },
        lightIntensity: {
            min: 0,
            max: 10,
            value: 5,
            step: 0.1
        },
        lightColor: '#c7b9ad',
        lerpParams: {
            min: 0,
            max: 1,
            value: 0.1,
            step: 0.1
        }
    })
    const offsetVec = useMemo(() => new THREE.Vector3(), [])
    useFrame(() => {
        if (!lightRef.current) return
        // 用人物朝向旋转偏移量，灯始终在人物"前方"
        offsetVec.set(offsetX, offsetY, offsetZ)
        offsetVec.applyQuaternion(rotationY)
        const targetPos = characterPos.clone().add(offsetVec)
        lightRef.current.position.lerp(targetPos, lerpParams)
        lightRef.current.target.position.copy(characterPos)
    })
    const lightRef = useRef()
    return <group >
        <directionalLight
            ref={lightRef}
            color={lightColor}
            intensity={lightIntensity}
            castShadow={true}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-near={0.1}
            shadow-camera-far={12}
            shadow-bias={-0.0005}
            shadow-normalBias={0.02}
            shadow-radius={2}
        />
    </group>
}

export default TopLight