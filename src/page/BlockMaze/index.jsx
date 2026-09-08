import { Canvas } from '@react-three/fiber';
import Experience from '@/components/BlockComponent/Experience.jsx';
import '../../style/blockMaze.less';
import { KeyboardControls } from '@react-three/drei';
const keyMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
]
const BlockMaze = () => {

  return <div className="block-maze">
    <KeyboardControls map={keyMap}>
      <div className="block-maze-container">
        <Canvas gl={{ antialias: true }} camera={{ position: [0, 0, 5] }} shadows>
          <Experience />
        </Canvas>
      </div>
    </KeyboardControls>
  </div>;
};
export default BlockMaze;
