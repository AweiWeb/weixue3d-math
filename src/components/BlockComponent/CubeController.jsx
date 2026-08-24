import { useKeyboardControls } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useControls } from "leva"
import { useEffect, useRef } from "react"
import * as THREE from "three"
const CubeController = () => {
    // selector 形式订阅，按键状态变化会触发重渲染
    // const [_, get] = useKeyboardControls()
    const forward = useKeyboardControls((state) => state.forward)
    const backward = useKeyboardControls((state) => state.backward)
    const left = useKeyboardControls((state) => state.left)
    const right = useKeyboardControls((state) => state.right)
    const meshRef = useRef(null)
    const parentRef = useRef(null)
    const groupRef = useRef(null)
    const rollState = useRef({
        axis: new THREE.Vector3(),
        angle: 0,
        speed:  0.8
    })
    const isRolling = useRef(false)

    const {speedParams} = useControls('立方体调试', {
        speedParams: {
            value: 7,
            min: 1,
            max: 9,
            step: 0.1
        }
    })
    //处理当前需要翻滚的方向 与 位置
    // 立方体翻滚其实就是沿着底面的四条边旋转翻滚
    // 按forward 设置旋转 -x -1，0，0，backward 设置旋转 x 1，0，0
    // left 设置旋转 y 0，0，1，right 设置旋转 y 0，0，-1
    useEffect(() => {
        // console.log(forward, backward, left, right)
        // 没有按键按下时不处理（松开按键也会触发 effect，直接拦截）
        if (!forward && !backward && !left && !right) return
        if(isRolling.current) return
        console.log("useEffect");
        /*
        * 获取立方体最新的位置信息
        */
       const box = new THREE.Box3().setFromObject(meshRef.current)
       const center = new THREE.Vector3()
       box.getCenter(center)
        console.log(box, 'shdajkh', center);
        
       let aixs = new THREE.Vector3()
       let newPosition = new THREE.Vector3()
        if(forward){
            aixs.set(-1, 0, 0)
            newPosition.set(center.x, box.min.y, box.min.z)
        } else if(backward){
            aixs.set(1, 0, 0)
            newPosition.set(center.x, box.min.y, box.max.z)
        } else if(left){
            aixs.set(0, 0, 1)
            newPosition.set(box.min.x, box.min.y, center.z)
        } else if(right){
            aixs.set(0, 0, -1)
            newPosition.set(box.max.x, box.min.y, center.z)
        }else{
            return
        }
        // console.log(newPosition, aixs);
            
        parentRef.current.position.copy(newPosition)
        parentRef.current.attach(meshRef.current)
    
        rollState.current.axis = aixs
        rollState.current.angle = Math.PI * 0.5
        rollState.current.speed = 1
        isRolling.current = true
    
    }, [forward, backward, left, right])
    useFrame((_, delta) => {
        if(isRolling.current){
          const step = speedParams * delta
          if(rollState.current.angle > step){
            parentRef.current.rotateOnWorldAxis(rollState.current.axis, step)
            rollState.current.angle -= step
          }else{
            parentRef.current.rotateOnWorldAxis(rollState.current.axis, rollState.current.angle)
            isRolling.current = false
            groupRef.current.attach(meshRef.current)
            parentRef.current.position.set(0, 0, 0)
            parentRef.current.rotation.set(0, 0, 0)
            // 角度取整到 90° 倍数，防止多次翻滚后浮点误差累积
          }
        }
    })
    return <group ref={groupRef}>
        <group ref={parentRef} />
            <mesh ref={meshRef} position={[0, 1, 0]}>
            <boxGeometry args={[1, 2, 1]} />
            <meshStandardMaterial color="red" />
        </mesh>
    </group>
}



export default CubeController