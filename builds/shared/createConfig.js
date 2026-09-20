import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import glsl from 'vite-plugin-glsl'
import { viteSingleFile } from 'vite-plugin-singlefile'
import path from 'path'
import fs from 'fs'

const projectRoot = path.resolve(__dirname, '../..')

/**
 * 游戏单文件构建配置工厂
 * 产物：dist/<name>.html，双击可直接打开（file:// 协议）
 *
 * @param {Object} options
 * @param {string} options.name   - 游戏名（文件夹名 + 产物名），如 'maze'
 */
export function createGameConfig({ name }) {
  const gameDir = path.resolve(__dirname, `../${name}`)

  return defineConfig({
    root: gameDir,
    base: './',
    plugins: [
      react(),
      glsl(),
      viteSingleFile(),
      {
        name: 'rename-output-html',
        enforce: 'post',
        closeBundle() {
          const outDir = path.resolve(projectRoot, 'dist')
          const oldPath = path.resolve(outDir, 'index.html')
          const newPath = path.resolve(outDir, `${name}.html`)
          if (fs.existsSync(oldPath)) {
            fs.renameSync(oldPath, newPath)
            console.log(`\n✅ 产物: ${newPath}`)
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(projectRoot, './src'),
      },
    },
    assetsInclude: ['**/*.glb'],
    build: {
      outDir: path.resolve(projectRoot, 'dist'),
      copyPublicDir: false,
    },
  })
}
