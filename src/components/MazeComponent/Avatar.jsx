
import React, { useEffect, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { peopleUrl } from '@/assets/mazeAssets'

export const animationNames = [
    'NlaTrack',
    'NlaTrack.001']

export function Avatar({ name = 'NlaTrack', ...props }) {
    const group = useRef()
    const { nodes, materials, animations, scene } = useGLTF(peopleUrl)
    const { actions } = useAnimations(animations, group)

    // 渲染阶段同步设置，避免 useEffect 延迟一帧
    // scene.traverse((child) => {
    //     if (child.isMesh) {
    //         child.castShadow = true
    //         child.receiveShadow = true
    //     }
    // })
    /*
    * 动画播放
    */
    useEffect(() => {
        actions[name]?.reset().fadeIn(0.5).play();
        return () => {
            actions[name]?.fadeOut(0.5);
        }
    }, [actions, name])

    return (
        <group ref={group} {...props} dispose={null}>
            <group name="Scene">
                <group name="Armature" rotation={[0, 1.571, 0]} scale={0.591}>
                    <skinnedMesh
                        name="tripo_node_c1bc722b-c9d2-47f1-82b7-ea1db2f8a8df"
                        geometry={nodes['tripo_node_c1bc722b-c9d2-47f1-82b7-ea1db2f8a8df'].geometry}
                        material={materials['tripo_mat_c1bc722b-c9d2-47f1-82b7-ea1db2f8a8df']}
                        skeleton={nodes['tripo_node_c1bc722b-c9d2-47f1-82b7-ea1db2f8a8df'].skeleton}
                        castShadow
                        receiveShadow
                    />
                    <primitive object={nodes.Root} />
                </group>
            </group>
        </group>
    )
}

useGLTF.preload(peopleUrl)