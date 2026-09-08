import { useGLTF } from "@react-three/drei"

const Map = (prop) => {
    const { scene } = useGLTF('/cubeAnimation/diceMap.glb')
    return <group {...prop}>
        <primitive object={scene} />
    </group>
}

export default Map