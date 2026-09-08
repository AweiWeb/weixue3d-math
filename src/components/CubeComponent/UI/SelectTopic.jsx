import useCubeBreak from "@/store/cubeBreak"
import { useState } from "react" // 引入 useState

const SelectTopic = () => {
    const cubeTopicData = useCubeBreak((state) => state.cubeTopicData)
    // 引入刚刚在 store 中新增的方法
    const changeTopicId = useCubeBreak((state) => state.changeTopicId)
    const [hoveredId, setHoveredId] = useState(null)
    const setPopVisible = useCubeBreak((state) => state.setPopVisible)
    return (
        <div className="select-topic">
            {cubeTopicData.map((item) => {
                const imgSuffix = hoveredId === item.id ? 2 : 1
                return (
                    <div
                        key={item.id} // 列表渲染记得加 key
                        className={`topic topic${item.id}`}
                        onMouseEnter={() => setHoveredId(item.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onClick={() => { changeTopicId(item.id), setPopVisible(true) }}
                        style={{
                            backgroundImage: `url(http://wx-distribution.oss-cn-hangzhou.aliyuncs.com/distribution/20220427/cubeShow/topic${item.id}-${imgSuffix}.png)`
                        }}
                    >
                    </div>
                )
            })}
        </div>
    )
}

export default SelectTopic