import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import CubeDemo from "./CubeDemo"
import SceneEnvironment from "./SceneEnvironment"
import useCubeBreak from "@/store/cubeBreak"

const Experience2 = () => {
    const topicId = useCubeBreak((state) => state.topicId)

    return <>
        <SceneEnvironment />
        <PerspectiveCamera position={[5, 10, 25]} fov={45} makeDefault />
        <CubeDemo key={topicId} name={topicId} />
        <OrbitControls />
    </>
}

export default Experience2