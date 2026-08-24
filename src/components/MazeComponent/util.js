import * as THREE from 'three'

/*
* 地图文件名
*/
const gameMap = {
    1: 'map',
    2: 'map2',
    3: 'map3',
    4: 'map4'
}

/*
* 人物初始化位置
*/
const peopleInitPos = {
    1: new THREE.Vector3(),
    2: new THREE.Vector3(),
    3: new THREE.Vector3(),
    4: new THREE.Vector3()
}

/*
* 透视相机初始位置（Experience 的 PerspectiveCamera 与 Controller 重置共用）
*/
const cameraInitPos = [0, 4, 15]


export { gameMap, peopleInitPos, cameraInitPos }