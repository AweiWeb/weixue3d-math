import Experience from '@/components/CubeComponent/Experience';
import Experience2 from '@/components/CubeComponent/Experience2';
import Experience3 from '@/components/CubeComponent/Experience3';
import SelectBroad from '@/components/CubeComponent/UI/selectBroad';
import TimeSlider from '@/components/CubeComponent/UI/TimeSlider';
import StaicCube from '@/components/CubeComponent/UI/StaticCube';
import SelectTopic from '@/components/CubeComponent/UI/SelectTopic';
import LevelSelect from '@/components/CubeComponent/UI/LevelSelect';
import ToggleTheme from '@/components/CubeComponent/UI/ToggleTheme';
import LookRule from '@/components/CubeComponent/UI/LookRule';
import ExplosionParticle from '@/components/ExplosionParticle';
import SuccessPop from '@/components/CubeComponent/UI/Success';
import useCubeBreak from '@/store/cubeBreak';
import { Slider } from 'antd';
import { Canvas } from '@react-three/fiber';
import '../../style/cubeAnimation.less'
import { Center, Gltf, KeyboardControls, OrbitControls, useKeyboardControls, View } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import SceneEnvironment from '@/components/CubeComponent/SceneEnvironment';


const levelBack = {
    1: 'cubeShow-back',
    2: 'cubeTopic',
    3: 'diceback'
}
const CubeAnimation = () => {
    useEffect(() => {
        setTimeout(() => {
            const view = DiceMazeRef.current?.getBoundingClientRect();
            console.log('view rect:', view);
            console.log('canvas', document.querySelector('canvas')?.getBoundingClientRect());

        }, 500);

    }, []);
    const gameState = useCubeBreak((state) => state.gameState)
    const levelID = useCubeBreak((state) => state.levelID)
    const setProgress = useCubeBreak((state) => state.setProgress)
    const currentProgress = useCubeBreak((state) => state.currentProgress)
    const isPopVisible = useCubeBreak((state) => state.isPopVisible)
    const setPopVisible = useCubeBreak((state) => state.setPopVisible)
    const theme = useCubeBreak((state) => state.theme)
    const DiceMazeRef = useRef()
    const DiceContainer = useRef(null)
    const DiceDemo = useRef(null)

    const handleChange = (value) => {
        setProgress(value)
    }
    const keyMap = [
        { name: "forward", keys: ["ArrowUp", "KeyW"] },
        { name: "backward", keys: ["ArrowDown", "KeyS"] },
        { name: "left", keys: ["ArrowLeft", "KeyA"] },
        { name: "right", keys: ["ArrowRight", "KeyD"] },
    ]
    const [showDemo, setShowDemo] = useState(true) // 默认是否显示
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'KeyY') {
                setShowDemo((prev) => !prev)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])
    return (
        <div className="cube-animation"
            ref={DiceContainer}
            style={{
                backgroundImage: `url(http://wx-distribution.oss-cn-hangzhou.aliyuncs.com/distribution/20220427/cubeShow/${levelBack[levelID]}.png)`
            }}>
            <LevelSelect />
            {levelID === 1 && <div>
                <SelectBroad />
                <TimeSlider />
                <StaicCube />
                <div className="cubeCanvas">
                    <ToggleTheme />
                    <Canvas dpr={[1.5, 2]} gl={{ antialias: true }}>
                        <Experience />
                    </Canvas>
                </div>
            </div>}

            {levelID === 2 && <div>
                <SelectTopic />
                <div
                    className='cubeShowpop'
                    style={{ display: isPopVisible ? '' : 'none' }}
                >
                    <div className='cubeTopic'>
                        <ToggleTheme />
                        <Canvas dpr={[1.5, 2]} gl={{ antialias: true }}>
                            <Experience2 />
                        </Canvas>
                        <div className='sliderBox'>
                            <Slider value={currentProgress} max={1} step={0.01} tooltip={{ open: false }} className='topicSlider' onChange={handleChange} />
                        </div>
                    </div>
                    <div
                        className='resetbtn'
                        onClick={() => {
                            setPopVisible(false);
                            setProgress(0);
                        }}
                    ></div>
                </div>
            </div>}

            {levelID === 3 && <KeyboardControls map={keyMap}>
                <LookRule />


                <div className='diceMazeMain'>
                    {/* 直接在这个 div 上加圆角和溢出隐藏 */}
                    <div
                        className='dice-home'
                        style={{ borderRadius: '1.8vw', overflow: 'hidden' }}
                    >
                        <ToggleTheme />
                        <div className='message' style={{ backgroundImage: `url(http://wx-distribution.oss-cn-hangzhou.aliyuncs.com/distribution/20220427/cubeShow/message${theme === 'light' ? 1 : 2}.png)` }}></div>
                        {/* Canvas 直接铺满这个带有圆角的盒子 */}
                        <Canvas
                            dpr={[1, 2]}
                            eventSource={DiceContainer} // 依然可以保留事件代理
                            style={{ width: '100%', height: '100%' }} // 撑满父级
                            camera={{
                                position: [0, 10, 20],
                                fov: 45
                            }}
                        >
                            <Experience3 />
                            {gameState === 'success' && (
                                <ExplosionParticle
                                    geometry={<planeGeometry args={[2, 2]} />}
                                    particleCount={300}
                                />
                            )}
                        </Canvas>

                    </div>

                    <div className='dice-demo' ref={DiceDemo} style={{ backgroundImage: `url(http://wx-distribution.oss-cn-hangzhou.aliyuncs.com/distribution/20220427/cubeShow/pop1.png)`, display: showDemo ? 'block' : 'none' }}>
                        <div className='deme'>
                            <Canvas
                                dpr={[1, 2]}
                                eventSource={DiceDemo} // 依然可以保留事件代理
                                style={{ width: '100%', height: '100%' }} // 撑满父级
                                camera={{
                                    position: [0, 0, 15],
                                    fov: 45,
                                }}
                            >
                                <OrbitControls />
                                <SceneEnvironment isGrid={false} lightInstenity={3} isTransparent={true} />
                                <Center>
                                    <Gltf position={[0, 0, 0]} src='/cubeAnimation/dice.glb' />
                                </Center>
                            </Canvas>
                        </div>

                    </div>
                </div>
                {
                    gameState === 'success' && <SuccessPop />
                }
            </KeyboardControls>}

        </div>
    )
}

export default CubeAnimation;