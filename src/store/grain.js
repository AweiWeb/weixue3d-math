import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"

/*
* UI面板改变数据
*/
const useGrain = create(subscribeWithSelector((set, get) => {
    return {
        //默认 大米 模式 
        // 'rice' | 'cube'
        mode: 'rice',
        changeMode: (mode) => {
            set({ mode })
        },

        riceX: 3,
        riceY: 3,
        riceZ: 3,
        changeRice: (riceX, riceY, riceZ) => {
            console.log(riceX, riceX, riceY);

            set({
                riceX,
                riceY,
                riceZ
            })
        },
        opX: 'none',  // 'none' | 'cut' | 'highlight'
        opY: 'none',
        opZ: 'none',

        cutX: 0,   // 0 表示没有切割
        cutY: 0,
        cutZ: 0,

        gapX: 0,   // 切割/高亮层在 X 方向的偏移距离
        gapY: 0,
        gapZ: 0,
        changeGap: (gapX, gapY, gapZ) => {
            set({ gapX, gapY, gapZ })
        },
        //根据检测到的操作改变opX, opY, opZ
        changeOp: (opX, opY, opZ) => {
            // console.log("changeOp", opX, opY, opZ)
            set({
                opX,
                opY,
                opZ
            })
        },
        // 要切割的数量
        changeCut: (cutX, cutY, cutZ) => {
            // console.log("changeCut", cutX, cutY, cutZ)
            set({
                cutX,
                cutY,
                cutZ
            })
        },

        // 返回每个轴需要切割的
        allCut: () => { return [get().cutX, get().cutY, get().cutZ] },
        allCutOp: () => { return [get().opX, get().opY, get().opZ] }
    }
}))


export default useGrain