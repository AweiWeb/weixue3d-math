import useCubeBreak from "@/store/cubeBreak";
import { uiImages } from "@/assets/mazeAssets";

const levelList = [
    { id: 1, title: "第一关" },
    { id: 2, title: "第二关" },
    { id: 3, title: '第三关' }
];

const LevelSelect = () => {
    const levelID = useCubeBreak((state) => state.levelID);
    const changeLevelID = useCubeBreak((state) => state.changeLevelID);

    return (
        <div className="select-box">
            {levelList.map((item) => {
                const active = levelID === item.id;
                return (
                    <div
                        key={item.id}
                        className="selectItem"
                        style={{
                            backgroundImage: `url(${uiImages.levelSelect[item.id][active ? 'active' : 'normal']})`,
                            top: `${(item.id - 1) * 13 + 2}vh`,
                            width: `${active ? 6 : 4.2}vw`,
                        }}
                        onClick={() => changeLevelID(item.id)}
                    ></div>
                );
            })}
        </div>
    );
};

export default LevelSelect;
