import useCubeBreak from '../../../store/cubeBreak'
import { cubeShowImages } from '@/assets/diceAssets'
const SelectBroad = () => {
    const cubeSelectData = useCubeBreak((state) => state.cubeSelectData)
    // 1. 获取当前选中的 ID 和修改方法
    const currentCubeId = useCubeBreak((state) => state.currentCubeId)
    const changeCubeId = useCubeBreak((state) => state.changeCubeId)

    return (
        <div className="selectBroad">
            {cubeSelectData.map((item) => {
                const isSelected = item.id === currentCubeId;
                return (
                    <div
                        key={item.id}
                        className={`select ${isSelected ? 'active' : ''}`}
                        onClick={() => changeCubeId(item.id)}
                        style={{
                            // 4. 根据 isSelected 动态切换图片 (2: 选中态, 1: 默认态)
                            backgroundImage: `url(${cubeShowImages.show[item.id][isSelected ? 2 : 1]})`
                        }}
                    ></div>
                )
            })}
        </div>
    )
}

export default SelectBroad