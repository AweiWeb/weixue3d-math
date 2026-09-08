# weixue-math3d

基于 React Three Fiber 的 3D 教育互动平台，包含多个数学可视化游戏模块。

## 技术栈

| 分类 | 技术 |
|---|---|
| 框架 | React 19 + Vite 6 |
| 3D 渲染 | React Three Fiber 9 + drei 10 + three.js 0.173 |
| 状态管理 | zustand 5 |
| 后期处理 | postprocessing（自定义 Effect + shader） |
| 路由 | react-router-dom 7 |
| 调试 | leva |
| UI | antd 6（Grain 模块） |
| 打包 | vite-plugin-singlefile（Maze 单文件离线打包） |

## 项目结构

```
src/
├── page/                    # 页面入口
│   ├── Home/                # 首页（游戏选择）
│   ├── Maze/                # 迷宫游戏
│   ├── Grain/               # 米粒可视化
│   ├── BlockMaze/           # 方块翻滚
│   └── CubeAnimation/       # 立方体动画
├── components/              # 3D 组件
│   ├── MazeComponent/       # 迷宫：场景、角色、UI
│   ├── GrainComponent/      # 米粒：InstancedMesh + shader
│   ├── BlockComponent/      # 方块：翻滚物理
│   └── CubeComponent/       # 立方体动画 demo
├── store/                   # zustand 状态
├── assets/                  # 静态资源（glb 模型、图片）
├── style/                   # 全局样式（less）
└── shader/                  # GLSL 着色器
```

## 游戏模块

### 🏰 Maze — 迷宫解谜（4 关）

核心玩法：角色在 3D 迷宫中按格子移动，到达终点过关。

**技术要点：**

- **格子移动系统**：mark 点碰撞检测 + 四元数 slerp 旋转平滑，非物理引擎驱动
- **相机跟随**：lerp 插值 + camerOffset 偏移，支持旋转跟随与碰撞检测（预留）
- **小地图**：CSS 2D 映射 3D 坐标（支持坐标轴 swap），M 键放大 1.5 倍居中，空格键切换地图/人物层级
- **药丸收集**：红蓝交替规则校验，5 秒后自动恢复
- **后期处理**：自定义 FogEffect（GLSL fragment shader），通过 postprocessing 原生 API 合并 RenderPass + EffectPass
- **三种重置路径统一**：切关卡 / C 键 / 失败弹窗按钮 → zustand resetCount 递增 → Controller useEffect 监听 → reset() 函数
- **单文件离线打包**：vite-plugin-singlefile 将 4 关地图 + 全部 UI 图片 base64 内联为单个 HTML（~90MB），双击可运行

### 🌾 Grain — 米粒可视化

核心玩法：3D 空间中渲染大规模米粒阵列，支持切割/高亮交互。

**技术要点：**

- **InstancedMesh 大规模实例化**：drei `<Instances>` 组件，最多 10 万实例，单次 drawcall
- **自定义 InstancedBufferAttribute**：`a_isEdge` / `a_isHighlight` 逐实例标记，手动管理 attribute 创建与更新（`needsUpdate`）
- **材质劫持（onBeforeCompile）**：注入自定义 uniform（uOpacity / isCube / lineWidth），vertex shader 传递 attribute 到 varying，fragment shader 根据标记切换颜色（边=蓝、高亮=黄、边框=黑）
- **模式切换**：rice（GLTF 模型）/ cube（BoxGeometry），运行时切换 geometry 与 material
- **输入框正则解析**：`"10-2"` → `{ total: 10, op: 'cut', cut: 2 }`，支持 `-`（切割）、`+`（高亮）、无符号（默认）
- **antd Slider** 控制切割层间距

### 🧊 BlockMaze — 方块翻滚

核心玩法：立方体沿底面边翻滚移动。

**技术要点：**

- **pivot 翻滚**：parentRef 移到 pivot 点 → `attach` 保持世界变换 → `rotateOnWorldAxis` 绕世界轴旋转 → 完成后 attach 回 groupRef 并复位
- **按键订阅**：drei `useKeyboardControls` selector 形式响应式订阅，useEffect 监听按键变化
- **防连发**：`isRolling` ref 锁定翻滚期间输入

## 开发

```bash
# 安装依赖
yarn

# 启动开发服务器（Node 18+）
yarn dev

# 主项目打包（4 关分离资源）
yarn build

# Maze 单文件离线打包
yarn build:maze
```

> ⚠️ Vite 6 要求 Node 18+。项目根目录有 `.nvmrc`，执行 `nvm use` 自动切换。

## 架构决策

| 决策 | 原因 |
|---|---|
| zustand 而非 Redux | 3D 场景高频状态更新，zustand 无 Provider 包裹、selector 粒度更细 |
| 格子移动而非物理引擎 | 迷宫场景离散移动，物理引擎过度；保留 Rapier 集成接口 |
| 单文件打包（Maze） | 交付场景无服务器，双击 HTML 即可运行 |
| onBeforeCompile 而非 ShaderMaterial | 复用 MeshStandardMaterial 的光照模型，只注入自定义逻辑 |
| `resetCount` 递增而非布尔标志 | 连续触发时值不变会导致 useEffect 不触发 |
