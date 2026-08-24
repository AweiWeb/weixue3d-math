import { useEffect, useMemo, useRef, useState } from "react"
import { Avatar } from "./Avatar"
import { useFrame, useThree } from "@react-three/fiber"
import useMaze from "../../store/index";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import { useControls } from "leva";
import { cameraInitPos } from "./util";

const Controller = ({ ID, step, ...props }) => {
    const initPosition = useMaze((state) => state.initPosition);
    const changePosition = useMaze((state) => state.changePosition)
    const resetCount = useMaze((state) => state.resetCount)
    // const mapMeshes = useMaze((state) => state.mapMeshes);
    const mapMarks = useMaze((state) => state.mapMarks);
    const marks = mapMarks[`${ID + 1}`]
    const changeGameState = useMaze((state) => state.changeGameState)
    const gameState = useMaze((state) => state.gameState)
    const changePeopleState = useMaze((state) => state.changePeopleState)
    // const changeDirectionState = useMaze((state) => state.changeDirectionState)
    const resetGameState = useMaze((state) => state.resetGameState)
    const directionState = useMaze((state) => state.directionState)
    const { camera } = useThree()
    const { speed, stepSize, camerLerp } = useControls('角色调试', {
        speed: {
            min: 0,
            max: 1,
            value: 0.6
        },
        stepSize: {
            min: 1,
            max: 3,
            value: 1.95
        },
        camerLerp: {
            min: 2,
            max: 10,
            value: 5
        }
    })

    const { offsetX, offsetY, offsetZ } = useControls('相机调试', {
        offsetX: {
            min: 0,
            max: 2,
            value: 0,
        },
        offsetY: {
            min: 0,
            max: 2,
            value: 0.9,
            step: 0.1
        },
        offsetZ: {
            min: 0,
            max: 3,
            value: 1,
            step: 0.1
        }
    })

    const camerOffset = useMemo(() => new THREE.Vector3(offsetX, offsetY, offsetZ), [offsetX, offsetY, offsetZ])
    const [_, get] = useKeyboardControls()
    const groupRef = useRef()
    const isMoving = useRef(false);
    // const speed = 0.1
    // const stepSize = 1.5
    const targetPosition = useRef(new THREE.Vector3());
    const { moveDirection, cameraTarget, cameraLookAt, targetQuaternion, rayDir, raycaster, idealCameraPos } = useMemo(() => {
        return {
            moveDirection: new THREE.Vector3(0, 0, -1),
            cameraTarget: new THREE.Vector3(),
            cameraLookAt: new THREE.Vector3(),
            targetQuaternion: new THREE.Quaternion(),
            rayDir: new THREE.Vector3(),
            raycaster: new THREE.Raycaster(),
            idealCameraPos: new THREE.Vector3() //临时计算相机的位置 最后被targetcopy
        }
    }, [])
    const currentAngle = useRef(0)
    const frameCounter = useRef(0)
    const cachedHit = useRef(null)
    const keyReady = useRef(true) // 必须松键后才能再次触发
    const resetReady = useRef(true) // C 键重置防连发（独立于方向键）
    const moveStartPos = useRef(new THREE.Vector3()) // 本次移动开始位置，避免停在原位 mark 上
   useEffect(() => {
    if(resetCount === 0) return
    reset()
   }, [resetCount])
    /*
    * 重置函数抽离
    */

    const reset = () => {
        resetGameState()
        resetReady.current = false
        isMoving.current = false
        // 朝向复位（-z 朝向，角度 0）
        moveDirection.set(0, 0, -1)
        currentAngle.current = 0
        targetQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0)
        // 位置复位
        const start = new THREE.Vector3(...initPosition[ID])
        groupRef.current.position.copy(start)
        groupRef.current.quaternion.copy(targetQuaternion)
        moveStartPos.current.copy(start)
        targetPosition.current.copy(start)
        // 相机复位到透视相机组件的初始位置与朝向
        camera.position.set(...cameraInitPos)
        camera.rotation.set(0, 0, 0)
        // camera.lookAt(0, 0, 0)
        // 动画与状态复位
        setName('NlaTrack.001')
        changePosition(groupRef.current.position, targetQuaternion, 0, moveDirection)
     
    }
    /*
    * 行走动画
    */
    useFrame(({ camera }, detla) => {
        if (!groupRef.current) return

        if (gameState === 'success') {
            isMoving.current = false
            setName('NlaTrack.001')
            // return
        }
        if (gameState === 'gameOver') {
            isMoving.current = false
            setName('NlaTrack.001')
            return
        }
        if(gameState !== 'playing')return
        const { forward, backward, left, right } = directionState
        /*
        * 重置一下向量方向
        */
        const currentPosition = groupRef.current.position

        // 所有键松开 → 允许下次触发
        if (!forward && !backward && !left && !right) {
            keyReady.current = true
        }
        if (!get().reset) {
            resetReady.current = true
        }

        /*
        * C 键重置：回到当前关卡初始位置，打断移动
        */
        if (get().reset && resetReady.current) {
           reset()
           // 阻止同帧的相机跟随代码覆盖 reset 的相机位置
           return
        }

        if (!isMoving.current) {

            let nextDir = moveDirection.clone()
            let keyPressed = false;

            // --- 键盘输入 ---
            if (forward) {
                keyPressed = true;
            } else if (backward) {
                if (ID !== 2) {
                    nextDir.negate()
                    keyPressed = true;
                }
            } else if (left) {
                if (ID !== 2) {
                    nextDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2).round()
                    keyPressed = true;
                }
            } else if (right) {
                nextDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2).round()
                keyPressed = true;
            }
            if (keyPressed) {
                // 不松键不允许连发
                if (!keyReady.current) return
                keyReady.current = false

                /*
                * 计算方向
                */
                moveDirection.copy(nextDir)

                // ID === 1：死胡同检测，前方 2.5 内有没有邻接 mark
                // if (ID === 2) {
                //     const dir = moveDirection.clone().normalize()
                //     let canWalk = false
                //     for (const m of marks) {
                //         const toMark = new THREE.Vector3(...m.position).sub(currentPosition)
                //         const dist = toMark.length()
                //         if (dist > 0.1 && dist < 5.5 && toMark.normalize().dot(dir) > 0.85) {
                //             canWalk = true
                //             break
                //         }
                //     }
                //     /*
                //     * 如果不能走则游戏失败 配合展示UI反馈
                //     */
                //     if (!canWalk) return changeGameState('gameOver');
                // } else if (ID === 3) {
                //     console.log('ID === 3');
                // }
                targetPosition.current.copy(currentPosition).add(moveDirection.normalize().clone().multiplyScalar(10))
                currentAngle.current = Math.atan2(-moveDirection.x, -moveDirection.z);

                isMoving.current = true
                moveStartPos.current.copy(currentPosition) // 记录起点
                targetQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), currentAngle.current)
            }
        }
        /*
        * 开始移动
        */
        if (isMoving.current) {
            setName('NlaTrack')
            changePeopleState('moving')
            groupRef.current.quaternion.slerp(targetQuaternion, 5 * detla)
            const step = speed * detla;
            /*
            *  第一关 判断是否到达位置了
            */
            // 先离开起点一段距离，再检测 mark
            if (currentPosition.distanceTo(moveStartPos.current) < 0.15) {
                currentPosition.lerp(targetPosition.current, step / currentPosition.distanceTo(targetPosition.current))
            } else {
                let hit = false
                for (const m of marks) {
                    if (currentPosition.distanceTo(new THREE.Vector3(...m.position)) < 0.05) {
                        hit = true
                        break
                    }
                }
                if (hit) {
                    isMoving.current = false
                    changePeopleState('idle')
                    setName('NlaTrack.001')
                    // 第二关：回到初始位置即为胜利
                    if (ID === 1) {
                        const startPos = new THREE.Vector3(...initPosition[ID])
                        if (currentPosition.distanceTo(startPos) < 0.15) {
                            changeGameState('success')
                        }
                    }
                } else {
                    currentPosition.lerp(targetPosition.current, step / currentPosition.distanceTo(targetPosition.current))
                }
            }
            /*
            *传递位置信息
            */

        }
        changePosition(currentPosition, targetQuaternion, currentAngle.current, moveDirection)

        /*
        * 处理相机跟随
        */
        // 旋转跟随

        idealCameraPos.copy(camerOffset)
        idealCameraPos.applyQuaternion(targetQuaternion)
        idealCameraPos.add(currentPosition)

        cameraLookAt.set(currentPosition.x, currentPosition.y + 0.5, currentPosition.z)

        /*
        * 增加一步相机碰撞判断，也就是相机穿模
        */
        // rayDir.subVectors(idealCameraPos, cameraLookAt).normalize()
        // const maxDist = cameraLookAt.distanceTo(idealCameraPos)

        // 每 3 帧检测一次，其余帧用缓存
        // frameCounter.current++
        // if (frameCounter.current % 60 === 0) {
        //     raycaster.set(cameraLookAt, rayDir)
        //     raycaster.far = maxDist + 0.5
        //     const intersects = raycaster.intersectObjects(mapMeshes || [], true)
        //     cachedHit.current = intersects.length > 0 && intersects[0].distance < maxDist
        //         ? intersects[0]
        //         : null
        // }

        // if (cachedHit.current) {
        //     cameraTarget.copy(cachedHit.current.point).addScaledVector(rayDir, -0.3)
        // } else {
        //     cameraTarget.copy(idealCameraPos)
        // }

        cameraTarget.copy(idealCameraPos)
        /*
        * 平滑过度
         */
        camera.position.lerp(cameraTarget, camerLerp * detla)
        camera.lookAt(cameraLookAt)
    })
    const [name, setName] = useState('NlaTrack.001')
    return <group ref={groupRef} scale={0.5} position={initPosition[ID]} {...props}>
        <Avatar name={name} />
    </group>
}


export default Controller