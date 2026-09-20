import { create } from "zustand";
import * as THREE from 'three'
const useBlockMaze = create((set, get) => ({
    gameState: 'init',
    levelID: 1,
    initPosition: {
        1: [-17.5, 0, -7.5],
        2: [-30.5, 0, 2.5],
        3: [-7.5, 0, -2.5],
        4: [-35, 0, 0]
    },
    currentMapBlockData: [],
    mapPosition: {
        1: [-0.358, -1.47, -0.215],
        2: [-0.74, -3.34, -0.3],
        3: [-0.01, -3.34, 0],
        4: [-0.3, -3.34, -0.72]
    },
    successPosition: {
        1: new THREE.Vector3(12.5, 5, 7.5),
        2: new THREE.Vector3(29.5, 5, 2.5),
        3: new THREE.Vector3(-12.5, 5, -2.5),
        4: new THREE.Vector3(30, 5, 5)
    },
    changeGameState: (state) => {
        set({ gameState: state })
    },
    /*
    * 初始化数据
    */
    setCurrentMapData: (data) => {
        set({ currentMapBlockData: [...data] })
        // console.log(get().currentMapBlockData);
    },

    changeLevel: (id) => {
        console.log('成功了');
        set({ levelID: id > 4 ? 1 : id, gameState: 'init' })
    }
}));

export default useBlockMaze
