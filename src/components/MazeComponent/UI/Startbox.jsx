import useMaze from "@/store";
import { uiImages } from "@/assets/mazeAssets";

const Startbox = () => {
  const levelID = useMaze(s => s.levelID);
  const changeGameState = useMaze(s => s.changeGameState);
  return <div className="startbox" 
  style={{
    position: 'absolute',
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backgroundImage: `url(${uiImages.startbox[levelID]})`,
    backgroundSize: '100% 100%',
    cursor: 'pointer',
    backdropFilter: 'blur(5px)',
    zIndex: 103,
  }} onClick={() => changeGameState('playing')}></div>;
};


export default Startbox;
