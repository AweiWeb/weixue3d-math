import { createHashRouter } from "react-router-dom"
import { lazy } from "react"
import App from "../App"

// 懒加载页面组件 动态按需加载
const Maze = lazy(() => import("../page/Maze"))
const Grain = lazy(() => import("../page/Grain"))
const Home = lazy(() => import("../page/Home"))
const BlockMaze = lazy(() => import("../page/BlockMaze"))
const CubeAnimation = lazy(() => import("../page/CubeAnimation"))
const router = createHashRouter([
    {
        path: "/",
        Component: App,
        children: [
            {
                index: true,
                Component: Home,
            },
            {
                path: "maze",
                Component: Maze,
            },
            {
                path: "grain",
                Component: Grain,
            },
            {
                path: "block-maze",
                Component: BlockMaze,
            },
            {
                path: "cube-animation",
                Component: CubeAnimation,
            }
        ],
    },
])

export default router
