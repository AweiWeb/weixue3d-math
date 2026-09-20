import Experience from "@/components/BadDesignComponent/Experience"
import { Canvas } from "@react-three/fiber"
import BottomTip from "@/components/BadDesignComponent/BottomTip"
import SideButton from "@/components/BadDesignComponent/SIdeButton"
import '../../style/badDesign.less'
const BadDesign = () => {
    return <div className="BadDesign">
        <div className="threeBox">
            <Canvas gl={{ antialias: true }} dpr={[1.5, 2]} camera={{ fov: 45, position: [0, 2, 5] }}>
                <ambientLight intensity={2} />
                <Experience />
            </Canvas>
        </div>
        <BottomTip />
        <SideButton />
    </div>
}


export default BadDesign