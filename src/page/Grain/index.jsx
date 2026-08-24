import { Canvas } from "@react-three/fiber"
import Experience from "../../components/GrainComponent/Experience"
import { Perf } from "r3f-perf"
import GrainLight from "../../components/GrainComponent/GrainLight"
import UI from "@/components/GrainComponent/UI"
import '../../style/grain.less'
import { Leva } from 'leva'
const Grain = () => {
  return (
    <div className="grain-home">
      <div className="main-home">
        <Leva  hidden/>
        <div className="main">
          <Canvas
            dpr={[1, 2]}
            gl={{ antialias: true }}
            camera={{ position: [3, 4, 10], fov: 45 }}
            style={{
              background: 'radial-gradient(circle at 50% 50%, #4a4a4a 0%, #111111 100%)'
            }}
          >
            <ambientLight intensity={1} />
            <Experience />
            
            {/* <Perf position="bottom-right" /> */}
            <GrainLight />
          </Canvas>
        </div>
      </div>
      <UI />
    </div>
  )
}

export default Grain
