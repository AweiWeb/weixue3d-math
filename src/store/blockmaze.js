const useBlockMaze = create((set, get) => ({
    gameState: 'init',
    levelID: 1,
    changeGameState: (state) => {
        set({ gameState: state })
    },
}));
