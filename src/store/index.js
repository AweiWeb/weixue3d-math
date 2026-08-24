import { create } from "zustand";
import * as THREE from 'three'



const useMaze = create((set, get) => ({
    initPosition: [[0, 0.03, 2], [0, 0.09, 0], [2.8, 0.05, 4.2], [-3.55, 0.05, 1.8]],
    recordPosition: new THREE.Vector3(0, 0, 0),
    moveDirection: new THREE.Vector3(0, 0, -1), // 人物当前朝向 -z=1 +x=2 +z=3 -x=4
    rotationY: new THREE.Quaternion(),
    currentPills: [], // 'red' | 'blue'
    minAngle: 0,
    levelID: 1, // 1 | 2 | 3 | 4
    gameState: 'init', // 'init' | 'playing' | 'gameOver' | 'success'
    peopleState: 'idle', // 'idle' | 'moving'
    mapMeshes: [],
    directionState: { forward: false, backward: false, left: false, right: false },
    resetCount: 0,
    // 每个地图的标记点
    // 地图1 加上
    // -z x z -x
    mapMarks: {
        1: [
            // 第一关路口（自动生成）
            { position: [-2.1, 0.03, 2], direction: { 1: [], 2: [], 3: ['left'], 4: ['right'] } },
            { position: [2.1, 0.03, 2], direction: { 1: [], 2: ['left'], 3: ['right'], 4: [] } },
            { position: [2.1, 0.03, -0.05], direction: { 1: ['left', 'forward'], 2: ['right'], 3: ['forward'], 4: [] } },
            { position: [0, 0.03, -0.05], direction: { 1: ['forward', 'right'], 2: ['forward', 'left'], 3: ['forward', 'right', 'left'], 4: ['right', 'left'] } },
            { position: [-2.1, 0.03, -0.05], direction: { 1: ['forward', 'right'], 2: [], 3: ['forward'], 4: ['left'] } },
            { position: [2.1, 0.03, -2.1], direction: { 1: ['left'], 2: ['right'], 3: [], 4: [] } },
            { position: [-2.1, 0.03, -2.1], direction: { 1: ['right'], 2: [], 3: [], 4: ['left'] } },
            { position: [0, 0.03, -2.1], direction: { 1: ['left', 'right'], 2: ['right', 'forward'], 3: [], 4: ['forward', 'right'] } },
            { position: [0, 0.03, 2], direction: { 1: ['forward', 'left'], 2: ['left'], 3: ['right', 'left'], 4: ['right'] } },
        ],
        2: [
            { position: [0, 0.08, 2], direction: {1: [], 2: ['forward'], 3: ['forward', 'left'], 4: ['left']} },
            { position: [0, 0.08, -2], direction: {1: ['forward', 'right'], 2: ['forward', 'left'], 3: ['left'], 4: ['right']} },
            { position: [0, 0.1, 0], direction: {1: ['forward', 'backward'], 2: [], 3: ['forward'], 4: []} },
            { position: [0, 0.08, 4], direction: {1: [], 2: ['forward'], 3: ['left', 'right'], 4: ['forward']} },
            { position: [0, 0.08, -4], direction: {1: ['left', 'right'], 2: ['forward'], 3: ['left', 'right'], 4: ['forward']} },
            { position: [4, 0.08, 0], direction: {1: ['forward'], 2: ['left'], 3: [], 4: ['right']} },
            { position: [-4, 0.08, 0], direction: {1: ['forward'], 2: ['left'], 3: [], 4: ['right']} },
            { position: [-2, 0.08, 0], direction: {1: ['left', 'right', 'backward'], 2: ['forward'], 3: ['forward', 'left', 'right'], 4: ['left', 'forward']} },
            { position: [2, 0.08, 0], direction: {1: ['forward', 'right', 'left', 'backward'], 2: ['forward', 'right', 'left', 'backward'], 3: ['forward', 'right', 'left', 'backward'], 4: ['forward', 'right', 'left', 'backward']} },
            { position: [-4, 0.08, 2], direction: {1: ['forward', 'right'], 2: ['forward', 'left'], 3: ['backward', 'left'], 4: ['backward', 'right']} },
            { position: [-4, 0.08, -2], direction: {1: ['forward', 'right'], 2: ['forward', 'left'], 3: ['backward', 'left'], 4: ['right']} },
            { position: [4, 0.08, 2], direction: {1: ['forward', 'left'], 2: ['backward', 'left'], 3: ['backward', 'right'], 4: ['forward', 'right']} },
            { position: [4, 0.08, -2], direction: {1: ['left'], 2: ['backward'], 3: ['right'], 4: ['forward']} },
            { position: [-2, 0.08, 2], direction: {1: ['right'], 2: ['forward'], 3: ['left'], 4: ['backward']} },
            { position: [2, 0.08, 2], direction: {1: [], 2: [], 3: [], 4: []} },
            { position: [2, 0.08, -2], direction: {1: ['forward'], 2: ['left'], 3: ['backward'], 4: ['right']} },
            { position: [-2, 0.08, -2], direction: {1: ['forward','left', 'backward'], 2: ['forward','left', 'right'], 3: ['forward', 'left', 'backward'], 4: ['backward', 'right', 'left']} },
            { position: [-2, 0.08, -4], direction: {1: ['left'], 2: ['backward'], 3: ['right'], 4: ['forward']} },
            { position: [-4, 0.08, -4], direction: {1: [], 2: [], 3: [], 4: []} },
            { position: [4, 0.08, -4], direction: {1: [], 2: ['right'], 3: ['forward'], 4: ['left']} },
            { position: [2, 0.08, -4], direction: {1: ['right'], 2: ['forward'], 3: ['left'], 4: ['backward']} },
            { position: [-2, 0.08, 4], direction: {1: ['forward', 'left'], 2: ['left', 'backward'], 3: ['backward', 'right'], 4: ['forward', 'right']} },
            { position: [2, 0.08, 4], direction: {1: ['forward', 'right'], 2: ['forward', 'left'], 3: ['backward', 'left'], 4: ['backward', 'right']} },
            { position: [-4, 0.08, 4], direction: {1: ['forward'], 2: ['left'], 3: ['backward'], 4: ['right']} },
            { position: [4, 0.08, 4], direction: {1: ['forward'], 2: ['left'], 3: ['backward'], 4: ['right']} },
        ],
        // direction: {1: [], 2: [], 3: [], 4: []} },
        3: [
        { position: [2.82, 0.05, 2.33], direction: {1: ['forward', 'right'], 2: ['right', 'forward'], 3: ['right', 'forward'], 4: ['forward', 'right']} },
        { position: [4.2, 0.05, 4.2], direction: {1: [], 2: [], 3: [], 4: []} },
        { position: [2.82, 0.05, -2.86], direction: {1: ['right'], 2: ['forward', 'right'], 3: ['forward', 'right'], 4: ['forward']} },
        { position: [4.2, 0.05, 2.33], direction: {1: [], 2: [], 3: ['right'], 4: ['right', 'forward']} },
        { position: [4.2, 0.05, -2.86], direction: {1: ['forward'], 2: ['right'], 3: ['forward', 'right'], 4: ['forward', 'right']} },
        { position: [2.82, 0.05, -1.63], direction: {1: ['forward'], 2: ['right'], 3: ['forward', 'right'], 4: ['forward', 'right']} },
        { position: [0.02, 0.05, -1.63], direction: {1: ['right'], 2: ['forward', 'right'], 3: ['forward', 'right'], 4: ['forward', 'right']} },
        { position: [1.42, 0.05, -1.63], direction: {1: ['right'], 2: ['forward', 'right'], 3: ['forward', 'right'], 4: ['forward', 'right']} },
        { position: [2.82, 0.05, 1], direction: {1: ['forward'], 2: ['right'], 3: ['forward', 'right'], 4: ['forward', 'right']} },
        { position: [1.42, 0.05, 1], direction: {1: ['right'], 2: ['forward', 'right'], 3: ['forward', 'right'], 4: ['forward']}  },
        { position: [0.02, 0.05, 1], direction: {1: ['forward', 'right'], 2: ['forward'], 3: ['right'], 4: ['forward', 'right']} },
        { position: [-2.72, 0.05, 1], direction: {1: ['forward', 'right'], 2: ['right'], 3: ['forward'], 4: ['forward', 'right']} },
        { position: [-2.72, 0.05, -2.86], direction: {1: ['forward', 'right'], 2: ['forward', 'right'], 3: ['forward'], 4: ['right']} },
        { position: [-1.36, 0.05, -2.86], direction: {1: ['forward', 'right'], 2: ['forward', 'right'], 3: ['forward', 'right'], 4: ['forward', 'right']} },
        { position: [1.4, 0.05, -2.86], direction: {1: ['forward', 'right'], 2: ['forward'], 3: ['right'], 4: ['forward', 'right']} },
        { position: [1.4, 0.05, -0.33], direction: {1: ['forward'], 2: [], 3: ['right'], 4: ['forward', 'right']} },
        { position: [0.02, 0.05, -0.33], direction: {1: ['forward', 'right'], 2: ['forward', 'right'], 3: ['forward', 'right'], 4: ['forward', 'right']} },
        { position: [-2.72, 0.05, -0.33], direction: {1: ['forward', 'right'], 2: ['forward', 'right'], 3: ['forward', 'right'], 4: ['forward', 'right']} },
        { position: [-1.36, 0.05, -1.63], direction: {1: ['forward', 'right'], 2: ['forward'], 3: [], 4: ['right']} },
        { position: [-4.1, 0.05, -0.33], direction: {1: ['forward', 'right'], 2: ['forward'], 3: [], 4: ['right']} },
        { position: [-4.1, 0.05, -4.16], direction: {1: ['right'], 2: ['forward', 'right'], 3: ['forward', 'right'], 4: []} },
        { position: [1.4, 0.05, -4.16], direction: {1: ['right'], 2: ['forward', 'right'], 3: ['forward', 'right'], 4: ['forward', 'right']} },
        { position: [-1.36, 0.05, -4.16], direction: {1: ['right'], 2: ['forward', 'right'], 3: ['forward', 'right'], 4: ['forward']} },
        { position: [-2.72, 0.05, -4.16], direction: {1: ['right'], 2: ['forward', 'right'], 3: ['forward', 'right'], 4: ['forward']} },
        { position: [4.2, 0.05, -4.16], direction: {1: [], 2: ['right'], 3: ['forward', 'right'], 4: ['forward']} },
        { position: [-2.72, 0.05, 2.33], direction: {1: ['forward', 'right'], 2: ['forward', 'right'], 3: ['forward'], 4: ['right']} },
        { position: [1.42, 0.05, 2.33], direction: {1: ['forward', 'right'], 2: ['forward'], 3: ['right'], 4: ['forward', 'right']} },
        { position: [-2.72, 0.05, 4.2], direction: {1: [], 2: ['forward'], 3: ['forward'], 4: ['forward', 'right']} },
        { position: [2.8, 0.05, 4.2], direction: {1: ['forward', 'right'], 2: ['right'], 3: ['forward', 'right'], 4: ['forward', 'right']} },
        ],
        4: [
            { position: [-3.55, 0.03, 0.6], direction: {1: ['forward', 'right'], 2: [], 3: ['forward', 'left'], 4: ['left', 'right']} },
            { position: [-3.55, 0.03, 1.8], direction: {1: ['forward', 'right'], 2: [], 3: ['left'], 4: ['right']} },
            { position: [-3.55, 0.03, -0.6] , direction: {1: ['forward', 'right'], 2: [], 3: ['forward', 'left'], 4: ['left', 'right']} },
            { position: [-3.55, 0.03, -1.85] , direction: {1: ['right'], 2: [], 3: [], 4: ['left']} },
            { position: [-2.11, 0.03, -1.85] , direction: {1: ['left', 'right'], 2: ['forward', 'right'], 3: [], 4: ['forward', 'left']} },
            { position: [-2.11, 0.03, -0.6], direction: {1: ['forward', 'left', 'right'], 2: ['forward', 'left', 'right'], 3: ['forward', 'left', 'right'], 4: ['forward', 'left', 'right']}  },
            { position: [-2.11, 0.03, 0.6], direction: {1: [], 2: ['forward', 'left'], 3: ['left', 'right'], 4: ['forward', 'right']}  },
            { position: [-0.7, 0.03, 0.6], direction: {1: [], 2: ['forward', 'left'], 3: ['left', 'right'], 4: ['forward', 'right']}  },
            { position: [-0.7, 0.03, -0.6], direction: {1: ['forward','right', 'left'], 2: ['forward', 'left', 'right'], 3: ['left', 'right', 'forward'], 4: ['forward', 'right', 'left']}  },
            { position: [-0.7, 0.03, -1.85], direction: {1: ['right', 'left'], 2: ['forward', 'right'], 3: [], 4: ['forward', 'left']}  },
            { position: [0.7, 0.03, 0.6], direction: {1: ['forward', 'left', 'right'], 2: ['forward', 'left', 'right'], 3: ['forward', 'left', 'right'], 4: ['forward', 'left', 'right']}  },
            { position: [0.7, 0.03, -0.6], direction: {1: ['left', 'right'], 2: ['forward', 'right'], 3: [], 4: ['forward', 'left']}  },
            { position: [2.1, 0.03, -0.6], direction: {1: [], 2: ['forward', 'left'], 3: ['left', 'right'], 4: ['forward', 'right']}  },
            { position: [2.1, 0.03, -1.85], direction: {1: ['left', 'right'], 2: ['forward', 'right'], 3: [], 4: ['forward', 'left']}  },
            { position: [3.55, 0.03, -1.85], direction: {1: ['left'], 2: ['right'], 3: [], 4: []}  },
            { position: [3.55, 0.03, -0.6], direction: {1: ['forward', 'left'], 2: ['left', 'right'], 3: ['forward', 'right'], 4: []}  },
            { position: [3.55, 0.03, 0.6], direction: {1: [], 2: ['left'], 3: ['right'], 4: []}  },
            { position: [0.7, 0.03, 1.8], direction: {1: [], 2: ['left'], 3: ['forward'], 4: []}  },
        ],
    },
    /*
    * 第四关药丸
    */
    pills: [
        { position: [-3.55, 0.1, 1.28], color: 'red', state: true },
        { position: [-3.55, 0.1, -1.2], color: 'blue', state: true },
        { position: [-2.8, 0.1, 0.6], color: 'blue', state: true },
        { position: [2.3, 0.1, 0.6], color: 'blue', state: true },
        { position: [-0.7, 0.1, 0], color: 'blue', state: true },
        { position: [-0.7, 0.1, -1.2], color: 'red', state: true },
        { position: [-2.11, 0.1, -1.2], color: 'blue', state: true },
        { position: [0.7, 0.1, 0], color: 'red', state: true },
        { position: [-1.42, 0.1, -0.6], color: 'blue', state: true },
        { position: [-1.42, 0.1, -1.85], color: 'red', state: true },
        { position: [-2.8, 0.1, -0.6], color: 'red', state: true },
        { position: [2.77, 0.1, -1.85], color: 'blue', state: true },
        { position: [3.55, 0.1, 0], color: 'red', state: true },
        { position: [1.45, 0.1, -0.6], color: 'red', state: true },
        { position: [0.7, 0.1, 1.2], color: 'blue', state: true },],
    setMapMeshes: (meshes) => set({ mapMeshes: meshes }),
    // 修改位置、旋转、角度、方向 同步给2D地图
    changePosition: (pos, rot, angle, dir) => {
        set({
            recordPosition: pos.clone(),
            rotationY: rot,
            minAngle: angle,
            moveDirection: dir.clone()
        })
    },
    // 修改游戏状态
    changeGameState: (state) => set({ gameState: state }),
    // 修改人物状态
    changePeopleState: (state) => set({ peopleState: state }),
    // 重置游戏状态（C 键触发，位置复位在 Controller 里做）
    resetGameState: () => set((s) => ({
        gameState: 'init',
        peopleState: 'idle',
        directionState: { forward: false, backward: false, left: false, right: false },
        currentPills: [],
        pills: s.pills.map(p => ({ ...p, state: true }))
    })),
    // 修改 directionState
    changeDirectionState: (dir, state) => {
        setTimeout(() => {
            set(s => ({ directionState: { ...s.directionState, [dir]: false } }))
        }, 500)
        return set(s => ({ directionState: { ...s.directionState, [dir]: state } }))
    },
    // 修改药丸状态 并且 记录吃掉的药丸
    changePillsState: (index, newState) => set(s => {
        const newPills = [...s.pills]
        newPills[index] = { ...newPills[index], state: newState }
        // 只有吃掉（false）时才记录，恢复（true）不记录
        if (!newState) {
            return { pills: newPills, currentPills: [...s.currentPills, newPills[index].color] }
        }
        return { pills: newPills }
    }),
    // 修改当前关卡（切换关卡时顺带递增 resetCount，让 Controller 把人物复位到新关卡起点）
    changeLevelID: (id) => set(s => ({ 
        levelID: id, 
        gameState: 'init',
        peopleState: 'idle',
        directionState: { forward: false, backward: false, left: false, right: false },
        resetCount: s.resetCount + 1
    })),
    // 修改重置次数
    changeResetCount: () => {
        set(s => ({ resetCount: s.resetCount + 1 }))
    },
}));

export default useMaze;