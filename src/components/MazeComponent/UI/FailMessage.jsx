import useMaze from "@/store";
import { uiImages } from "@/assets/mazeAssets";

const FailMessage = () => {
    const changeResetCount = useMaze((state) => state.changeResetCount)
    return (
        <div className="fail-message" 
        style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 100,
            backgroundImage: `url(${uiImages.failBackImg})`,
            backgroundSize: '100% 100%',
            width: '100vw',
            height: '100vh',
            userSelect: 'none',
            }}>
                <div className="resetBtn" onClick={changeResetCount} 
                style={{
                    position: 'absolute',
                    left: '42vw',
                    top: '76vh',
                    width: '14.5vw',
                    height: '7vh',
                    backgroundImage: `url(${uiImages.resetBtn})`,
                    backgroundSize: '100% 100%'
                }}></div>
        </div>
    )
}
export default FailMessage;
