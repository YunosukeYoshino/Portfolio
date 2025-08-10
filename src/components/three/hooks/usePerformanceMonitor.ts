'use client'

import { useFrame } from '@react-three/fiber'
import { useCallback, useRef, useState } from 'react'

interface PerformanceStats {
  fps: number
  avgFps: number
  frameTime: number
  memoryUsage?: number
  isLowPerformance: boolean
}

export function usePerformanceMonitor() {
  const [stats, setStats] = useState<PerformanceStats>({
    fps: 60,
    avgFps: 60,
    frameTime: 16.67,
    isLowPerformance: false,
  })

  const frameTimesRef = useRef<number[]>([])
  const lastTimeRef = useRef<number>(0)
  const frameCountRef = useRef<number>(0)

  const lowPerformanceThreshold = 30 // FPS threshold for performance degradation
  const measurementWindow = 60 // frames to average over

  useFrame(() => {
    const currentTime = performance.now()

    if (lastTimeRef.current > 0) {
      const frameTime = currentTime - lastTimeRef.current
      const fps = 1000 / frameTime

      // Add frame time to rolling window
      frameTimesRef.current.push(frameTime)
      if (frameTimesRef.current.length > measurementWindow) {
        frameTimesRef.current.shift()
      }

      frameCountRef.current++

      // Update stats every 30 frames for smooth updates
      if (frameCountRef.current % 30 === 0) {
        const avgFrameTime =
          frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length
        const avgFps = 1000 / avgFrameTime
        const isLowPerformance = avgFps < lowPerformanceThreshold

        // Get memory usage if available (Chrome only)
        let memoryUsage: number | undefined
        if ('memory' in performance && (performance as any).memory) {
          const memory = (performance as any).memory
          memoryUsage = memory.usedJSHeapSize / 1024 / 1024 // MB
        }

        setStats({
          fps: Math.round(fps),
          avgFps: Math.round(avgFps),
          frameTime: Math.round(frameTime * 100) / 100,
          memoryUsage,
          isLowPerformance,
        })
      }
    }

    lastTimeRef.current = currentTime
  })

  // Adaptive quality adjustment based on performance
  const getQualityRecommendation = useCallback(() => {
    if (stats.avgFps < 20) return 'low'
    if (stats.avgFps < 40) return 'medium'
    return 'high'
  }, [stats.avgFps])

  return { stats, getQualityRecommendation }
}
