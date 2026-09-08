import { useGLTF } from "@react-three/drei"
import { useEffect } from "react";
import { Mesh } from "three";

const BackMaze = () => {
    const { scene } = useGLTF('/blockMaze/backPlane.glb')
    console.log(scene);
    useEffect(() => {
        scene.traverse((child) => {
            if (child instanceof Mesh) {
                child.castShadow = true
                child.receiveShadow = true
            }
        })
    }, [])
    return <primitive object={scene} position={[0, -4, -4]} />
}


export default BackMaze