import { useGLTF } from "@react-three/drei"
import { DiceData } from "@/assets/diceAssets"
const Map = (prop) => {
    const { scene } = useGLTF(DiceData.diceMap)
    return <group {...prop}>
        <primitive object={scene} />
    </group>
}

export default Map