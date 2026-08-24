const countData = {
    x: 8,
    y: 1,
    z: 6,
}

// 根据countData生成地图 y 就是固定数量1, x乘z
const BlockMaps = () => {
    return <group position={[-2, -0.01, 0]}>
        {Array.from({ length: countData.x }, (_, i) => (
            Array.from({ length: countData.z }, (_, j) => (
                <Block key={j} position={[i, 0, j]} />
            ))
        ))}
    </group>
}


const Block = (props) => {
    return <mesh rotation-x={-Math.PI * 0.5} {...props}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="black" />
    </mesh>
}


export default BlockMaps
