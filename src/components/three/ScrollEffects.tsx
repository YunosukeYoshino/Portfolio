'use client'

import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useScrollProgress } from './hooks/useScrollProgress'
import { easing, mapRange } from './utils/easing'

export default function ScrollEffects() {
  const scrollData = useScrollProgress()
  const particlesRef = useRef<THREE.Points>(null)
  const ringsRef = useRef<THREE.Group>(null)

  // パーティクルシステムの作成
  const particleSystem = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const count = 200
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const scales = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      // 球状に配置
      const radius = 5 + Math.random() * 5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = radius * Math.cos(phi)

      // カラフルな色
      colors[i3] = Math.random()
      colors[i3 + 1] = Math.random()
      colors[i3 + 2] = Math.random()

      scales[i] = Math.random()
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1))

    const material = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    })

    return { geometry, material }
  }, [])

  // リングエフェクトの作成
  const rings = useMemo(() => {
    const ringGroup = []
    for (let i = 0; i < 3; i++) {
      const geometry = new THREE.TorusGeometry(2 + i * 0.5, 0.02, 8, 32)
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(i * 0.3, 0.7, 0.5),
        transparent: true,
        opacity: 0.3,
      })
      ringGroup.push({ geometry, material })
    }
    return ringGroup
  }, [])

  useFrame((state) => {
    // パーティクルの動的制御
    if (particlesRef.current) {
      const material = particlesRef.current.material as THREE.PointsMaterial

      // スクロール進行度でサイズと透明度を制御
      const size = mapRange(scrollData.progress, 0, 1, 0.05, 0.15, easing.easeInOutCubic)

      const opacity = mapRange(scrollData.progress, 0, 1, 0.3, 0.8, easing.easeInOutQuad)

      material.size = size + Math.sin(state.clock.elapsedTime * 2) * 0.02
      material.opacity = opacity + scrollData.velocity * 0.3

      // 回転
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1 + scrollData.progress * 2
    }

    // リングエフェクトの動的制御
    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, index) => {
        const mesh = ring as THREE.Mesh
        const material = mesh.material as THREE.MeshBasicMaterial

        // スクロールベースの回転
        const rotationSpeed = 0.5 + index * 0.2
        mesh.rotation.x = state.clock.elapsedTime * rotationSpeed + scrollData.progress * Math.PI
        mesh.rotation.z = state.clock.elapsedTime * rotationSpeed * 0.5

        // スクロール進行度で透明度を制御
        const opacity = mapRange(scrollData.progress, 0, 1, 0.1, 0.4, easing.easeInOutCubic)

        material.opacity = opacity + Math.sin(state.clock.elapsedTime * 3 + index) * 0.1

        // 色の変化
        const hue = (index * 0.3 + scrollData.progress * 2) % 1
        material.color.setHSL(hue, 0.7, 0.5)
      })
    }
  })

  return (
    <group>
      {/* パーティクルエフェクト */}
      <points
        ref={particlesRef}
        geometry={particleSystem.geometry}
        material={particleSystem.material}
      />

      {/* リングエフェクト */}
      <group ref={ringsRef}>
        {rings.map((ring, index) => (
          <mesh
            key={`ring-${index}-${ring.geometry.uuid}`}
            geometry={ring.geometry}
            material={ring.material}
            position={[0, 0, 0]}
          />
        ))}
      </group>
    </group>
  )
}
