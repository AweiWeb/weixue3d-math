/*
* BlockMaze 游戏资源统一出口
* 静态 import 才能被 Vite 打包内联
*/

// 地图 GLB
import mazeBlock1Url from './blockMaze/mazeBlock1.glb'
import mazeBlock2Url from './blockMaze/mazeBlock2.glb'
import mazeBlock3Url from './blockMaze/mazeBlock3.glb'
import mazeBlock4Url from './blockMaze/mazeBlock4.glb'

// 方块 & 背板
import blockUrl from './blockMaze/block.glb'
import backPlaneUrl from './blockMaze/backPlane.glb'

// 音效
import blockMp3Url from './blockMaze/block.mp3'

// UI 图片
import blockLevel1Url from './blockMaze/blockLevel1.png'
import blockLevel2Url from './blockMaze/blockLevel2.png'
import blockLevel3Url from './blockMaze/blockLevel3.png'
import blockLevel4Url from './blockMaze/blockLevel4.png'
import tipMessageUrl from './blockMaze/tipMessage.png'

// 地图 GLB 按关卡索引
export const mazeBlockUrls = {
    1: mazeBlock1Url,
    2: mazeBlock2Url,
    3: mazeBlock3Url,
    4: mazeBlock4Url,
}

export const blockModelUrl = blockUrl
export const backPlaneModelUrl = backPlaneUrl
export const blockSfxUrl = blockMp3Url

// UI 图片按关卡索引
export const blockLevelUrls = {
    1: blockLevel1Url,
    2: blockLevel2Url,
    3: blockLevel3Url,
    4: blockLevel4Url,
}
export const tipMessageImgUrl = tipMessageUrl
