import { Clone, useGLTF } from "@react-three/drei"
import { Suspense, useEffect } from "react"
import useMaze from "../../store/index"
import { gameMapUrls } from "@/assets/mazeAssets"

const Map = ({ name, ...props }) => {
    const setMapMeshes = useMaze((state) => state.setMapMeshes)
    const { scene } = useGLTF(gameMapUrls[name])

    useEffect(() => {
        const meshes = []
        scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true
                child.receiveShadow = true
                meshes.push(child)
            }
        })
        setMapMeshes(meshes)
        return () => setMapMeshes([])
    }, [scene, setMapMeshes])
    return <Suspense fallback={
        <mesh>
            <boxGeometry />
            <meshNormalMaterial />
        </mesh>}>
        <group rotation-y={0.5 * Math.PI}>
            <primitive {...props} object={scene} />
        </group>
    </Suspense>
}

// 预加载关卡 2（迷宫单关卡包没有 map2，跳过）
if (gameMapUrls.map2) useGLTF.preload(gameMapUrls.map2)
export default Map