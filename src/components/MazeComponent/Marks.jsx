import useMaze from "../../store/index"
import { useShallow } from "zustand/shallow"

const Marks = ({ marksID }) => {
    const mapMarks= useMaze(useShallow(s => s.mapMarks))
    const marks = mapMarks[marksID]
    return marks.map((mark, i) => (
        <group key={i} position={mark.position}>
            {/* 红色圆环 */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} renderOrder={1}>
                <ringGeometry args={[0.15, 0.25, 32]} />
                <meshBasicMaterial color="red" side={2}  />
            </mesh>
            {/* 中心小圆点 */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} renderOrder={2}>
                <circleGeometry args={[0.06, 32]} />
                <meshBasicMaterial color="red"  />
            </mesh>
        </group>
    ))
}

export default Marks
