import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import BlockMaps from "./Map";
import BlockController from "./BlockController";
import BackMaze from "./BackMaze";
import { Leva, useControls } from "leva";
import { Perf } from "r3f-perf";
import { Physics } from "@react-three/rapier";
import { Vector3 } from "three";
import useBlockMaze from "@/store/blockmaze";
import ExplosionParticle from "../ExplosionParticle";
import { EffectComposer, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
const Experience = () => {
  const gameState = useBlockMaze((state) => state.gameState)
  const levelID = useBlockMaze((state) => state.levelID)
  const { x, y, z } = useControls('灯光', {
    x: {
      value: 16,
      min: 0,
      max: 100,
      step: 2
    },
    y: {
      value: 2,
      min: 0,
      max: 100,
      step: 2
    },
    z: {
      value: 10,
      min: 0,
      max: 100,
      step: 2
    }
  })

  // const { levelID } = useControls('切换地图', {
  //   levelID: {
  //     value: 1,
  //     options: [1, 2, 3, 4]
  //   }
  // })

  const { fovParams, lookAtParamsX, lookAtParamsY, lookAtParamsZ } = useControls('相机参数', {
    fovParams: {
      value: 36.5,
      step: 1,
      min: 20,
      max: 50
    },
    lookAtParamsX: {
      value: 0,
      min: 0,
      max: 25,
      step: 0.1
    },
    lookAtParamsY: {
      value: 0,
      min: 0,
      max: 25,
      step: 0.1
    },
    lookAtParamsZ: {
      value: 8,
      min: 0,
      max: 25,
      step: 0.1
    }
  })
  return <>
    {/* <Perf position="top-left" /> */}
    <Leva hidden />
    <PerspectiveCamera
      position={[0, 75, 60]}
      fov={fovParams}
      makeDefault
      onUpdate={(camera) => {
        camera.lookAt(new Vector3(lookAtParamsX, lookAtParamsY, lookAtParamsZ))
      }} />
    <ambientLight intensity={1.5} />
    <directionalLight
      position={[16, 3, 10]}
      intensity={2.7}
      castShadow={true}
      color={'#ffffff'}
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
      shadow-camera-near={3}
      shadow-camera-far={80}
      shadow-bias={-0.0005}
      shadow-normalBias={0.02}
      shadow-radius={2}
    />
    {gameState === 'success' &&
      <ExplosionParticle particleCount={300} geometry={<capsuleGeometry />} initPosition={[0, 32, 0]} />
    }
    <BackMaze />
    <Physics gravity={[0, -9.8, 0]} >
      <BlockMaps key={`block${levelID}`} name={levelID} />
      <BlockController key={`map${levelID}`} name={levelID} />
    </Physics>
    <EffectComposer>
      <Vignette
        offset={0.1} // vignette offset
        darkness={0.15} // vignette darkness
        eskil={false} // Eskil's vignette technique
        blendFunction={BlendFunction.NORMAL} // blend mode
      />
    </EffectComposer>
    {/* <OrbitControls /> */}
  </>
};

export default Experience;
