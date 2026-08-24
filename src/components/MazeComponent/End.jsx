import useMaze from "@/store"
import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from 'three'
import { endDoorUrl } from '@/assets/mazeAssets'
const endPosition = {
    1: [0, 0, -2.8],
    2: [],
    3: [-2.735, 0.04, 4.5],
    4: [0.65, 0.02, 2.2]
}

const End = ({ ID }) => {
    const { scene } = useGLTF(endDoorUrl)
    const endRef = useRef(null)
    const recordPosition = useMaze((state) => state.recordPosition)
    const peopleState = useMaze((state) => state.peopleState)
    const changeGameState = useMaze((state) => state.changeGameState)
    /*
    * 只有人物在moving的时候才进行检测
    */
    useFrame(() => {
        if (peopleState === 'moving') {
            const distance = endRef.current.position.distanceTo(recordPosition)
            if (distance < 0.08) {
                changeGameState('success')
            }
        }
    })
    return <group ref={endRef} rotation-y={0.5 * Math.PI} position={endPosition[ID]}>
        <primitive object={scene} />
    </group>
}

export default End