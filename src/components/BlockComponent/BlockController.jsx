import { useKeyboardControls } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useControls } from "leva"
import { CuboidCollider, RigidBody } from "@react-three/rapier"
import { use, useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"
import Blocker from "./Block"
import useBlockMaze from "@/store/blockmaze"
import AudioEngine from "@/store/aduio"

const CELL_SIZE = 5
const snapToHalf = (vector3) => {
    vector3.x = Math.round(vector3.x * 2) / 2;
    vector3.y = Math.round(vector3.y * 2) / 2;
    vector3.z = Math.round(vector3.z * 2) / 2;
    return vector3; // 支持链式调用
}
const BlockController = ({ name = 4, ...props }) => {
    // selector 形式订阅，按键状态变化会触发重渲染
    // const [_, get] = useKeyboardControls()
    const [bodyType, setBodyType] = useState('kinematicPosition')
    const forward = useKeyboardControls((state) => state.forward)
    const backward = useKeyboardControls((state) => state.backward)
    const left = useKeyboardControls((state) => state.left)
    const right = useKeyboardControls((state) => state.right)
    const gameState = useBlockMaze((state) => state.gameState)
    const changeGameState = useBlockMaze((state) => state.changeGameState)
    const currentMapBlockData = useBlockMaze((state) => state.currentMapBlockData)
    const changeLevel = useBlockMaze((state) => state.changeLevel)
    const successPosition = useBlockMaze((state) => state.successPosition)
    const playSFX = AudioEngine((state) => state.playSFX)
    const initAuduio = AudioEngine((state) => state.initAuduio)
    const initPosition = useBlockMaze((state) => state.initPosition)
    const meshRef = useRef(null)
    const parentRef = useRef(null)
    const groupRef = useRef(null)
    const failTimer = useRef(0)
    const rollState = useRef({
        axis: new THREE.Vector3(),
        angle: 0,
        speed: 0.8,
        time: 0,
        duration: 0.3,
        lastEased: 0
    })

    const { pushPower, torquePower } = useControls('物理参数调试', {
        pushPower: {
            value: 888,
            step: 5,
            min: 200,
            max: 1000
        },
        torquePower: {
            value: 300,
            step: 5,
            min: 100,
            max: 1000
        }

    })

    const { x, y, z } = useControls('block位置', {
        x: {
            value: 10,
            step: 0.01,
            min: -30,
            max: 30
        },
        y: {
            value: 10,
            step: 0.01,
            min: -30,
            max: 30
        },
        z: {
            value: 10,
            step: 0.01,
            min: -30,
            max: 30
        }
    })

    const rb = useRef(null)
    const isFalling = useRef(false)
    const isRolling = useRef(false)
    const forceApplied = useRef(0)
    const failDir = useRef(new THREE.Vector3(0, 0, 0))
    const spawnState = useRef({
        isSpawning: true,
        duration: 1.6,
        delay: 1.3,
        time: 0,
        startY: 50,
        hasPlayedThud: false
    })
    const mapTileSet = useMemo(() => {
        const set = new Set()
        currentMapBlockData.forEach((vec) => {
            // 浮点数四舍五入保留 1 位小数，防止 -17.5000001
            const key = `${vec.x.toFixed(1)},${vec.z.toFixed(1)}`
            set.add(key)
        })
        return set
    }, [currentMapBlockData])
    // const { speedParams } = useControls('立方体调试', {
    //     speedParams: {
    //         value: 7,
    //         min: 1,
    //         max: 9,
    //         step: 0.1
    //     }
    // })
    useEffect(() => {
        if (!forward && !backward && !left && !right) return
        if (isRolling.current) return
        if (gameState === 'fail' || gameState === 'init' || gameState === 'success') return
        // console.log("useEffect");
        /*
        * 获取立方体最新的位置信息
        */
        if (spawnState.current.isSpawning) return
        const box = new THREE.Box3().setFromObject(meshRef.current)
        const center = new THREE.Vector3()
        box.getCenter(center)
        // console.log(box, 'shdajkh', center);

        let aixs = new THREE.Vector3()
        let newPosition = new THREE.Vector3()
        if (forward) {

            aixs.set(-1, 0, 0)

            newPosition.set(center.x, box.min.y, box.min.z)
        } else if (backward) {

            aixs.set(1, 0, 0)
            newPosition.set(center.x, box.min.y, box.max.z)
        } else if (left) {

            aixs.set(0, 0, 1)
            newPosition.set(box.min.x, box.min.y, center.z)
        } else if (right) {

            aixs.set(0, 0, -1)
            newPosition.set(box.max.x, box.min.y, center.z)
        } else {
            return
        }
        // console.log(newPosition, aixs);

        parentRef.current.position.copy(newPosition)
        parentRef.current.attach(meshRef.current)

        rollState.current.axis = aixs
        rollState.current.angle = Math.PI * 0.5
        rollState.current.speed = 1
        isRolling.current = true
        // console.log(rb, 'shdajk');

    }, [forward, backward, left, right])


    /*
    * 组件销毁清空block状态
    */
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'KeyC' || e.key.toLowerCase() === 'c') {
                resetBlock()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])
    const resetBlock = () => {
        isFalling.current = false
        setBodyType('kinematicPosition')
        forceApplied.current = 0

        // 清空物理下落和旋转的速度
        rb.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
        rb.current.setAngvel({ x: 0, y: 0, z: 0 }, true)

        groupRef.current.attach(meshRef.current)
        parentRef.current.position.set(0, 0, 0)
        parentRef.current.rotation.set(0, 0, 0)

        meshRef.current.position.set(initPosition[name][0], spawnState.current.startY, initPosition[name][2])
        meshRef.current.quaternion.identity()

        rb.current.setNextKinematicTranslation({ x: initPosition[name][0], y: spawnState.current.startY, z: initPosition[name][2] })
        rb.current.setNextKinematicRotation({ x: 0, y: 0, z: 0, w: 1 }) // 重置物理旋转

        spawnState.current.isSpawning = true
        spawnState.current.time = 0;
        failTimer.current = 0

        changeGameState('playing')
    }
    /*
    * 落点反馈
    */
    const checkGroud = () => {
        const box = new THREE.Box3().setFromObject(meshRef.current)
        let size = new THREE.Vector3()
        let center = new THREE.Vector3()
        box.getSize(size)
        box.getCenter(center)
        // console.log(size);
        let currentCell = []
        //判断x轴方向占了多少个格子 z方向占了多少个格子
        const countX = Math.round(size.x / CELL_SIZE)
        const countZ = Math.round(size.z / CELL_SIZE)
        // console.log(countX, countZ);

        /*
        * push 一个位置 与 push两个位置
        */
        if (countX === 1 && countZ === 1) {
            const po = snapToHalf(center)
            currentCell.push(po)
        } else if (countX === 2) {
            const point1 = snapToHalf({ x: center.x - CELL_SIZE / 2, y: center.y, z: center.z })
            const point2 = snapToHalf({ x: center.x + CELL_SIZE / 2, y: center.y, z: center.z })
            let pointArr = [point1, point2]
            currentCell.push(...pointArr)
        } else if (countZ === 2) {
            const point1 = snapToHalf({ x: center.x, y: center.y, z: center.z - CELL_SIZE / 2 })
            const point2 = snapToHalf({ x: center.x, y: center.y, z: center.z + CELL_SIZE / 2 })
            let pointArr = [point1, point2]
            currentCell.push(...pointArr)
        }
        // console.log(currentCell, currentMapBlockData);
        const isOnGround = currentCell.every((cell) => {
            const key = `${cell.x.toFixed(1)},${cell.z.toFixed(1)}`
            return mapTileSet.has(key)
        })
        let fallDir = new THREE.Vector3(0, 0, 0);
        if (!isOnGround) {
            const overflowCells = currentCell.filter((cell) => {
                const key = `${cell.x.toFixed(1)},${cell.z.toFixed(1)}`
                return !mapTileSet.has(key)
            })
            // console.log("溢出的格子坐标:", overflowCells);
            if (overflowCells.length > 0 && overflowCells.length < currentCell.length) {
                const emptyCell = overflowCells[0]; // 拿到那个踩空的格子坐标

                // 用悬空的格子坐标 减去 立方体的中心坐标，就能得到应该推出去的方向
                fallDir.set(emptyCell.x - center.x, 0, emptyCell.z - center.z).round().normalize();
                console.log(fallDir, 'dahjjkd');
            }
        }

        return {
            isOnGround,
            fallDir
        }
    }

    useFrame((_, delta) => {
        if (isRolling.current) {
            const roll = rollState.current
            roll.time += delta
            let t = roll.time / roll.duration
            if (t > 1.0) t = 1.0;
            /*
            * 加入翻滚缓动函数
            */
            const easeT = (1 - Math.cos(t * Math.PI)) / 2

            const step = (easeT - roll.lastEased) * roll.angle

            parentRef.current.rotateOnWorldAxis(rollState.current.axis, step)
            roll.lastEased = easeT

            const worldPosition = new THREE.Vector3()
            const worldQuaternion = new THREE.Quaternion()

            meshRef.current.getWorldPosition(worldPosition)
            meshRef.current.getWorldQuaternion(worldQuaternion)
            const centerOffset = new THREE.Vector3(0, 5, 0)
            // 让这个偏移量跟随方块一起旋转
            centerOffset.applyQuaternion(worldQuaternion)
            // ③ 同步 Rapier
            rb.current.setNextKinematicTranslation({
                x: worldPosition.x + centerOffset.x,
                y: worldPosition.y + centerOffset.y,
                z: worldPosition.z + centerOffset.z,
            })

            rb.current.setNextKinematicRotation({
                x: worldQuaternion.x,
                y: worldQuaternion.y,
                z: worldQuaternion.z,
                w: worldQuaternion.w,
            })

            if (t >= 1) {
                playSFX('roll')
                isRolling.current = false
                roll.time = 0
                roll.lastEased = 0
                groupRef.current.attach(meshRef.current)
                parentRef.current.position.set(0, 0, 0)
                parentRef.current.rotation.set(0, 0, 0)
                let vaild = checkGroud()
                failDir.current = vaild.fallDir
                if (!vaild.isOnGround) {
                    isFalling.current = true
                    setBodyType('dynamic')
                    changeGameState('fail')
                }
                /*
                *加入判断是否落点成功
                */
                console.log(meshRef.current.position);
                const pos = meshRef.current.position
                const targetX = successPosition[name].x
                const targetZ = successPosition[name].z

                if (
                    Math.abs(pos.x - targetX) < 0.1 &&
                    Math.abs(pos.z - targetZ) < 0.1
                ) {
                    changeGameState('success')
                    // console.log('chenggle');
                    // setBodyType('dynamic');

                    setTimeout(() => {
                        changeLevel(name + 1)
                    }, 3000)
                }
            }

        }
        /*
        * 下落激活物理状态
        */
        if (isFalling.current) {
            const translation = rb.current.translation()
            const rotation = rb.current.rotation()
            const centerOffset = new THREE.Vector3(0, -5, 0)
            // 让这个偏移量跟随方块一起旋转
            centerOffset.applyQuaternion(rotation)
            // 反向同步：让视觉模型紧紧跟随物理下落的轨迹
            meshRef.current.position.set(translation.x + centerOffset.x, translation.y + centerOffset.y, translation.z + centerOffset.z)
            meshRef.current.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w)
            failTimer.current += delta;
            if (rb.current.bodyType() === 0 && forceApplied.current === 0) {

                // 1. 获取刚刚计算出来的悬空方向
                const dir = failDir.current;

                // 2. 水平推力参数
                const pushPower = 888;
                const torquePower = 300;
                if (dir.x === 0 && dir.z === 0) {
                    // 全空的情况：直接重重地往下掉
                    rb.current.applyImpulse({ x: 0, y: -300, z: 0 }, true)
                } else {
                    // 3. 施加冲量 (推出去 + 往下踹)
                    // y: -300 极其重要！它能瞬间打破方块卡在边缘的物理平衡
                    setTimeout(() => {
                        rb.current.applyImpulse({
                            x: dir.x * pushPower,
                            y: -300,
                            z: dir.z * pushPower
                        }, true)

                        // rb.current.applyTorqueImpulse({
                        //     x: dir.z * torquePower,
                        //     y: 0,
                        //     z: -dir.x * torquePower
                        // }, true)
                        console.log('受力后的移动速度(linvel):', rb.current.linvel());
                        console.log('受力后的旋转速度(angvel):', rb.current.angvel());
                        console.log('加入力：推离边缘并顺势翻滚');
                    }, 50)
                }

                forceApplied.current = 1
            }

            if (meshRef.current.position.y <= -50 || failTimer.current >= 2.5) {
                resetBlock()
            }
        }

        /*
        * 初始下落动画
        */

        if (spawnState.current.isSpawning && rb.current && gameState === 'playing') {
            const spawn = spawnState.current
            spawn.time += delta
            // 计算整体进度 t
            let t = (spawn.time - spawn.delay) / (spawn.duration)
            if (t >= 1.0) t = 1.0

            const downTime = 0.5 // 前 35% 时间下落

            let currrentY = spawn.startY
            let shakeX = 0
            let shakeZ = 0
            const groundY = initPosition[name][1]; // 地面高度

            if (t < downTime) {
                const fallTime = t / downTime
                const easeInCubic = fallTime * fallTime * fallTime;
                currrentY = spawn.startY - (spawn.startY - groundY) * easeInCubic
            } else {
                if (!spawn.hasPlayedThud) {
                    playSFX('roll')
                    spawn.hasPlayedThud = true
                }
                currrentY = groundY;
                const shakeT = (t - downTime) / (1 - downTime);
                const decay = 1 - shakeT; // 越来越小直到停下

                // 正弦波震动
                shakeX = Math.sin(shakeT * 50) * 0.45 * decay;
                shakeZ = Math.cos(shakeT * 40) * 0.55 * decay;
            }

            // 1. 设置视觉模型位置和旋转
            meshRef.current.position.set(initPosition[name][0], currrentY, initPosition[name][2])
            const euler = new THREE.Euler(shakeX, 0, shakeZ);
            meshRef.current.quaternion.setFromEuler(euler);

            const centerOffset = new THREE.Vector3(0, 5, 0)
            centerOffset.applyQuaternion(meshRef.current.quaternion)

            rb.current.setNextKinematicTranslation({
                x: meshRef.current.position.x + centerOffset.x,
                y: meshRef.current.position.y + centerOffset.y,
                z: meshRef.current.position.z + centerOffset.z
            })
            rb.current.setNextKinematicRotation({
                x: meshRef.current.quaternion.x,
                y: meshRef.current.quaternion.y,
                z: meshRef.current.quaternion.z,
                w: meshRef.current.quaternion.w
            })

            if (t >= 1.0) {
                spawn.isSpawning = false;
                spawn.hasPlayedThud = false
                meshRef.current.position.set(initPosition[name][0], groundY, initPosition[name][2])
                meshRef.current.quaternion.identity()

                rb.current.setNextKinematicTranslation({
                    x: initPosition[name][0],
                    y: groundY + 5,
                    z: initPosition[name][2]
                })
                rb.current.setNextKinematicRotation({ x: 0, y: 0, z: 0, w: 1 })


            }

            return;
        }

    })
    return <group ref={groupRef}>
        <group ref={parentRef} />
        <Blocker ref={meshRef}
            position={[
                initPosition[name][0],
                spawnState.current.startY,
                initPosition[name][2]
            ]} />
        <RigidBody
            type={bodyType}
            ref={rb}
            mass={10}
            friction={0.0001}
            position={[
                initPosition[name][0],
                spawnState.current.startY,
                initPosition[name][2]
            ]}
            colliders={false}
            gravityScale={25}
        >
            <CuboidCollider
                args={[2.5, 5, 2.5]}
            />
        </RigidBody>
    </group>
}



export default BlockController