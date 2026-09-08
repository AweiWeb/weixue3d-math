import useCubeBreak from "@/store/cubeBreak"
import { Grid } from "@react-three/drei"
const SceneEnvironment = ({ isGrid = true, lightInstenity = 3, gridSize = [5, 5], isTransparent = false, ...prop }) => {
    const theme = useCubeBreak((state) => state.theme)
    return <>
        <ambientLight color={'#fff'} intensity={lightInstenity} />
        {isGrid && <Grid
            position={[0, -0.1, 0]}
            cellSize={gridSize[0]}
            sectionSize={gridSize[1]}
            sectionColor="#ffffff"
            cellColor="#ffffff"
            args={[100, 100]}
            sectionThickness={0.6}
            cellThickness={0.6}
        />}
        <color attach="background" args={[`${theme === 'light' ? '#f9f9f9' : 'rgba(55, 55, 55, 1)'}`]} />
    </>
}


export default SceneEnvironment