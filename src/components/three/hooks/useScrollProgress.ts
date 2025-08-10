'use client'

import { useEffect, useState } from 'react'

interface ScrollData {
  progress: number // 0-1 の進行度
  direction: 'up' | 'down' | 'none'
  velocity: number // スクロール速度
  isScrolling: boolean
}

export function useScrollProgress(): ScrollData {
  const [scrollData, setScrollData] = useState<ScrollData>({
    progress: 0,
    direction: 'none',
    velocity: 0,
    isScrolling: false,
  })

  useEffect(() => {
    let lastScrollY = 0
    let lastTimeStamp = 0
    let scrollTimeout: NodeJS.Timeout

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = maxScroll > 0 ? Math.min(currentScrollY / maxScroll, 1) : 0

      const currentTime = Date.now()
      const timeDiff = currentTime - lastTimeStamp
      const scrollDiff = currentScrollY - lastScrollY

      const velocity = timeDiff > 0 ? Math.abs(scrollDiff / timeDiff) : 0
      const direction = scrollDiff > 0 ? 'down' : scrollDiff < 0 ? 'up' : 'none'

      setScrollData({
        progress,
        direction,
        velocity: Math.min(velocity * 10, 1), // Normalize velocity
        isScrolling: true,
      })

      lastScrollY = currentScrollY
      lastTimeStamp = currentTime

      // Reset scrolling state after scroll stops
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        setScrollData((prev) => ({
          ...prev,
          isScrolling: false,
          velocity: 0,
          direction: 'none',
        }))
      }, 150)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [])

  return scrollData
}
