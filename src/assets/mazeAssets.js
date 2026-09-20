/*
* 迷宫资源统一出口（全关卡 + UI 图片，本地化）
* 静态 import 才能被 Vite 打包内联
*/
import map1Url from './maze/map.glb'
import map2Url from './maze/map2.glb'
import map3Url from './maze/map3.glb'
import map4Url from './maze/map4.glb'
import p7Url from './maze/p7.glb'
import doorUrl from './maze/door.glb'
import redPillUrl from './maze/redPill.glb'
import bluePillUrl from './maze/bluePill.glb'
import filterUrl from './maze/filter.png'

/*
* UI 图片（本地化，替换 OSS 远程地址）
*/
import messageMazeUrl from './maze-3d/message-maze.png'
import failBackImgUrl from './maze-3d/failBackImg.png'
import resetBtnUrl from './maze-3d/resetBtn.png'
import primaryUrl from './maze-3d/primary.png'
import successBackUrl from './maze-3d/successback.png'
import successMessageUrl from './maze-3d/successmessage.png'
import yuanFlagUrl from './maze-3d/yuanFlag.png'

import start1Url from './maze-3d/start1.png'
import start2Url from './maze-3d/start2.png'
import start3Url from './maze-3d/start3.png'
import start4Url from './maze-3d/start4.png'

import minMap1Url from './maze-3d/minMap1.png'
import minMap2Url from './maze-3d/minMap2.png'
import minMap3Url from './maze-3d/minMap3.png'
import minMap4Url from './maze-3d/minMap4.png'

import level11Url from './maze-3d/level1-1.png'
import level12Url from './maze-3d/level1-2.png'
import level21Url from './maze-3d/level2-1.png'
import level22Url from './maze-3d/level2-2.png'
import level31Url from './maze-3d/level3-1.png'
import level32Url from './maze-3d/level3-2.png'
import level41Url from './maze-3d/level4-1.png'
import level42Url from './maze-3d/level4-2.png'

import forward1Url from './maze-3d/forward1.png'
import forward2Url from './maze-3d/forward2.png'
import forward3Url from './maze-3d/forward3.png'
import backward1Url from './maze-3d/backward1.png'
import backward2Url from './maze-3d/backward2.png'
import backward3Url from './maze-3d/backward3.png'
import left1Url from './maze-3d/left1.png'
import left2Url from './maze-3d/left2.png'
import left3Url from './maze-3d/left3.png'
import right1Url from './maze-3d/right1.png'
import right2Url from './maze-3d/right2.png'
import right3Url from './maze-3d/right3.png'
import maskMap1 from './maze-3d/mapMark1.png'
import maskMap2 from './maze-3d/mapMark2.png'
import maskMap4 from './maze-3d/mapMark4.png'


export const gameMapUrls = { map: map1Url, map2: map2Url, map3: map3Url, map4: map4Url }
export const peopleUrl = p7Url
export const endDoorUrl = doorUrl
export const pillUrls = { red: redPillUrl, blue: bluePillUrl }
export const filterTextureUrl = filterUrl

// UI 图片统一出口
export const uiImages = {
    messageMaze: messageMazeUrl,
    failBackImg: failBackImgUrl,
    resetBtn: resetBtnUrl,
    primary: primaryUrl,
    successBack: successBackUrl,
    successMessage: successMessageUrl,
    yuanFlag: yuanFlagUrl,
    startbox: { 1: start1Url, 2: start2Url, 3: start3Url, 4: start4Url },
    minMap: { 1: minMap1Url, 2: minMap2Url, 3: minMap3Url, 4: minMap4Url },
    maskMap: {1: maskMap1, 2: maskMap2, 4: maskMap4},
    levelSelect: {
        1: { normal: level11Url, active: level12Url },
        2: { normal: level21Url, active: level22Url },
        3: { normal: level31Url, active: level32Url },
        4: { normal: level41Url, active: level42Url },
    },
    direction: {
        forward: { 1: forward1Url, 2: forward2Url, 3: forward3Url },
        backward: { 1: backward1Url, 2: backward2Url, 3: backward3Url },
        left: { 1: left1Url, 2: left2Url, 3: left3Url },
        right: { 1: right1Url, 2: right2Url, 3: right3Url },
    },
}

