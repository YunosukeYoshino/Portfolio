'use client'

import { useEffect, useRef, useState } from 'react'
import { createWebGLBackgroundScene } from './createWebGLBackgroundScene'

export default function WebGLBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !isMounted || !containerRef.current) {
      return
    }

    let cleanup: (() => void) | undefined
    let isDisposed = false

    void createWebGLBackgroundScene(containerRef.current).then((dispose) => {
      if (isDisposed) {
        dispose()
        return
      }
      cleanup = dispose
    })

    return () => {
      isDisposed = true
      cleanup?.()
    }
  }, [isMounted])

  return (
    <div ref={containerRef} className="pointer-events-none absolute -inset-1 z-0 bg-[#c8d4b8]" />
  )
}
