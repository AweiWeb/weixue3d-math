import { useMemo, useRef } from "react"
import useGrain from "../../store/grain"
import { useShallow } from "zustand/shallow"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

const GrainLight = () => {
    const lightRef = useRef()
    const { riceX, riceY, mode } = useGrain(
        useShallow(s => ({ riceX: s.riceX, riceY: s.riceY, mode: s.mode }))
    )

    // 根据网格边界动态计算灯光位置（右上角）
    const targetPos = useMemo(() => {
        const spacingX = 1
        const spacingY = mode === 'cube' ? 1 : 0.4
        const maxX = (riceX - 1) / 2 * spacingX + 2   // 右边界 + 偏移
        const maxY = (riceY - 1) / 2 * spacingY + 2   // 上边界 + 偏移
        return new THREE.Vector3(maxX, maxY, 3)
    }, [riceX, riceY, mode])

    // 平滑过渡
    useFrame((_, delta) => {
        if (!lightRef.current) return
        lightRef.current.position.lerp(targetPos, 3 * delta)
    })

    return (
        <group>
            <directionalLight
                ref={lightRef}
                intensity={2}
                color={'white'}
                position={[10, 6, 3]}
            />
        </group>
    )
}

export default GrainLight