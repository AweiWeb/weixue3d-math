import { cubeShowImages } from '@/assets/diceAssets'
const LookRule = () => {
    return <div className="rule-btn"
        style={{
            position: 'absolute',
            top: '72vh',
            left: '3vw',
            width: '13.02vw',
            height: '25.18vh',
            backgroundImage: `url(${cubeShowImages.ruleBtn})`,
            backgroundSize: '100% 100%',
            zIndex: 10,
        }}
    >
    </div>
}

export default LookRule