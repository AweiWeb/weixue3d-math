import { create } from 'zustand'

export const CUBE_FACES_COLORS = [
    '#CCE216', // 右
    '#CCE216', // 左
    '#16E2B9', // 上
    '#16E2B9', // 下
    '#E29316', // 前
    '#E29316', // 后
]

export const useBadDesign = create((set, get) => ({
    cubeArr: [],
    gameState: 'playing', // 'default' | 'playing'
    maxCount: 100,
    historyCube: [],
    currentState: 'add', // 'add' | 'remove'
    phySicsType: 'fixed', // 'fixed' | 'dynamic'
    deleteVersion: 0,
    prePosition: null,

    // 快照记录（用于撤回）
    _takeSnapshot: () => {
        const { cubeArr, historyCube } = get()
        const nextHistory = [...historyCube, JSON.parse(JSON.stringify(cubeArr))]
        if (nextHistory.length > 50) nextHistory.shift()
        set({ historyCube: nextHistory })
    },

    // 添加方块
    addCube: (position) => {
        const state = get()
        if (
            state.cubeArr.length >= state.maxCount ||
            state.gameState !== 'playing' ||
            state.currentState !== 'add'
        ) {
            return
        }

        state._takeSnapshot()

        const colors = Array.from({ length: 6 }, (_, i) => CUBE_FACES_COLORS[i])
        const newCube = {
            id: `cube-${Date.now()}-${Math.random()}`,
            position,
            color: colors,
            isHidden: false,
        }

        set((state) => ({ cubeArr: [...state.cubeArr, newCube] }))
    },

    // 点击已有方块的面往外堆叠
    handleCubeClick: (e) => {
        e.stopPropagation()
        const state = get()
        if (state.gameState !== 'playing') return

        const targetId = state.cubeArr[e.instanceId].id
        const currentPosition = state.cubeArr.find((c) => c.id === targetId).position
        const faceIndex = Math.floor(e.faceIndex / 2)

        // 右, 左, 上, 下, 前, 后
        const offsets = [
            [currentPosition[0] + 1, currentPosition[1], currentPosition[2]],
            [currentPosition[0] - 1, currentPosition[1], currentPosition[2]],
            [currentPosition[0], currentPosition[1] + 1, currentPosition[2]],
            [currentPosition[0], currentPosition[1] - 1, currentPosition[2]],
            [currentPosition[0], currentPosition[1], currentPosition[2] + 1],
            [currentPosition[0], currentPosition[1], currentPosition[2] - 1],
        ]

        state.addCube(offsets[faceIndex])
    },

    // 切换 添加/删除 模式 (快捷键 V)
    toggleClick: () => {
        set((state) => {
            if (state.currentState === 'add') {
                get().clearPreview()
                return { currentState: 'remove' }
            }
            return { currentState: 'add' }
        })
    },

    // 删除方块
    deleteCube: (e) => {
        const state = get()
        state._takeSnapshot()
        if (state.gameState !== 'playing') return

        e.stopPropagation()
        const instanceId = e.instanceId

        set((state) => {
            const nextArr = [...state.cubeArr]
            if (nextArr[instanceId]) {
                nextArr[instanceId].isHidden = true
            }
            return {
                cubeArr: nextArr,
                deleteVersion: state.deleteVersion + 1,
            }
        })
    },

    // 撤回一步
    withDrawCube: () => {
        const { historyCube } = get()
        if (historyCube.length === 0) return
        const prevCubes = historyCube[historyCube.length - 1]
        set({
            cubeArr: prevCubes,
            historyCube: historyCube.slice(0, -1),
        })
    },

    // 一键物理塌陷模拟
    toggleDestory: () => {
        const state = get()
        if (
            state.gameState !== 'playing' ||
            state.phySicsType === 'dynamic' ||
            state.cubeArr.length === 0
        ) {
            return
        }
        set(() => ({ phySicsType: 'dynamic' }))
    },

    startGame: () => set(() => ({ gameState: 'playing' })),

    resetGame: () => {
        set(() => ({
            cubeArr: [],
            gameState: 'default',
            historyCube: [],
            currentState: 'add',
            phySicsType: 'fixed',
        }))
    },

    setMaxCount: (count) => set(() => ({ maxCount: count })),
    setPreviewCude: (pos) => set(() => ({ prePosition: pos })),
    clearPreview: () => set(() => ({ prePosition: null })),
}))


// 防抖/防误触点击包装
export const filterClickDelta = (callback) => (e) => {
    if (e.delta > 5) return
    e.stopPropagation()
    callback(e)
}