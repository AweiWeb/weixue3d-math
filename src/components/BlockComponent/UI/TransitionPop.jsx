import useBlockMaze from "@/store/blockmaze"
import { blockLevelUrls } from "@/assets/blockAssets"

const TransitionPop = () => {
    const changeGameState = useBlockMaze((state) => state.changeGameState)
    const levelID = useBlockMaze((state) => state.levelID)
    return <div className="transition-pop" style={{
        position: 'absolute',
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: '10'
    }} onClick={() => changeGameState('playing')}>
        <div className="pop-message"
            style={{
                width: '100%',
                height: '100%',
                'backgroundImage': `url(${blockLevelUrls[levelID]})`,
                'backgroundSize': '100% 100%'
            }}
        ></div>
    </div>
}


export default TransitionPop