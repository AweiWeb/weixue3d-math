import useCubeBreak from "@/store/cubeBreak";

const SuccessPop = () => {
    const resetDiceState = useCubeBreak((state) => state.resetDiceState)
    return (
        <div className="success" onClick={resetDiceState}>
            <div className="success-pop" />
        </div>
    );
};

export default SuccessPop;