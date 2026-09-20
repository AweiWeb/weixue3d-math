import { Physics } from "@react-three/rapier"
import { GroundPlane, PreviewCube } from "./GroundPlane"
import { Grid, OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { Cubes } from "./Cube"
import { Perf } from "r3f-perf"
import { useBadDesign } from "@/store/badDesign"
import { useFrame } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { Leva } from "leva"


const cameraViews = {

    // 正视图
    1: {
        position: new THREE.Vector3(0, 0.5, 25),
        target: new THREE.Vector3(0, 0, 0)
    },

    // 侧视图
    2: {
        position: new THREE.Vector3(-25, 0.5, 0),
        target: new THREE.Vector3(0, 0, 0)
    },
    // 顶视图
    3: {
        position: new THREE.Vector3(0, 25, 0),
        target: new THREE.Vector3(0, 0, 0)
    }
}


const Experience = () => {
    const toggleClick = useBadDesign((state) => state.toggleClick)
    const withDrawCube = useBadDesign((state) => state.withDrawCube)
    const camera = useRef()
    const controls = useRef()
    const targetPosition = useRef(
        new THREE.Vector3()
    )
    const targetLookAt = useRef(
        new THREE.Vector3()
    )
    const isMoving = useRef(false)
    useEffect(() => {
        const changeCamera = (event) => {
            if (event.key.toLowerCase() === "v") {
                toggleClick()
            }
            if (event.key.toLowerCase() === "z") {
                withDrawCube()
            }
            const view = cameraViews[event.key]
            if (!view) return
            targetPosition.current.copy(
                view.position
            )
            targetLookAt.current.copy(
                view.target
            )
            isMoving.current = true
        }
        window.addEventListener(
            "keydown",
            changeCamera
        )
        return () => {
            window.removeEventListener(
                "keydown",
                changeCamera
            )

        }
    }, [])


    useFrame((state, delta) => {
        if (!isMoving.current) return
        // 相机位置移动
        state.camera.position.lerp(
            targetPosition.current,
            delta * 6
        )
        // controls目标移动
        controls.current.target.lerp(
            targetLookAt.current,
            delta * 6
        )
        // 非常重要
        controls.current.update()
        if (
            state.camera.position.distanceTo(
                targetPosition.current
            ) < 0.05
        ) {

            state.camera.position.copy(
                targetPosition.current
            )
            controls.current.target.copy(
                targetLookAt.current
            )
            controls.current.update()
            isMoving.current = false
        }
    })


    return <>
        {/* <Perf position="top-left" /> */}
        <Leva hidden />
        <Physics>
            <GroundPlane />
            <Cubes />
        </Physics>
        <PerspectiveCamera
            ref={camera}
            makeDefault
            position={[0, 10, 15]}
            fov={45}
            near={0.1}
            far={1000}
        />
        <OrbitControls
            ref={controls}
            enableDamping
            dampingFactor={0.1}
            maxPolarAngle={Math.PI * 0.5}

        />
        <Grid
            args={[50, 50]}
            cellSize={1}
            sectionColor="black"
            sectionThickness={0.6}
            cellColor="black"
            cellThickness={0.6}
            position={[0, -0.49, 0]}
        />
        <PreviewCube />


    </>

}


export default Experience