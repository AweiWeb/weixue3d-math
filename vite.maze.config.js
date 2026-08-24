import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import glsl from 'vite-plugin-glsl'
import { viteSingleFile } from 'vite-plugin-singlefile'
import path from 'path'

/*
* 迷宫独立打包配置
* 产物：maze-build/maze.html 单文件，双击可直接打开（file:// 协议）
* 资源全内联 base64，4 个关卡全部包含
*/
export default defineConfig({
  base: './',
  assetsInclude: ['**/*.glb'],
  plugins: [
    react(),
    glsl(),
    viteSingleFile(),
  ],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './src') },
    ],
  },
  build: {
    outDir: 'maze-build',
    copyPublicDir: false, // 交付时只需要 maze.html
    rollupOptions: {
      input: path.resolve(__dirname, 'maze.html'),
    },
  },
})
