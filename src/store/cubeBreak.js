import { theme } from 'antd'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
const createCubeTypeData = () => {
    return Array.from({ length: 11 }, (_, i) => {
        return {
            id: i + 1,
            name: `cube${i + 1}`,
        }
    })
}
const createCubeTopic = () => {
    return Array.from({ length: 3 }, (_, i) => {
        return {
            id: i + 1,
            name: `topic${i + 1}`
        }
    })
}
const initialDiceState = {
    top: 4,
    bottom: 3,
    front: 1,
    back: 6,
    left: 5,
    right: 2
}
/*
* 创建地图信息
*/
const dicePoint = [2, 4, 5, 3, 2, 1, 6, 6, 2, 1, 6, 4, 5, 3, 4, 6, 3, 6, 2, 1, 5, 6, 5, 4, 6, 3, 2, 4, 2, 5, 2, 6, 3, 6, 1, 3]
const generateMapCenter = () => {
    const centers = []
    const gridSize = 6;
    const cellSize = 5;
    const zGlobalOffset = -2.5;
    const offset = (gridSize - 1) / 2;
    /*
    * 加入起点
    */
    // centers.push({
    //     row: -1,
    //     col: 0,
    //     position: [-17.5, 2.65, -12.5], // Y 轴默认给 0
    //     point: 3
    // })
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            // 计算局部坐标 (以 0,0 为中心)
            const localX = (col - offset) * cellSize;
            const localZ = (row - offset) * cellSize;
            const index = row * gridSize + col
            // 加上全局偏移
            const globalX = localX;
            const globalZ = localZ + zGlobalOffset;

            centers.push({
                row: row,
                col: col,
                position: [globalX, 2.65, globalZ], // Y 轴默认给 0
                point: dicePoint[index]
            });
        }
    }
    /*
    * 加入最后一个成功的点
    */
    centers.push({
        row: 6,
        col: 5,
        position: [17.5, 2.65, 10], // Y 轴默认给 0
        point: 6
    })
    return centers;
}

/*
* 骰子 的当前面的点数是多少需要记录
*/
const useCubeBreak = create(persist((set, get) => {
    return {
        currentCubeId: 1,
        gameState: 'playing',
        currentProgress: 0,
        animationDuration: 0,
        topicId: 1,
        levelID: 1,
        theme: 'light', //light | dark
        diceState: {
            ...initialDiceState
        },
        initPosition: [-17.5, 2.65, -12.5],
        resetDiceState: () => set({ diceState: { ...initialDiceState }, gameState: 'playing', initPosition: [-17.5, 2.65, -12.5] }),
        /*
        * 预先获取翻转点数
        */
        preDicePoint: (direction) => {
            const state = get().diceState
            switch (direction) {
                case 'forward':
                    return state.front
                case 'backward':
                    return state.back
                case 'left':
                    return state.left
                case 'right':
                    return state.right
                default: return state.bottom
            }
        },
        /*
        * 修改骰子面对应的点数
        */
        rollDiceLogic: (direction) => set((state) => {
            const { top, bottom, front, back, left, right } = state.diceState
            let newState = { ...state.diceState }

            switch (direction) {
                case 'forward':
                    newState = { ...state.diceState, top: back, back: bottom, bottom: front, front: top }
                    break;
                case 'backward':
                    newState = { ...newState, top: front, front: bottom, bottom: back, back: top };
                    break;
                case 'left':
                    newState = { ...newState, top: right, right: bottom, bottom: left, left: top };
                    break;
                case 'right':
                    newState = { ...newState, top: left, left: bottom, bottom: right, right: top };
                    break;
            }
            return { diceState: newState }
        }),

        cubeSelectData: createCubeTypeData(),
        cubeTopicData: createCubeTopic(),
        isPopVisible: false,
        mapData: generateMapCenter(),
        setPopVisible: (visible) => set({ isPopVisible: visible }),
        changeCubeId: (id) => set({ currentCubeId: id, currentProgress: 0 }),
        setProgress: (progress) => set({ currentProgress: progress }),
        setAnimationDuration: (duration) => set({ animationDuration: duration }),
        setCurrentProgress: (progress) => set({ currentProgress: progress }),
        changeLevelID: (id) => set({ levelID: id }),
        changeTopicId: (id) => set({ topicId: id, currentProgress: 0 }),
        setTheme: (newTheme) => set({ theme: newTheme }),
        setGameState: (game) => set({ gameState: game })
    }
}, {
    name: 'cube-dice-game',
    partialize: (state) => ({
        levelID: state.levelID,
        theme: state.theme
    })
}))


export default useCubeBreak