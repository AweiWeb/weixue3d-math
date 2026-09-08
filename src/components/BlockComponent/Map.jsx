import { useGLTF } from "@react-three/drei"
import { useEffect, useMemo } from "react"
import { Mesh, Vector3 } from "three"

const BlockMaps = ({ name, ...props }) => {
    const { scene } = useGLTF('/blockMaze/mazeBlock1.glb')
    useEffect(() => {
        scene.traverse((child) => {
            if (child instanceof Mesh) {
                // console.log(child);
                child.castShadow = true
                child.receiveShadow = true

            }
        })
    }, [scene])
    /*
    * 获取地图的初始数据
    */
    const Position = useMemo(() => {
        const position = []
        scene.traverse((child) => {
            if (child instanceof Mesh) {
                // console.log(child);
                const worldPos = new Vector3()
                child.getWorldPosition(worldPos)
                // console.log(worldPos);
                position.push(worldPos)
            }
        })
        return position
    }, [scene])
    console.log(Position);

    return <primitive object={scene} position={[-0.35, -1.3, -0.21]} />
}

export default BlockMaps
