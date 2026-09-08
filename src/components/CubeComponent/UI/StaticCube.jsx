import useCubeBreak from "@/store/cubeBreak"

const StaticCube = () => {
    const currentCubeId = useCubeBreak((state) => state.currentCubeId)
    return <div className="static-cube">
        <div className="cubeImg"
            style={{
                backgroundImage: `url(http://wx-distribution.oss-cn-hangzhou.aliyuncs.com/distribution/20220427/cubeShow/cubeStatic${currentCubeId}.png)`
            }}></div>
    </div>
}

export default StaticCube