import { useAnimations, useGLTF } from "@react-three/drei"
import { useEffect } from "react"

const CubeDemo = () => {
    const { scene, animations, nodes } = useGLTF('/cubeAnimation/cube1.glb')
    const { actions } = useAnimations(animations, scene)
    console.log(scene, animations, nodes, actions);

    useEffect(() => {
        // actions
        actions["Animation"]?.reset().fadeIn(0.3).play()

        return () => {
            actions['Animation']?.fadeOut(0.3)
        }
    }, [actions])
    
    return <group>
        <primitive object={scene}/>
    </group>
}


export default CubeDemo