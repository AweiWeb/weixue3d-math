import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import BlockMaps from "./Map";
import CubeController from "./CubeController";

const Experience = () => {
  return <>
    <PerspectiveCamera position={[3, 6, 15]} fov={45} makeDefault  />
    <ambientLight />
    <BlockMaps />
    <CubeController />
    <OrbitControls />
  </>
};

export default Experience;
