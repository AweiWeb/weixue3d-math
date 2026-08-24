import { Canvas } from "@react-three/fiber"
import { KeyboardControls } from "@react-three/drei"
import { Perf } from "r3f-perf"
import { Leva } from "leva"
import { Experience } from "../../components/MazeComponent/Experience"
import MinMap from "@/components/MazeComponent/UI/MinMap"
import SelectDirection from "@/components/MazeComponent/UI/SelectDirection"
import BottomMessage from "@/components/MazeComponent/UI/BottomMessage"
import FailMessage from "@/components/MazeComponent/UI/FailMessage"
import SuccessMessage from "@/components/MazeComponent/UI/SuccessMessage.jsx"; 
import Startbox from "@/components/MazeComponent/UI/Startbox";
import LevelSelect from "@/components/MazeComponent/UI/LevelSelect";
 
import '../../style/maze.less'
import useMaze from "@/store";


const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "run", keys: ["Shift"] },
  { name: "reset", keys: ["KeyC"] },
  { name: "minmap", keys: ["KeyM"] },
]

const Maze = () => {
  const peopleState = useMaze((state) => state.peopleState)
  const gameState = useMaze((state) => state.gameState)
  const levelID = useMaze((state) => state.levelID)
  return (
    <div className="MazeHome">
      <Leva hidden />
      <KeyboardControls map={keyboardMap}>
        <div className="main">
          <Canvas
            // shadows
            dpr={[1.5, 2]}
            gl={{ antialias: true }}
          >
            {/* <Perf position="top-left" /> */}
            <Experience />
          </Canvas>
        </div>
        <MinMap />
        <BottomMessage />
        {peopleState === 'idle' && gameState === 'playing' && <SelectDirection />}
        {gameState === 'gameOver' && levelID === 4 && <FailMessage />}
        {gameState === 'success' && levelID !== 4 && <SuccessMessage />}
      </KeyboardControls>
      {/* {gameState === 'init' && <Startbox />} */}
      <LevelSelect />
    </div>
  )
}

export default Maze
