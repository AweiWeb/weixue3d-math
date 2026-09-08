import useCubeBreak from "@/store/cubeBreak"
import { useGLTF, useKeyboardControls } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import * as THREE from 'three'
const Dice = (prop) => {
    const mapData = useCubeBreak((state) => state.mapData)
    const gameState = useCubeBreak((state) => state.gameState)
    const preDicePoint = useCubeBreak((state) => state.preDicePoint)
    const rollDiceLogic = useCubeBreak((state) => state.rollDiceLogic)
    const initPosition = useCubeBreak((state) => state.initPosition)
    const resetDiceState = useCubeBreak((state) => state.resetDiceState)
    const setGameState = useCubeBreak((state) => state.setGameState)
    const forward = useKeyboardControls((state) => state.forward)
    const backward = useKeyboardControls((state) => state.backward)
    const left = useKeyboardControls((state) => state.left)
    const right = useKeyboardControls((state) => state.right)

    const groupRef = useRef(null)
    const parentRef = useRef(null)
    const diceRef = useRef(null)
    const { scene } = useGLTF('/cubeAnimation/dice.glb')
    const rollState = useRef({
        axis: new THREE.Vector3(),
        angle: 0,
        speed: 2,
        duration: 0.3,
        time: 0,
        lastEased: 0
    })
    // console.log(mapData, 'dhah');


    // 专门用于将坐标吸附到 0.5 步长的方法
    const snapToHalf = (vector3) => {
        vector3.x = Math.round(vector3.x * 2) / 2;
        vector3.y = Math.round(vector3.y * 2) / 2;
        vector3.z = Math.round(vector3.z * 2) / 2;
        return vector3; // 支持链式调用
    }
    const isRoll = useRef(false)
    const isShake = useRef(false)
    const isWinningRoll = useRef(false)
    const shakeState = useRef({
        duration: 0.5,
        maxAngle: 0.3,
        frequency: Math.PI * 6,
        time: 0,
        lastEased: 0,
        axis: new THREE.Vector3(),
    })
    useEffect(() => {
        if (!forward && !backward && !left && !right) return
        if (isRoll.current || isShake.current) return

        /*
        * 确定方向
        */
        let direction = ''
        if (forward) direction = 'forward'
        else if (backward) direction = 'backward'
        else if (left) direction = 'left'
        else if (right) direction = 'right'



        const center = new THREE.Vector3()
        let axis = new THREE.Vector3()
        let currentPosition = new THREE.Vector3()
        const box = new THREE.Box3().setFromObject(diceRef.current)
        box.getCenter(center)

        /*
        * 获取当前的row col
        */
        const currentCol = Math.round(center.x / 5 + 2.5)
        const currentRow = Math.round((center.z + 2.5) / 5 + 2.5)
        let nextRow = currentRow
        let nextCol = currentCol

        if (forward) nextRow -= 1       // 向前走，Z 减小，对应 row - 1
        else if (backward) nextRow += 1
        else if (left) nextCol -= 1
        else if (right) nextCol += 1

        // console.log(currentRow, currentCol);

        /*
        *处理旋转轴承  right x left -x forward -z backward z
        *底面移动位置 设置空group的位置
        */
        // console.log(center, box);
        if (forward) {
            currentPosition.set(center.x, box.min.y, box.min.z)
            snapToHalf(currentPosition) // 强行抹平误差，对齐到整数或 0.5
            axis.set(-1, 0, 0)
        } else if (backward) {
            currentPosition.set(center.x, box.min.y, box.max.z)
            snapToHalf(currentPosition)
            axis.set(1, 0, 0)
        } else if (right) {
            currentPosition.set(box.max.x, box.min.y, center.z)
            snapToHalf(currentPosition)
            axis.set(0, 0, -1)
        } else if (left) {
            currentPosition.set(box.min.x, box.min.y, center.z)
            snapToHalf(currentPosition)
            axis.set(0, 0, 1)
        } else {
            return
        }

        parentRef.current.position.copy(currentPosition)
        parentRef.current.attach(diceRef.current)
        /*
        * 翻滚前对翻滚的点数与骰子即将翻转的点数进行比对
        */
        // 允许 nextRow 最大为 6，nextCol 最大为 6
        const isOutOfBounds = nextRow < -1 || nextRow >= 7 || nextCol < 0 || nextCol >= 7;
        console.log(isOutOfBounds, 'sdhaldha', nextCol, nextRow);

        /*
         * 如果没有越界
        */
        let isPointMatch = false
        if (!isOutOfBounds) {
            const nextIndex = nextRow * 6 + nextCol
            const targetGridPoint = mapData[nextIndex]?.point
            const futureBottom = preDicePoint(direction)
            isPointMatch = targetGridPoint !== futureBottom
        }

        if (isPointMatch || isOutOfBounds) {
            shakeState.current.axis = axis
            shakeState.current.time = 0
            isShake.current = true
            return // 拦截翻滚，强制结束！
        }
        console.log(nextRow, nextCol);

        if (nextRow === 5 && nextCol === 6) {
            console.log('dahdha');
            isWinningRoll.current = true
        } else {
            isWinningRoll.current = false
        }
        rollDiceLogic(direction)

        rollState.current.axis = axis
        rollState.current.angle = Math.PI * 0.5
        isRoll.current = true

        /*
        * 组件销毁清空骰子状态
        */
    }, [forward, backward, right, left])


    useEffect(() => {
        return () => {
            // A. 重置 Zustand 中的数据状态
            resetDiceState()
            // B. 恢复 3D 场景与网格变换
            if (diceRef.current && groupRef.current) {
                // 如果销毁时 dice 正挂在 parentRef 上（旋转中），将其重新挂回 groupRef
                groupRef.current.attach(diceRef.current)

                // 重置初始位置与旋转角度（匹配 primitive 标签初始属性）
                diceRef.current.position.set(-17.5, 2.65, -12.5)
                diceRef.current.rotation.set(-Math.PI * 0.5, 0, 0)
            }

            if (parentRef.current) {
                parentRef.current.position.set(0, 0, 0)
                parentRef.current.rotation.set(0, 0, 0)
            }

            // C. 清空内部动画标志
            isRoll.current = false
            isShake.current = false
            isWinningRoll.current = false
        }
    }, [resetDiceState])
    useEffect(() => {
        if (gameState === 'playing' && diceRef.current && groupRef.current) {
            // 防止重置时骰子还挂载在旋转辅助节点 parentRef 上
            groupRef.current.attach(diceRef.current)

            // 还原物理坐标与初始旋转
            diceRef.current.position.set(-17.5, 2.65, -12.5)
            diceRef.current.rotation.set(-Math.PI * 0.5, 0, 0)

            if (parentRef.current) {
                parentRef.current.position.set(0, 0, 0)
                parentRef.current.rotation.set(0, 0, 0)
            }

            // 确保动画标志位全部归零
            isRoll.current = false
            isShake.current = false
            isWinningRoll.current = false
        }
    }, [gameState])

    useFrame((state, delta) => {
        /*
        * 增加抖动动画
        */
        if (isShake.current) {
            const shake = shakeState.current

            shake.time += delta

            let t = shake.time / shake.duration
            if (t > 1.0) t = 1.0
            // console.log(11111, t);

            const currentAngle = Math.sin(t * shake.frequency) * (1 - t) * shake.maxAngle

            // console.log('angle', currentAngle);

            parentRef.current.rotation.set(0, 0, 0)
            parentRef.current.rotateOnWorldAxis(shake.axis, currentAngle)

            if (t >= 1.0) {
                isShake.current = false
                shake.time = 0
                groupRef.current.attach(diceRef.current)
                parentRef.current.position.set(0, 0, 0)
                parentRef.current.rotation.set(0, 0, 0)

            }
            return
        }
        if (isRoll.current) {
            const stateData = rollState.current
            stateData.time += delta

            let t = stateData.time / stateData.duration
            if (t > 1.0) t = 1.0;
            const easeT = (1 - Math.cos(t * Math.PI)) / 2

            const step = (easeT - stateData.lastEased) * stateData.angle

            parentRef.current.rotateOnWorldAxis(stateData.axis, step);
            stateData.lastEased = easeT

            if (t >= 1.0) {
                isRoll.current = false
                groupRef.current.attach(diceRef.current)
                parentRef.current.position.set(0, 0, 0)
                parentRef.current.rotation.set(0, 0, 0)
                stateData.time = 0
                stateData.lastEased = 0
                if (isWinningRoll.current) {
                    setGameState('success')
                    console.log('chenggl1');
                    isWinningRoll.current = false // 重置状态，防止重复触发
                }
            }
            // const step = rollState.current.speed * delta
            // if (rollState.current.angle > step) {
            //     parentRef.current.rotateOnWorldAxis(rollState.current.axis, step)
            //     rollState.current.angle -= step
            // } else {
            //     isRoll.current = false
            //     groupRef.current.attach(diceRef.current)
            //     parentRef.current.position.set(0, 0, 0)
            //     parentRef.current.rotation.set(0, 0, 0)
            // }
        }
    })

    return <group ref={groupRef}>
        <group ref={parentRef} />
        <primitive
            ref={diceRef}
            object={scene}
            rotation-x={-Math.PI * 0.5}
            position={initPosition} />
    </group>
}

export default Dice