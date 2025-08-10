'use client'

import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type * as THREE from 'three'

interface InteractiveSceneProps {
  children: React.ReactNode
}

export default function InteractiveScene({ children }: InteractiveSceneProps) {
  const groupRef = useRef<THREE.Group>(null)

  // シンプルな自動カメラ動作
  useFrame((state) => {
    // 基本的な浮遊感のあるカメラ動作
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05
    }
  })

  return <group ref={groupRef}>{children}</group>
}
