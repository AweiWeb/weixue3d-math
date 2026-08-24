import useMaze from "@/store";
import { uiImages } from "@/assets/mazeAssets";
import { useMemo, useState } from "react";
import * as THREE from "three";

const SelectDirection = () => {
    const [hovered, setHovered] = useState(null)

    const changeDirectionState = useMaze((state) => state.changeDirectionState)
    const levelID = useMaze((state) => state.levelID)
    const mapMarks = useMaze((state) => state.mapMarks)
    const recordPosition = useMaze((state) => state.recordPosition)
    const moveDirection = useMaze((state) => state.moveDirection)
    const peopleState = useMaze((state) => state.peopleState)

    /*
    * 停下后根据当前 mark 的 direction 数据计算可用按钮
    * 朝向映射：-z=1 +x=2 +z=3 -x=4
    */
    const allowedBtns = useMemo(() => {
        if (peopleState !== 'idle') return []
        const marks = mapMarks[levelID] || []
        // 找离人物最近的 mark
        let cur = null, minDist = Infinity
        for (const m of marks) {
            const d = new THREE.Vector3(...m.position).distanceTo(recordPosition)
            if (d < minDist) {
                minDist = d
                cur = m
            }
        }
        if (!cur || !cur.direction) return []
        // 当前朝向转成 1/2/3/4
        const md = moveDirection
        let key = 1
        if (md.z < -0.5) key = 1
        else if (md.x > 0.5) key = 2
        else if (md.z > 0.5) key = 3
        else if (md.x < -0.5) key = 4
        return cur.direction[key] || []
    }, [peopleState, mapMarks, levelID, recordPosition, moveDirection])

    const directionBtnArr = useMemo(() => {
        return ['forward','left', 'backward', 'right'].map((direction) => {
            return { id: direction };
        })
    }, []);

    const getState = (id) => {
        if (!allowedBtns.includes(id)) return 3
        return hovered === id ? 2 : 1
    }

    const handleClick = (id) => {
        if (!allowedBtns.includes(id)) return
        changeDirectionState(id, true)
    }

    return (
        <div className="select-direction">
            <div className="direction-row row-top">
                {directionBtnArr.filter(d => d.id === 'forward').map(direction => (
                    <div
                        key={direction.id}
                        className="direction-btn"
                        data-dir={direction.id}
                        style={{backgroundImage: `url(${uiImages.direction.forward[getState(direction.id)]})`}}
                        onMouseEnter={() => setHovered(direction.id)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={() => handleClick(direction.id)}
                    />
                ))}
            </div>
            <div className="direction-row row-bottom">
                {directionBtnArr.filter(d => d.id !== 'forward').map(direction => (
                    <div
                        key={direction.id}
                        className="direction-btn"
                        data-dir={direction.id}
                        style={{backgroundImage: `url(${uiImages.direction[direction.id][getState(direction.id)]})`}}
                        onMouseEnter={() => setHovered(direction.id)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={() => handleClick(direction.id)}
                    />
                ))}
            </div>
        </div>
    );
};


export default SelectDirection;
