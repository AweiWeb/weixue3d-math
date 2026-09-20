import { useBadDesign } from "@/store/badDesign"

const SideButton = () => {
    const withDrawCube = useBadDesign((state) => state.withDrawCube)
    const resetGame = useBadDesign((state) => state.resetGame)

    return (
        <div className="side-button">
            <div className="withdraw" onClick={withDrawCube} title="撤回 (Z)" />
            <div className="reset" onClick={resetGame} title="重置" />
        </div>
    )
}

export default SideButton