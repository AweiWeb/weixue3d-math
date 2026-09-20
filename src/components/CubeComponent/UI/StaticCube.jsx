import useCubeBreak from "@/store/cubeBreak"
import { cubeShowImages } from '@/assets/diceAssets'
const StaticCube = () => {
    const currentCubeId = useCubeBreak((state) => state.currentCubeId)

    return <div className="static-cube">
        <div className="cubeImg"
            style={{
                backgroundImage: `url(${cubeShowImages.cubeStatic[currentCubeId]})`
            }}></div>
    </div>
}

export default StaticCube