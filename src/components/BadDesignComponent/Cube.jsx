import React, { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { InstancedRigidBodies } from '@react-three/rapier'
import { useControls, button } from 'leva'
import * as THREE from 'three'
import { useBadDesign, CUBE_FACES_COLORS, filterClickDelta } from '@/store/badDesign'

const vertexShader = `
attribute vec3 aColorRight;
attribute vec3 aColorLeft;
attribute vec3 aColorTop;
attribute vec3 aColorBottom;
attribute vec3 aColorFront;
attribute vec3 aColorBack;
varying vec2 vUv;
varying vec3 n;
varying vec3 vColor;
varying float vIsHovered;
uniform float delTrasparent;
uniform float isHovered;
varying vec3 VNormal;

void main () {
  vUv = uv;
  vec3 n = normal;
  vIsHovered = gl_InstanceID == int(isHovered) ? delTrasparent : 0.0;
  
  if (n.x > 0.5) vColor = aColorRight;
  else if (n.x < -0.5) vColor = aColorLeft;
  else if (n.y > 0.5) vColor = aColorTop;
  else if (n.y < -0.5) vColor = aColorBottom;
  else if (n.z > 0.5) vColor = aColorFront;
  else vColor = aColorBack;
  
  VNormal = normal;
  vec4 instancePosition = instanceMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * modelViewMatrix * instancePosition;
}
`

const fragmentShader = `
varying vec3 vColor;
varying vec2 vUv;
varying vec3 VNormal;
uniform float thickBorder;
uniform vec3 lineColor;
uniform vec3 mouseColor;
varying float vIsHovered;
uniform vec3 uViewColor;
uniform float uIsMain;
uniform vec3 uDeleteLineColor;

void main () {
  float aphla = 1.0;
  float edgeX = step(thickBorder, vUv.x) * step(thickBorder, 1.0 - vUv.x);
  float edgeY = step(thickBorder, vUv.y) * step(thickBorder, 1.0 - vUv.y);
  vec3 color = mix(lineColor, vColor, edgeX * edgeY);
  vec3 deletLineColor = mix(uDeleteLineColor, mouseColor, edgeX * edgeY);
  vec3 sideColor = mix(lineColor, uViewColor, edgeX * edgeY);
  
  if (vIsHovered > 0.0) {
    color = deletLineColor;
    aphla = 0.8;
  } else {
    aphla = 0.95;
  }
  color = mix(sideColor, color, uIsMain);
  gl_FragColor = vec4(color, aphla);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`

const tempMat4 = new THREE.Matrix4()
const tempQuat = new THREE.Quaternion()
const tempPos = new THREE.Vector3()
const tempScale = new THREE.Vector3(1, 1, 1)

export const Cubes = ({ type }) => {
    const maxCount = useBadDesign((state) => state.maxCount)
    const currentState = useBadDesign((state) => state.currentState)
    const gameState = useBadDesign((state) => state.gameState)
    const handleCubeClick = useBadDesign((state) => state.handleCubeClick)
    const phySicsType = useBadDesign((state) => state.phySicsType)
    const cubeArr = useBadDesign((state) => state.cubeArr)
    const setPreviewCude = useBadDesign((state) => state.setPreviewCude)
    const clearPreview = useBadDesign((state) => state.clearPreview)
    const deleteCube = useBadDesign((state) => state.deleteCube)

    const count = cubeArr.length
    const meshRef = useRef(null)
    const rigidBodiesRef = useRef([])
    const deleteCountRef = useRef(0)
    const isMainView = type === 'main' ? 1 : 0

    // 点击事件判断：删除模式 vs 添加模式
    const onCubeClick = filterClickDelta((e) => {
        if (currentState === 'remove') {
            deleteCube(e)
            deleteCountRef.current += 1
        } else {
            handleCubeClick(e)
        }
    })

    // Leva 调试参数控制
    const {
        lineColor,
        borderThickness,
        deleteColor,
        delteTransparent,
        deleteLine,
        topColor,
        leftColor,
        frontColor,
    } = useControls('🎨 立方体', {
        lineColor: 'rgba(42, 42, 44, 1)',
        borderThickness: { value: 0.015, min: 0.01, max: 0.1, step: 0.01 },
        deleteColor: '#46E216',
        delteTransparent: { value: 0.8, min: 0, max: 1, step: 0.1 },
        deleteLine: '#46E216',
        topColor: '#16E2B9',
        leftColor: '#CCE216',
        frontColor: '#E29316',
    })

    // 物理实例初始数据缓存
    const instances = useMemo(
        () =>
            Array.from({ length: maxCount }, (_, i) => ({
                key: i,
                position: [0, -1000 - i, 0],
                rotation: [0, 0, 0],
            })),
        [maxCount]
    )

    // 6个面的顶点颜色 Buffer 数组
    const [faceColors] = useState(() => ({
        right: new Float32Array(maxCount * 3),
        left: new Float32Array(maxCount * 3),
        top: new Float32Array(maxCount * 3),
        bottom: new Float32Array(maxCount * 3),
        front: new Float32Array(maxCount * 3),
        back: new Float32Array(maxCount * 3),
    }))

    // 更新最新添加的方块属性
    const syncLatestCube = () => {
        const idx = count - 1
        if (idx < 0 || idx >= maxCount) return

        const cube = cubeArr[idx]
        const rb = rigidBodiesRef.current[idx]

        if (rb && cube) {
            rb.setBodyType(1, false) // 1: Fixed
            rb.setLinvel({ x: 0, y: 0, z: 0 }, false)
            rb.setAngvel({ x: 0, y: 0, z: 0 }, false)
            rb.setRotation({ x: 0, y: 0, z: 0, w: 1 }, false)
            rb.setTranslation({ x: cube.position[0], y: cube.position[1], z: cube.position[2] }, true)
            rb.wakeUp()

            tempPos.set(cube.position[0], cube.position[1], cube.position[2])
            tempMat4.compose(tempPos, tempQuat.set(0, 0, 0, 1), tempScale)
            meshRef.current.setMatrixAt(idx, tempMat4)
            meshRef.current.instanceMatrix.needsUpdate = true
            meshRef.current.computeBoundingSphere()
        }

        const setBufferAttr = (attrName, buffer, hexColor) => {
            const color = new THREE.Color(hexColor)
            const offset = idx * 3
            buffer[offset] = color.r
            buffer[offset + 1] = color.g
            buffer[offset + 2] = color.b
            const attr = meshRef.current.geometry.getAttribute(attrName)
            console.log(attr);

            if (attr) attr.needsUpdate = true
        }

        const c = cube.color
        setBufferAttr('aColorRight', faceColors.right, c[0])
        setBufferAttr('aColorLeft', faceColors.left, c[1])
        setBufferAttr('aColorTop', faceColors.top, c[2])
        setBufferAttr('aColorBottom', faceColors.bottom, c[3])
        setBufferAttr('aColorFront', faceColors.front, c[4])
        setBufferAttr('aColorBack', faceColors.back, c[5])
    }

    useEffect(() => {
        if (count === 0 || !meshRef.current || !rigidBodiesRef.current.length) return
        if (currentState === 'add') {
            syncLatestCube()
        }
    }, [count])

    // 物理崩塌动画逻辑
    useEffect(() => {
        if (phySicsType === 'dynamic' && rigidBodiesRef.current.length) {
            let startIndex = 0
            let batchSize = 10
            if (count >= 350) batchSize = 5

            const stepBatch = () => {
                const endIndex = Math.min(startIndex + batchSize, count)
                for (let i = startIndex; i < endIndex; i++) {
                    if (cubeArr[i].isHidden) continue
                    const rb = rigidBodiesRef.current[i]
                    if (rb) {
                        rb.setBodyType(0, true) // 0: Dynamic
                        rb.applyImpulse(
                            {
                                x: (Math.random() - 0.5) * 0.1,
                                y: 0,
                                z: (Math.random() - 0.5) * 0.1,
                            },
                            true
                        )
                        rb.wakeUp()
                    }
                }
                startIndex = endIndex
                if (startIndex < count) {
                    requestAnimationFrame(stepBatch)
                }
            }
            stepBatch()
        }
    }, [phySicsType, count])

    // 游戏重置时，深度隔离隐藏所有的刚体
    useEffect(() => {
        if (!meshRef.current || gameState !== 'default') return

        for (let i = 0; i < maxCount; i++) {
            tempMat4.compose(tempPos.set(0, -2000, 0), tempQuat.set(0, 0, 0, 1), tempScale.set(0, 0, 0))
            meshRef.current.setMatrixAt(i, tempMat4)

            const rb = rigidBodiesRef.current[i]
            if (rb) {
                rb.setLinvel({ x: 0, y: 0, z: 0 }, false)
                rb.setAngvel({ x: 0, y: 0, z: 0 }, false)
                rb.resetForces(false)
                rb.resetTorques(false)
                rb.setRotation({ x: 0, y: 0, z: 0, w: 1 }, false)
                rb.setTranslation({ x: 0, y: -2000 - i * 2, z: 0 }, false)
                rb.setBodyType(1, false) // 1: Fixed
                rb.sleep()
            }
        }
        meshRef.current.instanceMatrix.needsUpdate = true
        meshRef.current.computeBoundingSphere()
        uniforms.isHovered.value = -1
        useBadDesign.getState().startGame()
    }, [gameState, maxCount])

    // 指针悬停在已有立方体表面时计算即将新增方块的预测位置
    const handlePointerMoveCube = (e) => {
        e.stopPropagation()
        const cube = cubeArr[e.instanceId]
        if (!cube) return
        const normal = e.face.normal
        const pos = cube.position
        // console.log(pos, 'dhadhajk');

        setPreviewCude([pos[0] + normal.x, pos[1] + normal.y, pos[2] + normal.z])
    }

    const uniforms = useMemo(
        () => ({
            thickBorder: { value: 0.04 },
            lineColor: { value: new THREE.Color('white') },
            mouseColor: { value: new THREE.Color('red') },
            isHovered: { value: -1 },
            delTrasparent: { value: 0.8 },
            uViewColor: { value: new THREE.Vector3(0, 0, 0) },
            uIsMain: { value: true },
            uDeleteLineColor: { value: new THREE.Color('') },
        }),
        []
    )

    useFrame(() => {
        if (!meshRef.current) return

        for (let i = 0; i < maxCount; i++) {
            const cube = cubeArr[i]
            const rb = rigidBodiesRef.current[i]

            if (i < count && cube && !cube.isHidden) {
                if (phySicsType === 'dynamic' && rb) {
                    const t = rb.translation()
                    const r = rb.rotation()
                    tempMat4.compose(
                        tempPos.set(t.x, t.y, t.z),
                        tempQuat.set(r.x, r.y, r.z, r.w),
                        tempScale.set(1, 1, 1)
                    )
                    meshRef.current.setMatrixAt(i, tempMat4)
                } else {
                    tempMat4.compose(
                        tempPos.set(cube.position[0], cube.position[1], cube.position[2]),
                        tempQuat.set(0, 0, 0, 1),
                        tempScale.set(1, 1, 1)
                    )
                    meshRef.current.setMatrixAt(i, tempMat4)
                }
            } else {
                tempMat4.makeTranslation(0, -2000 - i, 0)
                tempMat4.scale(tempScale.set(0, 0, 0))
                meshRef.current.setMatrixAt(i, tempMat4)
                if (rb) {
                    rb.setTranslation({ x: 0, y: -2000 - i, z: 0 }, true)
                    rb.sleep()
                }
            }
        }

        meshRef.current.instanceMatrix.needsUpdate = true

        // 动态同步 Shader 参数
        if (meshRef.current.material?.uniforms) {
            uniforms.lineColor.value.set(lineColor)
            uniforms.thickBorder.value = borderThickness
            uniforms.mouseColor.value.set(deleteColor)
            uniforms.delTrasparent.value = delteTransparent
            uniforms.uDeleteLineColor.value.set(deleteLine)

            if (type !== 'main') {
                const sideC =
                    type === 'top'
                        ? new THREE.Color(topColor)
                        : type === 'front'
                            ? new THREE.Color(frontColor)
                            : new THREE.Color(leftColor)
                uniforms.uViewColor.value.set(sideC.r, sideC.g, sideC.b)
            } else {
                uniforms.uViewColor.value.set(1, 1, 1)
            }
        }
    })

    return (
        <InstancedRigidBodies
            ref={rigidBodiesRef}
            instances={instances}
            colliders="cuboid"
            type="fixed"
        >
            <instancedMesh
                ref={meshRef}
                args={[null, null, maxCount]}
                count={maxCount}
                onPointerMove={(e) => {
                    e.stopPropagation()
                    if (currentState === 'remove') {
                        uniforms.isHovered.value = e.instanceId
                    } else {
                        handlePointerMoveCube(e)
                    }
                }}
                onPointerLeave={() => {
                    if (currentState === 'remove') {
                        uniforms.isHovered.value = -1
                    } else {
                        clearPreview()
                    }
                }}
                onClick={onCubeClick}
            >
                <boxGeometry args={[1, 1, 1]} />
                <instancedBufferAttribute
                    attach={'geometry-attributes-aColorRight'}
                    args={[faceColors.right, 3]}
                    itemSize={3}
                />
                <instancedBufferAttribute
                    attach="geometry-attributes-aColorLeft"
                    args={[faceColors.left, 3]}
                    itemSize={3}
                />
                <instancedBufferAttribute
                    attach="geometry-attributes-aColorTop"
                    args={[faceColors.top, 3]}
                    itemSize={3}
                />
                <instancedBufferAttribute
                    attach="geometry-attributes-aColorBottom"
                    args={[faceColors.bottom, 3]}
                    itemSize={3}
                />
                <instancedBufferAttribute
                    attach="geometry-attributes-aColorFront"
                    args={[faceColors.front, 3]}
                    itemSize={3}
                />
                <instancedBufferAttribute
                    attach="geometry-attributes-aColorBack"
                    args={[faceColors.back, 3]}
                    itemSize={3}
                />
                <shaderMaterial
                    fragmentShader={fragmentShader}
                    vertexShader={vertexShader}
                    uniforms={uniforms}
                />
            </instancedMesh>
        </InstancedRigidBodies>
    )
}