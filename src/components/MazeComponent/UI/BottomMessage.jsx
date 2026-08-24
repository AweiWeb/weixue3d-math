import { uiImages } from "@/assets/mazeAssets";

const BottomMessage = () => {
    return <div className="bottom-message"
     style={{
        position: 'absolute',
        bottom: '2vh',
        left: '28.5vw',
        width: '42.76vw',
        height: '4vh',
        backgroundImage: `url(${uiImages.messageMaze})`,
        backgroundSize: '100% 100%'
        }}></div>
}
export default BottomMessage
