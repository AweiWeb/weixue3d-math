import { Link } from "react-router-dom"

const games = [
  {
    path: "maze",
    title: "迷宫探索",
    desc: "3D 迷宫中的寻宝冒险",
    isSuccess: false
  },
  {
    path: "grain",
    title: "粮食仓库",
    desc: "观察粮食袋的变化",
    isSuccess: false
  },
  {
    path: 'cube-animation',
    title: "骰子迷宫",
    desc: '观察立方体每个面的对应关系',
    isSuccess: false
  },
  {
    path: 'block-maze',
    title: 'Block Maze',
    desc: '翻转方块观察规律',
    isSuccess: false
  },
  {
    path: 'bad-design',
    title: '糟糕的设计师',
    desc: '翻转方块观察规律',
    isSuccess: false
  },
]

const Home = () => {
  return (
    <div className="math-home">
      {/* 💡 插入 CSS 关键帧动画 */}
      <style>
        {`
          @keyframes colorBreathe {
            0% { 
              color: #ffffff; 
              text-shadow: 0 0 5px rgba(255,255,255,0.1);
            }
            50% { 
              color: #7897ac; /* 呼应你下方卡片的悬浮色 */
              text-shadow: 0 0 20px rgba(120, 151, 172, 0.8);
            }
            100% { 
              color: #ffffff; 
              text-shadow: 0 0 5px rgba(255,255,255,0.1);
            }
          }
          .breathing-text {
            animation: colorBreathe 4s infinite ease-in-out;
          }
        `}
      </style>

      <div
        style={{
          position: "absolute",
          zIndex: 10,
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 24,
          background: "#0a0a1a",
          color: "#fff",
        }}
      >
        {/* 💡 应用定义好的呼吸动画类名 */}

        <h1 className="breathing-text" style={{ fontSize: 'calc(4vw + 3vh)', margin: 0, position: "absolute", top: '15vh' }}>
          圆桌数理 3D游戏工具
        </h1>

        <p style={{ color: "#888", margin: 0 }}>选择一个游戏开始</p>
        <div style={{ display: "flex", gap: 20, marginTop: 16 }}>
          {games.map((game) => (
            <Link
              key={game.path}
              to={game.path}
              style={{
                display: "block",
                width: 200,
                padding: "24px 20px",
                background: "#1a1a2e",
                borderRadius: 12,
                textDecoration: "none",
                color: "#fff",
                border: "1px solid #333",
                transition: "border-color .2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#7897ac")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#333")}
            >
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
                {game.title}
              </div>
              <div style={{ fontSize: 14, color: "#888" }}>{game.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home