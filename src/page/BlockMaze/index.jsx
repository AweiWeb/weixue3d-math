import { Canvas } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei';
import Experience from '@/components/BlockComponent/Experience.jsx';
import TransitionPop from '@/components/BlockComponent/UI/TransitionPop';
import TipMessage from '@/components/BlockComponent/UI/TipMessage';
import '../../style/blockMaze.less';
import useBlockMaze from '@/store/blockmaze';

const keyMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
]
const BlockMaze = () => {
  const gameState = useBlockMaze((state) => state.gameState)
  return <div className="block-maze">
    {gameState === 'init' && <TransitionPop />}
    <KeyboardControls map={keyMap}>
      <div className="block-maze-container">
        <Canvas gl={{ antialias: true }} camera={{ position: [0, 0, 5] }} shadows>
          <Experience />
        </Canvas>
      </div>
    </KeyboardControls>
    <TipMessage />
  </div>;
};
export default BlockMaze;
