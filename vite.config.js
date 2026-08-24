import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import glsl from 'vite-plugin-glsl'
import path from 'path'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    glsl(),
    {
      name: 'rename-index-html',
      enforce: 'post',
      closeBundle() {
        const oldPath = path.resolve(__dirname, '3d-builds/index.html')
        const newPath = path.resolve(__dirname, '3d-builds/math.html')

        if (fs.existsSync(oldPath)) {
          fs.renameSync(oldPath, newPath)
          console.log('\n✅ 打包完成: index.html 已重命名为 math.html')
        } else {
          // 加个报错提示，以后如果路径写错能立刻发现
          console.log('\n❌ 重命名失败: 找不到原文件', oldPath)
        }
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.glb'],
  build: {
    assetsDir: 'math-3d',
    outDir: '3d-builds', // 你把产物输出到了这里
  }
})