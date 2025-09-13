'use client'

import { useThree } from '@react-three/fiber'
import { useEffect, useState } from 'react'

interface ResponsiveConfig {
  isDesktop: boolean
  isTablet: boolean
  isMobile: boolean
  pixelRatio: number
  performanceLevel: 'high' | 'medium' | 'low'
  qualitySettings: {
    shadowMapSize: number
    particleCount: number
    enableBloom: boolean
    enableFilm: boolean
    morphIntensity: number
  }
}

export function useResponsive3D(): ResponsiveConfig {
  const { gl } = useThree()
  const [config, setConfig] = useState<ResponsiveConfig>({
    isDesktop: true,
    isTablet: false,
    isMobile: false,
    pixelRatio: 1,
    performanceLevel: 'high',
    qualitySettings: {
      shadowMapSize: 2048,
      particleCount: 1000,
      enableBloom: true,
      enableFilm: true,
      morphIntensity: 0.5,
    },
  })

  useEffect(() => {
    const updateConfig = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)

      // Device detection
      const isMobile = width < 768
      const isTablet = width >= 768 && width < 1024
      const isDesktop = width >= 1024

      // Performance level detection based on device and screen size
      let performanceLevel: 'high' | 'medium' | 'low' = 'high'

      // Check for low-end devices
      const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4
      const isRetinaDisplay = pixelRatio > 1.5
      const isLargeScreen = width > 1920 || height > 1080

      if (isMobile || isLowEndDevice) {
        performanceLevel = 'low'
      } else if (isTablet || (isRetinaDisplay && isLargeScreen)) {
        performanceLevel = 'medium'
      }

      // Quality settings based on performance level
      const qualitySettings = {
        high: {
          shadowMapSize: 2048,
          particleCount: 1000,
          enableBloom: true,
          enableFilm: true,
          morphIntensity: 0.5,
        },
        medium: {
          shadowMapSize: 1024,
          particleCount: 600,
          enableBloom: true,
          enableFilm: false,
          morphIntensity: 0.3,
        },
        low: {
          shadowMapSize: 512,
          particleCount: 300,
          enableBloom: false,
          enableFilm: false,
          morphIntensity: 0.2,
        },
      }

      setConfig({
        isDesktop,
        isTablet,
        isMobile,
        pixelRatio,
        performanceLevel,
        qualitySettings: qualitySettings[performanceLevel],
      })

      // Update WebGL renderer settings
      gl.setPixelRatio(pixelRatio)
      gl.setSize(width, height)

      // Optimize renderer settings based on performance level
      if (performanceLevel === 'low') {
        gl.shadowMap.enabled = false
      } else {
        gl.shadowMap.enabled = true
        gl.shadowMap.type = performanceLevel === 'high' ? 2 : 1 // PCFSoftShadowMap : PCFShadowMap
      }
    }

    updateConfig()
    window.addEventListener('resize', updateConfig)

    return () => window.removeEventListener('resize', updateConfig)
  }, [gl])

  return config
}
