import useMaze from "@/store";
import { Clone, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { pillUrls } from '@/assets/mazeAssets'

const Pill = ({name, rotationSpeed, scaleParams, statePill, index, ...props}) => {
    const recordPosition = useMaze((state) => state.recordPosition);
    const gameState = useMaze((state) => state.gameState);
    const changeGameState = useMaze((state) => state.changeGameState);
    const changePeopleState = useMaze((state) => state.changePeopleState);
    const changePillsState = useMaze((state) => state.changePillsState);
    const currentPills = useMaze((state) => state.currentPills);
    const pill = useGLTF(pillUrls[name]);
    const pillRef = useRef();
    const hasEat = useRef(false)
    // 计算包围盒中心，把几何挪回原点，保证自转轴在几何中心
    const center = useMemo(() => {
        const box = new THREE.Box3().setFromObject(pill.scene)
        return box.getCenter(new THREE.Vector3())
    }, [pill])
    // 监听当前药丸 判断是否符合红蓝交替
    useEffect(() => {
        // 只有刚吃下这颗药丸的 Pill 才检查，避免 16 个实例重复触发
        if (!hasEat.current) return
        console.log(currentPills);
        
        const len = currentPills.length
        if (len === 0) return
        const lastColor = currentPills[len - 1]
        // 红蓝交替：第 1/3/5... 颗必须是红，第 2/4/6... 颗必须是蓝
        const expectedColor = len % 2 === 1 ? 'red' : 'blue'
        if (lastColor !== expectedColor) {
       setTimeout(() => {
           changeGameState('gameOver')
          changePeopleState('idle')
       }, 1000)
        }
    }, [currentPills])
    useFrame((state, delta) => {
        pillRef.current.rotation.y -= rotationSpeed * delta;        
        if(gameState === 'playing'){
           const distance = pillRef.current.position.distanceTo(recordPosition)
        //    console.log(distance);
         /*
            * 当药丸距离记录位置小于0.18时 药丸消失，并且记录位置更新为当前位置 这个流程只记录一次
            */ 
           if(distance < 0.2){
              if(!hasEat.current){
                hasEat.current = true;
               changePillsState(index, false)
               setTimeout(() => {
                changePillsState(index, true)
                hasEat.current = false;
               }, 3000)
              }
           }
           
        }
    });

    
  return <group ref={pillRef} {...props} visible={statePill}>
      <group position={center.clone().negate()} scale={scaleParams}>
        <Clone object={pill.scene} />
    </group>
  </group>
};


const Pills = (props) => {
    const {rotationSpeed, scaleParams} = useControls('药丸调试', {
        rotationSpeed: {
            min: 0,
            max: 10,
            value: 2,
            step:0.1
        },
        scaleParams: {
            min: 0,
            max: 1,
            value: 0.75,
            step: 0.01
        }
    })
    const pills = useMaze((state) => state.pills);
    return <group {...props}>
        {pills.map((pill, index) => (
          <Pill key={index} rotationSpeed={rotationSpeed} scaleParams={scaleParams} name={pill.color} position={pill.position} statePill={pill.state} index={index} />
        ))}
    </group>
};

export default Pills;
