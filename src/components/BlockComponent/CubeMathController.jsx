import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function RollingBlockMath() {
    const meshRef = useRef()
    const isRolling = useRef(false)

    // 纯数学计算需要缓存一堆“初始状态”
    const mathState = useRef({
        startPosition: new THREE.Vector3(),
        startQuaternion: new THREE.Quaternion(),
        pivot: new THREE.Vector3(),
        axis: new THREE.Vector3(),
        currentAngle: 0,
        targetAngle: Math.PI / 2, // 目标转 90 度
        speed: Math.PI * 3
    })

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isRolling.current) return
            const mesh = meshRef.current
            if (!mesh) return

            // 1. 获取包围盒，找到我们需要绕着转的那条底边（枢轴点）
            const box = new THREE.Box3().setFromObject(mesh)
            const center = new THREE.Vector3()
            box.getCenter(center)

            let axis = new THREE.Vector3()
            let pivot = new THREE.Vector3()

            if (e.key === 'ArrowRight' || e.key === 'd') {
                axis.set(0, 0, -1) 
                pivot.set(box.max.x, box.min.y, center.z) // 右下角底边
            } else if (e.key === 'ArrowLeft' || e.key === 'a') {
                axis.set(0, 0, 1)
                pivot.set(box.min.x, box.min.y, center.z) // 左下角底边
            } else if (e.key === 'ArrowUp' || e.key === 'w') {
                axis.set(-1, 0, 0)
                pivot.set(center.x, box.min.y, box.min.z) // 前下角底边
            } else if (e.key === 'ArrowDown' || e.key === 's') {
                axis.set(1, 0, 0)
                pivot.set(center.x, box.min.y, box.max.z) // 后下角底边
            } else {
                return
            }

            // 2. 缓存动画开始前，方块的初始位置和旋转状态
            mathState.current.startPosition.copy(mesh.position)
            mathState.current.startQuaternion.copy(mesh.quaternion)
            mathState.current.pivot.copy(pivot)
            mathState.current.axis.copy(axis)
            mathState.current.currentAngle = 0
            
            isRolling.current = true
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    useFrame((_, delta) => {
        if (!isRolling.current) return
        
        const mesh = meshRef.current
        const state = mathState.current
        
        // 累加当前转过的角度
        state.currentAngle += state.speed * delta

        // 是否到达或超过 90 度？
        const isFinished = state.currentAngle >= state.targetAngle
        if (isFinished) {
            state.currentAngle = state.targetAngle // 强行对齐，消除浮点数误差
        }

        // ==========================================
        // 核心数学：计算新位置和新旋转 (Zero GC 优化写法)
        // ==========================================
        
        // 1. 生成当前的旋转四元数 q (本帧的增量角度)
        const q = new THREE.Quaternion()
        q.setFromAxisAngle(state.axis, state.currentAngle)

        // 2. 计算位置： P_new = Pivot + q * (StartPos - Pivot)
        const offset = new THREE.Vector3()
        offset.subVectors(state.startPosition, state.pivot) // 算出中心点到门轴的向量
        offset.applyQuaternion(q) // 旋转这个向量
        
        // 更新方块位置：把转完的向量加上门轴坐标
        mesh.position.copy(state.pivot).add(offset) 

        // 3. 计算旋转：将新的四元数乘上之前的初始四元数
        mesh.quaternion.copy(q).multiply(state.startQuaternion)

        // ==========================================

        if (isFinished) {
            isRolling.current = false
            // TODO: 在这里触发 Zustand 结算，校验木块姿态并更新二维数组逻辑
        }
    })

    return (
        <mesh ref={meshRef} position={[0, 1, 0]}>
            <boxGeometry args={[1, 2, 1]} />
            <meshStandardMaterial color="#4f46e5" />
            <lineSegments>
                <edgesGeometry args={[new THREE.BoxGeometry(1, 2, 1)]} />
                <lineBasicMaterial color="white" />
            </lineSegments>
        </mesh>
    )
}