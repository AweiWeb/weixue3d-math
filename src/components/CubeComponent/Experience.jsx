import useCubeBreak from "@/store/cubeBreak";
import CubeDemo from "./CubeDemo";
import SceneEnvironment from "./SceneEnvironment";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";

const Experience = () => {
    const currentCubeId = useCubeBreak((state) => state.currentCubeId)

    return <>
        <CubeDemo key={currentCubeId} name={currentCubeId} />
        <SceneEnvironment />
        <PerspectiveCamera position={[0, 6, 25]} fov={45} makeDefault />
        {/* <axesHelper args={[50, 50, 50]} /> */}
        <OrbitControls />
    </>
}

export default Experience
