import { useState } from 'react'
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { useBadDesign, CUBE_FACES_COLORS, filterClickDelta } from '@/store/badDesign'

// 地面网格感应板
export const GroundPlane = ({ type, ...props }) => {
    const addCube = useBadDesign((state) => state.addCube)
    const currentState = useBadDesign((state) => state.currentState)
    const [hoverCoord, setHoverCoord] = useState(null)

    const onClickGround = filterClickDelta((e) => {
        addCube([Math.ceil(e.point.x) - 0.5, 0, Math.ceil(e.point.z) - 0.5])
    })

    return (
        <RigidBody type="fixed">
            <group>
                <mesh
                    rotation={[-Math.PI / 2, 0, 0]}
                    position={[0, -0.51, 0]}
                    onClick={onClickGround}
                    onPointerMove={(e) => {
                        e.stopPropagation()
                        const pt = e.point
                        const x = Math.floor(pt.x)
                        const z = Math.floor(pt.z)
                        setHoverCoord(x >= -25 && x <= 24 && z >= -25 && z <= 24 ? { x, z } : null)
                    }}
                    onPointerLeave={() => setHoverCoord(null)}
                >
                    <planeGeometry args={[50, 50]} />
                    <meshBasicMaterial color="transparent" side={THREE.DoubleSide} />
                </mesh>

                {hoverCoord && currentState === 'add' && (
                    <mesh position={[hoverCoord.x + 0.5, 0, hoverCoord.z + 0.5]} scale={[0.99, 0.99, 0.99]}>
                        <boxGeometry args={[1, 1, 1]} />
                        {CUBE_FACES_COLORS.map((col, idx) => (
                            <meshStandardMaterial
                                key={idx}
                                attach={`material-${idx}`}
                                color={col}
                                transparent
                                opacity={0.6}
                                depthWrite={false}
                            />
                        ))}
                    </mesh>
                )}
            </group>
        </RigidBody>
    )
}

// 放置方块前的透明预览方块
export const PreviewCube = () => {
    const prePosition = useBadDesign((state) => state.prePosition)
    if (!prePosition) return null
    // console.log('xuanranle1');

    return (
        <mesh position={prePosition}>
            <boxGeometry args={[1.01, 1.01, 1.01]} />
            {CUBE_FACES_COLORS.map((col, idx) => (
                <meshStandardMaterial
                    key={idx}
                    attach={`material-${idx}`}
                    color={col}
                    transparent
                    opacity={0.6}
                    depthWrite={false}
                />
            ))}
        </mesh>
    )
}

export const Lighting = () => <ambientLight intensity={5} />