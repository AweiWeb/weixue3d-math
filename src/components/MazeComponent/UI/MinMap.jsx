import useMaze from "@/store"
import { useEffect, useMemo, useState } from "react"
import { useShallow } from "zustand/shallow"
import { useKeyboardControls } from "@react-three/drei";
import { uiImages } from "@/assets/mazeAssets";
import * as THREE from 'three'
const minMapData = {
    // swap: false → top↔x, left↔z（地图1）；swap: true → top↔z, left↔x（其他地图）
    1: { START_POS: { x: 0, z: 2 }, SCALE_V: 6.15, SCALE_H: 3.58, BASE_TOP: 17, BASE_LEFT: 4.85, w: 26.5, h: 34, swap: false },
    2: { START_POS: { x: 0, z: 0 }, SCALE_V: 5.2, SCALE_H: 2.9, BASE_TOP: 26.8, BASE_LEFT: 12.3, w: 26.5, h: 52, swap: true },
    3: { START_POS: { x: 2.8, z: 0 }, SCALE_V: 5.4, SCALE_H: 2.9, BASE_TOP: 27, BASE_LEFT: 20.2, w: 26.5, h: 59.5, swap: true },
    4: { START_POS: { x: -3.55, z: 1.8 }, SCALE_V: 7.25, SCALE_H: 3.78, BASE_TOP: 17.7, BASE_LEFT: 0.3, w: 29.5, h: 38.6, swap: true }
}
// 7.25
// 小图时容器左上角基准（与 maze.less 的 .minMap top/right 保持一致）
const SMALL_TOP = 5    // vh
const SMALL_RIGHT = 2  // vw

const MinMap = () => {
    const { levelID, peopleState, gameState } = useMaze(
        useShallow(s => ({ levelID: s.levelID, peopleState: s.peopleState, gameState: s.gameState }))
    )
    const { minAngle, recordPosition } = useMaze(
        useShallow(s => ({ minAngle: s.minAngle, recordPosition: s.recordPosition }))
    )
    const [isZoomed, setIsZoomed] = useState(false)
    const minmapKey = useKeyboardControls((state) => state.minmap)
    const [hovered, setHovered] = useState(null)
    // 空格键切换：地图优先（false）/ 人物优先（true）
    const [arrowMode, setArrowMode] = useState(false)
    const changeDirectionState = useMaze((state) => state.changeDirectionState)
    const mapMarks = useMaze((state) => state.mapMarks)
    const moveDirection = useMaze((state) => state.moveDirection)

    // 原封不动保留你的核心寻路逻辑
    const allowedBtns = useMemo(() => {
        if (peopleState !== 'idle') return []
        const marks = mapMarks[levelID] || []
        let cur = null, minDist = Infinity
        for (const m of marks) {
            const d = new THREE.Vector3(...m.position).distanceTo(recordPosition)
            if (d < minDist) {
                minDist = d
                cur = m
            }
        }
        if (!cur || !cur.direction) return []
        const md = moveDirection
        let key = 1
        if (md.z < -0.5) key = 1
        else if (md.x > 0.5) key = 2
        else if (md.z > 0.5) key = 3
        else if (md.x < -0.5) key = 4
        return cur.direction[key] || []
    }, [peopleState, mapMarks, levelID, recordPosition, moveDirection])

    // 获取按钮图片状态 (3: 禁用, 2: hover, 1: 正常)
    const getState = (id) => {
        if (!allowedBtns.includes(id)) return 3
        return hovered === id ? 2 : 1
    }

    const handleClick = (id) => {
        if (!allowedBtns.includes(id)) return
        changeDirectionState(id, true)
    }



    // M 键切换小地图放大/缩小（按下时触发一次，松开不触发）
    useEffect(() => {
        if (minmapKey) setIsZoomed(v => !v)
    }, [minmapKey])

    // 空格键切换地图/人物层级
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space') {
                e.preventDefault() // 阻止页面滚动
                setArrowMode(v => !v)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])



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
            {/* 箭头容器 层级可调整 */}
            <div className="arrowContainer"
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${uiImages.maskMap[levelID]})`,
                    backgroundSize: '100% 100%',
                    zIndex: arrowMode ? 1 : 5,
                    opacity: arrowMode ? 0.5 : 1,
                    transition: 'opacity 0.3s ease, z-index 0.3s ease',
                    pointerEvents: 'none',
                }}></div>
            {gameState === 'playing' && <div
                className="peopleArrow"
                style={{
                    top: `${finalTop}vh`,
                    left: `${finalLeft}vw`,
                    width: isZoomed ? '2.2vw' : undefined,
                    height: isZoomed ? '4vh' : undefined,
                    transform: `rotateZ(${-cssAngle - (levelID === 1 ? 0 : 90)}deg)`,
                    transition: 'transform 0.3s ease, top 0.3s ease, left 0.3s ease, opacity 0.3s ease, z-index 0.3s ease',
                    zIndex: arrowMode ? 5 : 1,
                    opacity: arrowMode ? 1 : 0.5,
                }}
            >
                {['forward', 'backward', 'left', 'right'].map((dir) => (
                    <div
                        key={dir}
                        // 如果不包含在 allowedBtns 中，加上 disabled 类名进行样式和指针拦截
                        className={`dir-btn ${dir} ${!allowedBtns.includes(dir) ? 'disabled' : ''}`}
                        onMouseEnter={() => setHovered(dir)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClick(dir);
                        }}
                    />
                ))}
            </div>}
        </div>
    </>
}

export default MinMap