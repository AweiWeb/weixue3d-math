import { useGLTF } from "@react-three/drei"
import { useEffect } from "react";
import { Mesh } from "three";
import { backPlaneModelUrl } from "@/assets/blockAssets";

const BackMaze = () => {
    const { scene } = useGLTF(backPlaneModelUrl)
    // console.log(scene);
    useEffect(() => {
        scene.traverse((child) => {
            if (child instanceof Mesh) {
                child.castShadow = true
                child.receiveShadow = true
            }
        })
    }, [])
    return <primitive object={scene} scale={1.1} position={[0, -15, -4]} />
}


export default BackMaze