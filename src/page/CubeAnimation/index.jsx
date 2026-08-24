import Experience from '@/components/CubeComponent/Experience.jsx';
import {Canvas} from '@react-three/fiber';
import '../../style/cubeAnimation.less'
const CubeAnimation = () => {
    return <div className="cube-animation">
        <div className="cubeCanvas">
            <Canvas dpr={[1.5, 2]} gl={{antialias: true}}>
                <Experience />
            </Canvas>
        </div>
    </div>
}
export default CubeAnimation;
