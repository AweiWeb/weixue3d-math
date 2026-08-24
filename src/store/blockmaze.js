const useBlockMaze = create((set, get) => ({
    gameState: 'init',
    levelID: 1,

    blockMapData: {
        1: [],
        2: [],
        3: [],
        4: []
    },
    changeGameState: (state) => {
        set({ gameState: state })
    },
}));
