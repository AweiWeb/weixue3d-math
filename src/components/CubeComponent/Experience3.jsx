import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import SceneEnvironment from "./SceneEnvironment"
import Dice from "./Dice"
import Map from "./Map"
import { EffectComposer, Vignette } from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"
const Experience3 = () => {
    return <>
        <PerspectiveCamera
            makeDefault
            fov={40}
            position={[0, 34, 30]}
            onUpdate={(camera) => camera.lookAt(0, 0, 0)}
        />
        <SceneEnvironment isGrid={true} gridSize={[3, 3]} lightInstenity={3} />
        <Dice />
        <Map position={[0, 0, -2.5]} />
        {/* <OrbitControls /> */}
        <EffectComposer>
            <Vignette
                offset={0.1} // vignette offset
                darkness={0.15} // vignette darkness
                eskil={false} // Eskil's vignette technique
                blendFunction={BlendFunction.NORMAL} // blend mode
            />
        </EffectComposer>
    </>
}

export default Experience3