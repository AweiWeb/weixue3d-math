import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import Controller from "./Controller.jsx";
import Map from './Map.jsx'
import Marks from './Marks.jsx'
import { useFrame } from "@react-three/fiber";
import CameraFilter from "./CameraFilter.jsx";
import TopLight from "./TopLight.jsx";
import { gameMap, cameraInitPos } from "./util.js";
import Pills from "./Pills.jsx";
import End from "./End.jsx";
import useMaze from "@/store/index.js";
export const Experience = () => {
  const levelID = useMaze((state) => state.levelID)
  return (
    <>
      <color attach="background" args={['#b8c6cb']} />
      {levelID === 1 && <fog attach="fog" args={['#7897ac', 1, 2.5]} />}
      <PerspectiveCamera position={cameraInitPos} fov={45} makeDefault  />
      <ambientLight color='#7897ac' intensity={0.8} />
      {/* <Map position={[0, 0, 0]} name={gameMap[1]} /> */}
      <Map position={[0, 0, 0]} name={gameMap[levelID]} rotation-y={levelID === 1 ? 0 : -0.5 * Math.PI} />
      {/* <Marks marksID={4} /> */}
      <Controller ID={levelID - 1} step={0.01} />
      <CameraFilter />
      {/* <OrbitControls /> */}
      <TopLight />
      {levelID === 4 && <Pills />}
      {levelID !== 2 && <End ID={levelID} />}
    </>
  );
};
