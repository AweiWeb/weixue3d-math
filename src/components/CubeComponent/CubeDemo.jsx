import useCubeBreak from "@/store/cubeBreak"
import { useAnimations, useGLTF } from "@react-three/drei"
import { useEffect, useMemo } from "react"
import { CubeNumber, CubeTopic } from '../../assets/diceAssets'
// import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js"

/*
* useGltf会加入缓存 需要给cubeDemo标签加入一个key来强制更新组件
*/
const CubeDemo = ({ name, ...props }) => {
    const levelID = useCubeBreak((state) => state.levelID)
    const setAnimationDuration = useCubeBreak(
        state => state.setAnimationDuration
    )
    const currentProgress = useCubeBreak(
        state => state.currentProgress
    )
    const url = `${levelID === 1 ? 'cube' : 'topic'}${name}`
    console.log(CubeNumber);

    const { scene, animations } = useGLTF(`${levelID === 1 ? CubeNumber[url] : CubeTopic[url]}`)

    /**
     * 创建独立模型实例
     * 避免 useGLTF cache 导致模型状态污染
     */
    // const cloneScene = useMemo(() => {
    //     return SkeletonUtils.clone(scene)
    // }, [scene])
    /**
     * 动画绑定 clone 后的模型
     */
    const { actions, mixer } = useAnimations(
        animations,
        scene
    )

    /**
     * 初始化动画
     */
    useEffect(() => {
        if (!animations.length) return
        const clip = animations[0]
        const action = actions[clip.name]

        if (!action) return
        const duration = clip.duration
        setAnimationDuration(duration)
        // 初始化到第一帧
        action.reset()
        // 激活动画
        action.play()
        // 手动控制时间，不自动播放
        action.paused = true
        action.time = 0
        mixer.update(0)
        return () => {
            // 清理当前 mixer 动画状态
            mixer.stopAllAction()
            /*
            * 这里可以销毁模型，但是不建议
            */
        }
    }, [
        actions,
        animations,
        mixer,
        setAnimationDuration
    ])
    /**
     * 根据进度条控制动画帧
     */
    useEffect(() => {
        if (!animations.length) return
        const clip = animations[0]
        const action = actions[clip.name]
        if (!action) return
        const duration = clip.duration
        action.time =
            currentProgress * duration
        // 立即刷新动画状态
        mixer.update(0)
    }, [
        currentProgress,
        actions,
        animations,
        mixer
    ])
    return (
        <group {...props}>
            <primitive object={scene} />
        </group>
    )
}

export default CubeDemo