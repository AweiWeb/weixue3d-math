import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import CubeDemo from "./CubeDemo";
const Experience = () => {
    return <>
        <ambientLight />
        <CubeDemo />
        <PerspectiveCamera position={[0, 6, 25]} fov={45} makeDefault  />
        <OrbitControls />
    </>
}

export default Experience
