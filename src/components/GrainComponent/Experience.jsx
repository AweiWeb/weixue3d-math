import { OrbitControls, Instances, Instance, useGLTF } from "@react-three/drei"
import useGrain from "../../store/grain"
import { useShallow } from "zustand/shallow"
import { useControls } from "leva"
import { useMemo, useRef, useEffect } from "react"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber"

const Experience = () => {
    const { riceX, riceY, riceZ, cutX, cutY, cutZ, opX, opY, opZ, gapX, gapY, gapZ, mode } = useGrain(
        useShallow(s => ({
            riceX: s.riceX, riceY: s.riceY, riceZ: s.riceZ,
            cutX: s.cutX, cutY: s.cutY, cutZ: s.cutZ,
            opX: s.opX, opY: s.opY, opZ: s.opZ,
            mode: s.mode,
            gapX: s.gapX, gapY: s.gapY, gapZ: s.gapZ,
        }))
    )

    const instancedRef = useRef()

    const { Max: currentCount, opacity, lineWidth } = useControls('调试面板', {
        mode: {
            value: 'rice',
            options: ['rice', 'cube'],
        },
        Max: {
            value: 10000,
            min: 1,
            max: 100000,
            step: 1,
        },
        opacity: {
            value: 0.70,
            min: 0,
            max: 1,
            step: 0.01,
        },
        lineWidth: {
            value: 0.03,
            min: 0,
            max: 0.2,
            step: 0.01,
        }

    })
    const customUniform = useMemo(() => {
        return {
            uTime: { value: 0 },
            uOpacity: { value: 0.70 },
            isCube: { value:  0 },
            lineWidth: { value: 0.03 },
        }
    }, [])
    useFrame((state, delta) => {
        // customUniform.uTime.value = state.clock.elapsedTime
        customUniform.uOpacity.value = opacity
        customUniform.isCube.value = mode === 'cube' ? 1 : 0
        customUniform.lineWidth.value = lineWidth
        // if (Math.random() < 0.01) console.log('🎮 useFrame isCube:', customUniform.isCube.value, 'mode:', mode, 'lineWidth:', customUniform.lineWidth.value)
    })

    // 预分配
    const emptyEdge = useMemo(() => new Float32Array(currentCount), [currentCount])
    const emptyHighlight = useMemo(() => new Float32Array(currentCount), [currentCount])

    const { nodes, materials } = useGLTF('/grain/rice-normal.glb')

    //根据 mode 切换
    const geometry = useMemo(() => {
        if (mode === 'cube') return new THREE.BoxGeometry(1, 1, 1)
        return nodes['tripo_node_04870ef7-7995-4707-84ca-6d51e77f0f52001'].geometry
    }, [mode, nodes])

    //  材质劫持
    const customMaterial = useMemo(() => {
        const mat = mode === 'cube'
            ? new THREE.MeshStandardMaterial()
            : materials['tripo_material_04870ef7-7995-4707-84ca-6d51e77f0f52.001'].clone()
        mat.transparent = true;
        // mat.needsUpdate = true
        mat.onBeforeCompile = (shader) => {
            // console.log('🔧 onBeforeCompile, mode:', mode, 'isCube:', customUniform.isCube.value);
            // shader.uniforms.uTime = customUniform.uTime
            shader.uniforms.uOpacity = customUniform.uOpacity
            shader.uniforms.isCube = customUniform.isCube
            shader.uniforms.lineWidth = customUniform.lineWidth
            
            shader.vertexShader = shader.vertexShader.replace(
                '#include <common>',
                `#include <common>
                attribute float a_isEdge;
                attribute float a_isHighlight;
                varying float vIsEdge;
                varying float vIsHighlight;
                varying vec3 vLocalPosition;
                varying vec3 vLocalNormal;
                `
            )
            shader.vertexShader = shader.vertexShader.replace(
                '#include <begin_vertex>',
                `#include <begin_vertex>
                vIsEdge = a_isEdge;
                vIsHighlight = a_isHighlight;
                vLocalPosition = position;
                vLocalNormal = normal;
                `
            )
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <common>',
                `#include <common>
                varying vec3 vLocalPosition;
                varying vec3 vLocalNormal;
                uniform float uOpacity;
                uniform float isCube;
                uniform float lineWidth;
                varying float vIsEdge;
                varying float vIsHighlight;`
            )
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <map_fragment>',
                `#include <map_fragment>
                float edge = 0.04;
                vec3 edgeColor = vec3(0.0, 0.0, 0.0);
                vec3 deleteColor = vec3(0.54, 0.89, 1.0);
                vec3 highlightColor = vec3(1.0, 1.0, 0.0);
                vec3 finalColor = vec3(1.0, 1.0, 1.0);
                float opacity = 0.98;
                if (isCube > 0.5) {
                    float edgeWidth = lineWidth; 
                vec3 absPos = abs(vLocalPosition);
                vec3 planarPos = absPos * (1.0 - abs(vLocalNormal));
                
                float maxDist = max(planarPos.x, max(planarPos.y, planarPos.z));
                
                float borderMask = step(0.5 - edgeWidth, maxDist);
             
                if (vIsEdge > 0.5) {
                    finalColor = mix(deleteColor, edgeColor, borderMask);
                    opacity = uOpacity;
                }else if (vIsHighlight > 0.5) {
                    finalColor = mix(highlightColor, edgeColor, borderMask);
                    opacity = uOpacity;
                }else{
                     finalColor = mix(finalColor, edgeColor, borderMask);
                    }
                diffuseColor.rgba = vec4(finalColor, opacity);
                } 
                else{
                    if (vIsEdge > 0.5) {
                    diffuseColor.rgba = vec4(deleteColor, uOpacity);
                }else if (vIsHighlight > 0.5) {
                    diffuseColor.rgba = vec4(highlightColor, uOpacity);
                }
    }
            `
            )
        }
       mat.needsUpdate = true
        mat.customProgramCacheKey = () => mode === 'cube' ? 'custom_edge_cube_v4' : 'custom_edge_material_v1';
        return mat
    }, [materials, customUniform, mode])



    //  2. 准备数据：同时计算位置和自定义参数
    const { riceData, edgeDataArray, highlightDataArray } = useMemo(() => {
        // console.log('useMemo recalc, gap:', gapX, gapY, gapZ, 'op:', opX, opY, opZ, 'cut:', cutX, cutY, cutZ)
        const data = []
        const maxCurrentItems = riceX * riceY * riceZ
        const edgeArray = new Float32Array(maxCurrentItems)
        const highlightArray = new Float32Array(maxCurrentItems)
        const spacingx = mode === 'cube' ? 1 : 1
        const spacingy = mode === 'cube' ? 1 : 0.4
        const spacingz = mode === 'cube' ? 1 : 0.6

        let index = 0
        for (let x = 0; x < riceX; x++) {
            for (let y = 0; y < riceY; y++) {
                for (let z = 0; z < riceZ; z++) {
                    const posX = (x - (riceX - 1) / 2) * spacingx
                    const posY = (y - (riceY - 1) / 2) * spacingy
                    const posZ = (z - (riceZ - 1) / 2) * spacingz
                    const rotZ = 0.5 * Math.PI

                    // cut 优先于 highlight，再按 X > Y > Z
                    let isEdge = false
                    let isHighlight = false
                    let offsetX = 0, offsetY = 0, offsetZ = 0

                    // 第一遍：cut（红色优先）
                    if (opX === 'cut' && x >= riceX - cutX) {
                        isEdge = true
                        offsetX = gapX
                    } else if (opY === 'cut' && y >= riceY - cutY) {
                        isEdge = true
                        offsetY = gapY
                    } else if (opZ === 'cut' && z >= riceZ - cutZ) {
                        isEdge = true
                        offsetZ = gapZ
                    }
                    // 第二遍：highlight（没有 cut 才走）
                    else if (opX === 'highlight' && x >= riceX - cutX) {
                        isHighlight = true
                        offsetX = gapX
                    } else if (opY === 'highlight' && y >= riceY - cutY) {
                        isHighlight = true
                        offsetY = gapY
                    } else if (opZ === 'highlight' && z >= riceZ - cutZ) {
                        isHighlight = true
                        offsetZ = gapZ
                    }

                    
                    edgeArray[index] = isEdge ? 1.0 : 0.0
                    highlightArray[index] = isHighlight ? 1.0 : 0.0
                    data.push({
                        position: [posX + offsetX, posY + offsetY, posZ + offsetZ],
                        rotation: [0, 0, mode === 'cube' ? 0 : rotZ]
                    })
                    index++
                }
            }
        }
        return { riceData: data, edgeDataArray: edgeArray, highlightDataArray: highlightArray }
    }, [riceX, riceY, riceZ, cutX, cutY, cutZ, opX, opY, opZ, gapX, gapY, gapZ, mode])


    // 数据更新（不存在则创建）
    useEffect(() => {
        const geo = instancedRef.current?.geometry
        if (!geo) return
        let attr = geo.getAttribute('a_isEdge')
        if (!attr) {
            attr = new THREE.InstancedBufferAttribute(emptyEdge, 1)
            geo.setAttribute('a_isEdge', attr)
        }
        if (!edgeDataArray) return
        const filled = new Float32Array(attr.count)
        filled.set(edgeDataArray)
        attr.set(filled)
        attr.needsUpdate = true
    }, [geometry, edgeDataArray, emptyEdge])

    useEffect(() => {
        const geo = instancedRef.current?.geometry
        if (!geo) return
        let attr = geo.getAttribute('a_isHighlight')
        if (!attr) {
            attr = new THREE.InstancedBufferAttribute(emptyHighlight, 1)
            geo.setAttribute('a_isHighlight', attr)
        }
        if (!highlightDataArray) return
        const filled = new Float32Array(attr.count)
        filled.set(highlightDataArray)
        attr.set(filled)
        attr.needsUpdate = true
    }, [geometry, highlightDataArray, emptyHighlight])

    return (
        <>
            <Instances
                ref={instancedRef}
                range={riceData.length}
                limit={10000}
                geometry={geometry}
                material={customMaterial}
                castShadow
                receiveShadow
            >
                <instancedBufferAttribute
                    attach="geometry-attributes-a_isEdge"
                    args={[emptyEdge, 1]}
                />
                <instancedBufferAttribute
                    attach="geometry-attributes-a_isHighlight"
                    args={[emptyHighlight, 1]}
                />
                {riceData.map((item, index) => (
                    <Instance
                        key={index}
                        position={item.position}
                        rotation={item.rotation}
                    />
                ))}
            </Instances>
            <OrbitControls />
     
        </>
    )
}

useGLTF.preload('/grain/rice-normal.glb')

export default Experience