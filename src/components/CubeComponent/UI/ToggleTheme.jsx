import useCubeBreak from "@/store/cubeBreak"

const ToggleTheme = () => {
    const setTheme = useCubeBreak((state) => state.setTheme)
    const theme = useCubeBreak((state) => state.theme)
    console.log(theme, 'dad');

    return <div className="theme-color" style={{
        position: 'absolute',
        width: '11.56vw',
        height: '4.62vh',
        backgroundImage: `url(http://wx-distribution.oss-cn-hangzhou.aliyuncs.com/distribution/20220427/cubeShow/${theme}.png)`,
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