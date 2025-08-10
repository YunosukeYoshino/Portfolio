'use client'

import { Canvas } from '@react-three/fiber'
import dynamic from 'next/dynamic'
import { Suspense, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

// Dynamically import Three.js components to avoid SSR issues
const Scene = dynamic(() => import('./three/Scene'), { ssr: false })

interface ThreeSceneProps {
  className?: string
}

export default function ThreeScene({ className }: ThreeSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [performanceMode, setPerformanceMode] = useState<'auto' | 'high' | 'low'>('auto')

  useEffect(() => {
    // Auto-detect performance capability
    const detectPerformance = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
      const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4
      const hasLimitedMemory = 'deviceMemory' in navigator && (navigator as any).deviceMemory <= 4

      if (isMobile || isLowEndDevice || hasLimitedMemory) {
        setPerformanceMode('low')
      } else {
        setPerformanceMode('high')
      }
    }

    detectPerformance()
  }, [])

  const canvasSettings = {
    camera: {
      position: [0, 0, 8] as [number, number, number],
      fov: 90,
      near: 0.1,
      far: performanceMode === 'low' ? 100 : 1000,
    },
    dpr: performanceMode === 'low' ? ([1, 1.5] as [number, number]) : ([1, 2] as [number, number]),
    gl: {
      antialias: true, // 常にアンチエイリアスを有効にしてフリッカーを防ぐ
      alpha: true,
      powerPreference: 'high-performance' as WebGLPowerPreference,
      stencil: false,
      depth: true,
      preserveDrawingBuffer: true, // フリッカー防止
      premultipliedAlpha: false, // アルファブレンドの問題を防ぐ
      failIfMajorPerformanceCaveat: false,
      precision: 'highp', // 高精度レンダリング
    },
    shadows: performanceMode !== 'low',
    flat: performanceMode === 'low',
  }

  return (
    <div ref={containerRef} className={className}>
      <Canvas
        {...canvasSettings}
        onCreated={(state) => {
          setIsLoaded(true)

          // フリッカー防止のための追加設定
          state.gl.outputColorSpace = THREE.SRGBColorSpace
          state.gl.toneMapping = THREE.ACESFilmicToneMapping
          state.gl.toneMappingExposure = 1.0
          state.gl.shadowMap.type = THREE.PCFSoftShadowMap

          // Additional performance optimizations
          if (performanceMode === 'low') {
            state.gl.shadowMap.enabled = false
            state.gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
          } else {
            // 高品質設定でのフリッカー防止
            state.gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
            state.gl.shadowMap.enabled = true
          }

          // 一定フレームレートの維持
          state.gl.setAnimationLoop(null) // デフォルトのrequestAnimationFrameを使用
        }}
        frameloop="always" // 常に60FPSを維持してフリッカーを防ぐ
      >
        <Suspense fallback={null}>
          <Scene performanceMode={performanceMode} />
        </Suspense>
      </Canvas>

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
          <div className="text-center">
            <div className="h-12 w-12 mx-auto mb-4 animate-spin rounded-full border-2 border-orange-400 border-t-transparent"></div>
            <div className="text-white/60 text-sm font-mono animate-pulse">
              INITIALIZING 3D ENGINE...
            </div>
          </div>
        </div>
      )}

      {/* Performance indicator */}
      {isLoaded && (
        <div className="absolute top-4 left-4 z-10 text-xs text-white/30 font-mono">
          MODE: {performanceMode.toUpperCase()}
        </div>
      )}
    </div>
  )
}
