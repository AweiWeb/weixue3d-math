import useCubeBreak from "@/store/cubeBreak"
import { cubeShowImages } from '@/assets/diceAssets'
const ToggleTheme = () => {
    const setTheme = useCubeBreak((state) => state.setTheme)
    const theme = useCubeBreak((state) => state.theme)
    console.log(theme, 'dad');

    return <div className="theme-color" style={{
        position: 'absolute',
        width: '11.56vw',
        height: '4.62vh',
        backgroundImage: `url(${cubeShowImages[theme]})`,
        backgroundSize: '100% 100%',
        top: '4vh',
        right: '2vw',
        zIndex: 100,
    }}>
        <div className="lightColor" style={{
            position: 'absolute',
            width: '4.5vw',
            height: '4vh',
            left: '0.8vw',
            top: '0.3vh'
        }} onClick={() => setTheme('light')}></div>
        <div className="darkColor"
            style={{
                position: 'absolute',
                width: '4.5vw',
                height: '4vh',
                right: '0.8vw',
                top: '0.3vh'
            }}
            onClick={() => setTheme('dark')}></div>
    </div>
}

export default ToggleTheme