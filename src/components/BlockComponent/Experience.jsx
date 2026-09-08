import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import BlockMaps from "./Map";
import BlockController from "./BlockController";
import BackMaze from "./BackMaze";
import { useControls } from "leva";
const Experience = () => {

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
  return <>
    <PerspectiveCamera
      position={[0, 68, 58]}
      fov={35}
      makeDefault
      onUpdate={(camera) => camera.lookAt(0, 0, 0)} />
    <ambientLight intensity={1.5} />
    <directionalLight
      position={[16, 2, 10]}
      intensity={1}
      castShadow={true}
      color={'yellow'}
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
      shadow-camera-near={3}
      shadow-camera-far={80}
      shadow-bias={-0.0005}
      shadow-normalBias={0.02}
      shadow-radius={2}
    />

    <BlockMaps />
    <BackMaze />
    <BlockController />

    {/* <OrbitControls /> */}
  </>
};

export default Experience;
