import { useGLTF } from "@react-three/drei"
import { forwardRef, useEffect } from "react"
import { Mesh } from "three"

const Blocker = forwardRef(({ position, ...props }, ref) => {
    const { scene } = useGLTF('/blockMaze/block.glb')
    useEffect(() => {
        scene.traverse((child) => {
            if (child instanceof Mesh) {
                child.castShadow = true
                child.receiveShadow = true
            }
        })
    }, [])
    return <primitive
        ref={ref}
        object={scene}
        position={position}
    />
})



export default Blocker