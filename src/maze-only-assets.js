/*
* 迷宫独立打包用资源（只含关卡 1，控制 HTML 体积）
* vite.maze.config.js 里通过 alias 把 '@/assets/mazeAssets' 指到本文件
*/
import map1Url from './assets/maze/map.glb'
import p7Url from './assets/maze/p7.glb'
import doorUrl from './assets/maze/door.glb'
import redPillUrl from './assets/maze/redPill.glb'
import bluePillUrl from './assets/maze/bluePill.glb'
import filterUrl from './assets/maze/filter.png'

export const gameMapUrls = { map: map1Url }
export const peopleUrl = p7Url
export const endDoorUrl = doorUrl
export const pillUrls = { red: redPillUrl, blue: bluePillUrl }
export const filterTextureUrl = filterUrl
