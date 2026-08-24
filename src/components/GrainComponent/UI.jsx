import { Slider } from 'antd'
import { useState } from 'react'
import useGrain from '../../store/grain'

const UI = () => {
    const changeRice = useGrain(state => state.changeRice)
    const changeGap = useGrain(state => state.changeGap)
    const changeMode = useGrain(state => state.changeMode)
    const mode = useGrain(state => state.mode)
    const [countx, setValueX] = useState('3')
    const [county, setValueY] = useState('3')
    const [countz, setValueZ] = useState('3')
    const handleChangeX = (value) => {
        // console.log(value);
        setValueX(value)
    }
    const handleChangeY = (value) => {
        setValueY(value)
    }
    const handleChangeZ = (value) => {
        setValueZ(value)
    }
    // "10-2" → total=10, op='cut', cut=2
    // "5+1"  → total=5,  op='highlight', cut=1
    // "3"    → total=3,  op='none', cut=0
    const parseInput = (str) => {
        const clearStr = str.trim()
        const match = clearStr.match(/^(\d+)([-+])?(\d+)?$/)
        if (!match) return { total: 3, op: 'none', cut: 0 }
        const total = parseInt(match[1]) || 3
        const opChar = match[2]
        // console.log(match);
        const cut = parseInt(match[3]) || 0
        const op = opChar === '-' ? 'cut' : opChar === '+' ? 'highlight' : 'none'
        return { total, op, cut }
    }

    const primaryValue = () => {
        const x = parseInput(countx)
        const y = parseInput(county)
        const z = parseInput(countz)

        // highlight 模式下 total 需要加上 cut 层数
        changeRice(
            x.op === 'highlight' ? x.total + x.cut : x.total,
            y.op === 'highlight' ? y.total + y.cut : y.total,
            z.op === 'highlight' ? z.total + z.cut : z.total
        )
        useGrain.getState().changeOp(x.op, y.op, z.op)
        useGrain.getState().changeCut(x.cut, y.cut, z.cut)
    }
    const handleSliderX = (value) => {
        useGrain.getState().changeGap(value, useGrain.getState().gapY, useGrain.getState().gapZ)
    }
    const handleSliderY = (value) => {
        useGrain.getState().changeGap(useGrain.getState().gapX, value, useGrain.getState().gapZ)
    }
    const handleSliderZ = (value) => {
        useGrain.getState().changeGap(useGrain.getState().gapX, useGrain.getState().gapY, value)
    }
    return <div className="grain-ui">
        <input type='text' defaultValue={countx} className='grain-input riceX-input' onChange={(e) => handleChangeX(e.target.value)} />
        <input type='text' defaultValue={county} className='grain-input riceY-input' onChange={(e) => handleChangeY(e.target.value)} />
        <input type='text' defaultValue={countz} className='grain-input riceZ-input' onChange={(e) => handleChangeZ(e.target.value)} />
        <Slider defaultValue={0} min={0} max={5} step={0.1} tooltip={{ open: false }} className='riceX-slider' onChange={handleSliderX} />
        <Slider defaultValue={0} min={0} max={5} step={0.1} tooltip={{ open: false }} className='riceY-slider' onChange={handleSliderY} />
        <Slider defaultValue={0} min={0} max={5} step={0.1} tooltip={{ open: false }} className='riceZ-slider' onChange={handleSliderZ} />
        <div className='modeSelect' style={{'backgroundImage': `url(http://wx-distribution.oss-cn-hangzhou.aliyuncs.com/distribution/20220427/grain-3d/mode-${mode}.png)`}}>
        <div className='modeSelect-left' onClick={() => changeMode('rice')}></div>
        <div className='modeSelect-right' onClick={() => changeMode('cube')}></div>
        </div>
        <div className='grain-primary-button' onClick={primaryValue}></div>
    </div>
}


export default UI