const BottomTip = () => {
    return <div className="bottom-tip" style={{
        position: 'absolute',
        width: '80vw',
        height: '4.8vh',
        top: '90vh',
        left: '10vw',
        'backgroundImage': `url('/badDesign/bottomTip.png')`,
        'backgroundSize': '100% 100%',
        zIndex: 10
    }}>
    </div>
}

export default BottomTip