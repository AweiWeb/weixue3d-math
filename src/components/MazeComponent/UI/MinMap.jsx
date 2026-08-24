import useMaze from "@/store"
import { useEffect, useMemo, useState } from "react"
import { useShallow } from "zustand/shallow"
import { useKeyboardControls } from "@react-three/drei";
import { uiImages } from "@/assets/mazeAssets";

const minMapData = {
    // swap: false → top↔x, left↔z（地图1）；swap: true → top↔z, left↔x（其他地图）
    1: { START_POS: { x: 0, z: 2 }, SCALE_V: 6.15, SCALE_H: 3.58, BASE_TOP: 18, BASE_LEFT: 5.5, w: 26.5, h: 34, swap: false },
    2: { START_POS: { x: 0, z: 0 }, SCALE_V: 5.2, SCALE_H: 2.9, BASE_TOP: 27.7, BASE_LEFT: 12.7, w: 26.5, h: 52, swap: true },
    3: { START_POS: { x: 2.8, z: 0 }, SCALE_V: 5.4, SCALE_H: 2.9, BASE_TOP: 28.5, BASE_LEFT: 20.8, w: 26.5, h: 59.5, swap: true },
    4: { START_POS: { x: -3.55, z: 1.8 }, SCALE_V: 7.25, SCALE_H: 3.78, BASE_TOP: 18.5, BASE_LEFT: 0.8, w: 29.5, h: 38.6, swap: true }
}
// 7.25
// 小图时容器左上角基准（与 maze.less 的 .minMap top/right 保持一致）
const SMALL_TOP = 5    // vh
const SMALL_RIGHT = 2  // vw

const MinMap = () => {
    const [isZoomed, setIsZoomed] = useState(false)
    const minmapKey = useKeyboardControls((state) => state.minmap)

    // M 键切换小地图放大/缩小（按下时触发一次，松开不触发）
    useEffect(() => {
        if (minmapKey) setIsZoomed(v => !v)
    }, [minmapKey])
   
    const { levelID, peopleState, gameState } = useMaze(
        useShallow(s => ({ levelID: s.levelID, peopleState: s.peopleState, gameState: s.gameState }))
    )
    const { minAngle, recordPosition } = useMaze(
        useShallow(s => ({ minAngle: s.minAngle, recordPosition: s.recordPosition }))
    )

    // 弧度 → 度
    const cssAngle = useMemo(() => minAngle * (180 / Math.PI), [minAngle])

    // 位置映射：swap=false → X→top, Z→left；swap=true → Z→top, X→left
    // X 正 → top 增加（下移），Z 减小 → left 增加（右移）
    const cssTop = useMemo(() => {
        const data = minMapData[levelID]
        const pos = data.swap ? recordPosition.z : recordPosition.x
        return data.BASE_TOP + pos * data.SCALE_V
    }, [recordPosition.x, recordPosition.z, levelID])
    const cssLeft = useMemo(() => {
        const data = minMapData[levelID]
        const pos = data.swap ? recordPosition.x : recordPosition.z
        const start = data.swap ? data.START_POS.x : data.START_POS.z
        return data.swap ? data.BASE_LEFT + (pos - start) * data.SCALE_H : data.BASE_LEFT - (pos - start) * data.SCALE_H
    }, [recordPosition.x, recordPosition.z, levelID])

    const data = minMapData[levelID]
    // 放大两倍后的宽高与居中位置
    const zoomedW = data.w * 1.5
    const zoomedH = data.h * 1.5

    // 放大后箭头位置：居中偏移 + 容器内偏移 × 2（背景图拉伸两倍）
    const finalTop = isZoomed ? cssTop * 1.5 : cssTop
    const finalLeft = isZoomed ? cssLeft * 1.5 : cssLeft
    
    return <>
    {/* 放大时的全屏模糊遮罩（缩小后淡出） */}
    <div className={isZoomed ? 'minmap-mask show' : 'minmap-mask'} />
    <div className={isZoomed ? 'minMap zoomed' : 'minMap'}
        style={{ 
            backgroundImage: `url(${uiImages.minMap[levelID]})`,
            width: isZoomed ? `${zoomedW}vw` : `${data.w}vw`,
            height: isZoomed ? `${zoomedH}vh` : `${data.h}vh`,
            // 放大时居中：top/left = (100 - 放大后宽高) / 2；缩回时用 less 里的默认值
            top: isZoomed ? `${(100 - zoomedH) / 2}vh` : undefined,
            left: isZoomed ? `${(100 - zoomedW) / 2}vw` : undefined,
        }}>
        {gameState === 'playing' && <div
            className="peopleArrow"
            style={{
                top: `${finalTop}vh`,
                left: `${finalLeft}vw`,
                width: isZoomed ? '2.2vw' : undefined,
                height: isZoomed ? '4vh' : undefined,
                transform: `rotateZ(${-cssAngle}deg)`,
                transition: 'transform 0.3s ease, top 0.3s ease, left 0.3s ease',
            }}
        >
            {/* 迁移方向键过来 */}
            <div className="forward"></div>
            <div className="backward"></div>
            <div className="left"></div>
            <div className="right"></div>
            </div>}
    </div>
    </>
}

export default MinMap