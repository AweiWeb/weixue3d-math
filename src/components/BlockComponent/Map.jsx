import useBlockMaze from "@/store/blockmaze";
import { useGLTF } from "@react-three/drei"
import { RigidBody } from "@react-three/rapier";
import { useEffect, useMemo, useRef } from "react"
import { Mesh, Vector3 } from "three"
import { easeOutBounce } from "@/utils";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { mazeBlockUrls } from "@/assets/blockAssets";
/*
* 辅助取整函数
*/
const snapToHalf = (vector3) => {
    vector3.x = Math.round(vector3.x * 2) / 2;
    vector3.y = Math.round(vector3.y * 2) / 2;
    vector3.z = Math.round(vector3.z * 2) / 2;
    return vector3; // 支持链式调用
}
const BlockMaps = ({ name = 4, ...props }) => {
    const mapPosition = useBlockMaze((state) => state.mapPosition)
    const gameState = useBlockMaze((state) => state.gameState)
    const animState = useRef({
        time: 0,
        duration: 1.3,
        startY: -50,
        isAnimating: true
    })
    const mapRb = useRef(null)
    const setCurrentMapData = useBlockMaze((state) => state.setCurrentMapData)
    const { scene } = useGLTF(mazeBlockUrls[name])
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
    useEffect(() => {
        const position = []
        // const currentPosition = []
        let lastParent = ''
        scene.traverse((child) => {
            if (child instanceof Mesh) {
                const worldPos = new Vector3()
                child.getWorldPosition(worldPos)
                // console.log(worldPos);

                if (child.parent.name !== lastParent) {
                    const newPosition = snapToHalf(worldPos)
                    // currentPosition.push(worldPos)
                    position.push(newPosition)
                }
                // console.log(worldPos);
                lastParent = child.parent.name
            }
        })
        // 存储
        setCurrentMapData(position)
        console.log(position);

    }, [name, scene, animState.current.isAnimating])

    useEffect(() => {
        console.log(mapRb.current.translation());
    })
    /*
    * 初始浮现动画
    */
    useFrame((state, delta) => {
        if (!animState.current.isAnimating || !mapRb.current || gameState === 'init') return
        const data = animState.current
        data.time += delta

        let t = data.time / data.duration
        if (t >= 1.0) t = 1.0

        const targetPos = Array.isArray(mapPosition[name]) ? new Vector3(...mapPosition[name]) : new Vector3(0, 0, 0)

        const progress = easeOutBounce(t)

        const currentY = data.startY + (targetPos.y - data.startY) * progress

        mapRb.current.setNextKinematicTranslation({
            x: targetPos.x,
            y: currentY,
            z: targetPos.z
        })

        if (t >= 1.0) {

            data.isAnimating = false
        }

    })
    return <RigidBody
        type='kinematicPosition'
        ref={mapRb}
        colliders='trimesh'
        friction={0.1}
        position={[
            mapPosition[name][0],
            animState.current.startY,
            mapPosition[name][2]
        ]}
    >
        <primitive
            object={scene}
        />
    </RigidBody>
}

export default BlockMaps
