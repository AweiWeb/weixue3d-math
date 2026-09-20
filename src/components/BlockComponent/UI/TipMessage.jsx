import { tipMessageImgUrl } from "@/assets/blockAssets"

const TipMessage = () => {
    return <div class="tip-message"
        style={{
            position: 'absolute',
            left: '25vw',
            top: '88vh',
            width: '50vw',
            height: '4.3vh',
            zIndex: '3',
            'backgroundImage': `url(${tipMessageImgUrl})`,
            'backgroundSize': '100% 100%'
        }}
    ></div>
}

export default TipMessage