'use client'

import { useFrame } from '@react-three/fiber'
import { createContext, useContext, useRef } from 'react'
import type * as THREE from 'three'

// Context for sharing mouse position across components
const MouseContext = createContext<{ x: number; y: number }>({ x: 0, y: 0 })

export const useMousePosition = () => useContext(MouseContext)

interface InteractiveSceneProps {
  children: React.ReactNode
}

export default function InteractiveScene({ children }: InteractiveSceneProps) {
  const groupRef = useRef<THREE.Group>(null)

  // Automatic floating camera movement
  useFrame((state) => {
    if (groupRef.current) {
      // Subtle rotation based on time for floating effect
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05
      groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.08) * 0.03
    }
  })

  // Provide default mouse position for compatibility
  const defaultMousePosition = { x: 0, y: 0 }

  return (
    <MouseContext.Provider value={defaultMousePosition}>
      <group ref={groupRef}>{children}</group>
    </MouseContext.Provider>
  )
}
