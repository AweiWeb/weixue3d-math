import { useEffect, useMemo, useRef, useState } from "react"
import * as THREE from 'three'
import particleVertex from './shader/vertex.glsl'
import particleFragment from './shader/fragment.glsl'
import { shaderMaterial } from "@react-three/drei"
import { extend, useFrame } from "@react-three/fiber"
import { randFloat, randFloatSpread } from "three/src/math/MathUtils.js"
const tmpColor = new THREE.Color()
const tmRotationEluer = new THREE.Euler()
const tmPosition = new THREE.Vector3()
const tmRotation = new THREE.Quaternion()
const tmScale = new THREE.Vector3(1, 1, 1)
const tmMatrix = new THREE.Matrix4()

const ExplosionParticle = ({ initPosition = [0, 17, 0], geometry, particleCount, direction, speed, ...prop }) => {
    /*
    *粒子特效
    */
    const particleRef = useRef(null)
    const startTimeRef = useRef(null);
    console.log(geometry);

    const [particleAttribute] = useState({
        instanceLifeTime: new Float32Array(particleCount * 2),
        instanceVelocity: new Float32Array(particleCount * 3),
        instanceColor: new Float32Array(particleCount * 3),
        instanceEndColor: new Float32Array(particleCount * 3),
        instanceSpeed: new Float32Array(particleCount),
        instanceDirection: new Float32Array(particleCount * 3),
        instanceRotationSpeed: new Float32Array(particleCount * 3)
    })
    const emit = () => {
        const instanceColor = particleRef.current.geometry.getAttribute('instanceColor')
        const instanceLifeTime = particleRef.current.geometry.getAttribute('instanceLifeTime')
        const instanceDirection = particleRef.current.geometry.getAttribute('instanceDirection')
        const instanceSpeed = particleRef.current.geometry.getAttribute('instanceSpeed')
        const instanceRotationSpeed = particleRef.current.geometry.getAttribute('instanceRotationSpeed')

        for (let i = 0; i < particleCount; i++) {
            const position = [
                randFloatSpread(5),
                randFloatSpread(5),
                randFloatSpread(5),
            ];
            const scale = [
                randFloatSpread(1),
                randFloatSpread(1),
                randFloatSpread(1),
            ];
            const rotation = [
                randFloatSpread(Math.PI),
                randFloatSpread(Math.PI),
                randFloatSpread(Math.PI),
            ];
            tmPosition.set(...position)
            tmScale.set(...scale)
            tmRotationEluer.set(...rotation)
            tmRotation.setFromEuler(tmRotationEluer)
            tmMatrix.compose(tmPosition, tmRotation, tmScale);
            particleRef.current.setMatrixAt(i, tmMatrix);

            /*
            * 设置每个 实例的方向 速度，颜色， 生命周期，旋转速度
            */
            const direction = [
                randFloat(-1, 1),
                randFloat(-1, 1),
                randFloat(-1, 1)
            ]
            instanceDirection.set(direction, i * 3)

            tmpColor.setRGB(Math.random(), Math.random(), Math.random())
            // console.log(instanceColor);
            instanceColor.set([tmpColor.r, tmpColor.g, tmpColor.b], i * 3)

            const lifeTime = [0, randFloat(5, 10)]
            instanceLifeTime.set(lifeTime, i * 2)

            const speed = randFloat(1, 5)
            instanceSpeed.set([speed], i)

            const rotationSpeed = [
                randFloatSpread(1),
                randFloatSpread(1),
                randFloatSpread(1)
            ]
            instanceRotationSpeed.set(rotationSpeed, i * 3)
        }

        //视图矩阵更新
        particleRef.current.instanceMatrix.needsUpdate = true

        instanceColor.needsUpdate = true
        instanceDirection.needsUpdate = true
        instanceLifeTime.needsUpdate = true
        instanceRotationSpeed.needsUpdate = true
        instanceSpeed.needsUpdate = true
    }
    /*
    * 粒子发射器
    */
    useEffect(() => {
        emit()
    }, [])
    useFrame(({ clock }) => {
        if (!particleRef.current) return;
        if (startTimeRef.current === null) {
            startTimeRef.current = clock.elapsedTime;
        }
        particleRef.current.material.uniforms.uTime.value =
            clock.elapsedTime - startTimeRef.current;
    })
    const defaultGeometry = useMemo(() => new THREE.PlaneGeometry(2, 2), [])
    return <group position={initPosition}>
        <instancedMesh args={[defaultGeometry, null, particleCount]} ref={particleRef}>
            {geometry}
            <particleMaterial transparent={true} side={THREE.DoubleSide} />
            <instancedBufferAttribute
                attach={'geometry-attributes-instanceColor'}
                args={[particleAttribute.instanceColor]}
                count={particleCount}
                itemSize={3}
            />
            <instancedBufferAttribute
                attach={'geometry-attributes-instanceLifeTime'}
                count={particleCount}
                args={[particleAttribute.instanceLifeTime]}
                itemSize={2}
            />
            <instancedBufferAttribute
                attach={'geometry-attributes-instanceDirection'}
                count={particleCount}
                args={[particleAttribute.instanceDirection]}
                itemSize={3}
            />
            <instancedBufferAttribute
                attach={'geometry-attributes-instanceSpeed'}
                args={[particleAttribute.instanceSpeed]}
                count={particleCount}
                itemSize={1}
            />
            <instancedBufferAttribute
                attach={'geometry-attributes-instanceRotationSpeed'}
                args={[particleAttribute.instanceRotationSpeed]}
                count={particleCount}
                itemSize={3}
            />
            <instancedBufferAttribute
                attach={'geometry-attributes-instanceEndColor'}
                args={[particleAttribute.instanceEndColor]}
                count={particleCount}
                itemSize={3}
            />
        </instancedMesh>
    </group>
}

const ParticleMaterial = shaderMaterial({
    color: new THREE.Color(0.0, 1.0, 0.0),
    time: 0,
    alphaImg: '',
    gravity: 9.8,
    uTime: 0,
    uFadeAlpha: [0, 0.6]
}, particleVertex, particleFragment)

extend({ ParticleMaterial })

export default ExplosionParticle