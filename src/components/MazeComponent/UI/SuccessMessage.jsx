import useMaze from "@/store";
import { uiImages } from "@/assets/mazeAssets";

const SuccessMessage = () => {
    const levelID = useMaze((state) => state.levelID);
    const changeLevelID = useMaze((state) => state.changeLevelID);

    return (
        <div className="success-message">
            <div className="success-content"></div>
            <div className="next-btn" 
            style={{
                position: 'absolute',
                left: '43vw',
                top: '58vh',
                width: '13.8vw',
                height: '6.75vh',
                background: `url("${uiImages.primary}")`,
                backgroundSize: '100% 100%',
                cursor: 'pointer',
            }}
            onClick={() => changeLevelID(levelID + 1)}
            ></div>
        </div>
    );
};
export default SuccessMessage;
