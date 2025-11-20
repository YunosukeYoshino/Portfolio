'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface LenisProviderProps {
  children: ReactNode
}

export default function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Initialize Lenis with performance-optimized settings
    const lenis = new Lenis({
      duration: 0.8, // Reduced from 1.2 for faster scroll response
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.2, // Slightly increased for more responsive scrolling
      touchMultiplier: 2,
      infinite: false,
    })

    lenisRef.current = lenis

    // Lenis RAF
    let animationId: number
    function raf(time: number) {
      lenis.raf(time)
      animationId = requestAnimationFrame(raf)
    }

    animationId = requestAnimationFrame(raf)

    // Throttled ScrollTrigger update for better performance
    let scrollTriggerTimeout: number | undefined
    lenis.on('scroll', () => {
      if (scrollTriggerTimeout) return
      scrollTriggerTimeout = window.setTimeout(() => {
        ScrollTrigger.update()
        scrollTriggerTimeout = undefined
      }, 16) // ~60fps throttle
    })

    // Handle anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')

      if (link?.href) {
        const url = new URL(link.href)
        if (url.pathname === window.location.pathname && url.hash) {
          e.preventDefault()
          const targetElement = document.querySelector(url.hash)
          if (targetElement) {
            lenis.scrollTo(targetElement as HTMLElement, {
              offset: -100,
              duration: 1.5,
            })
          }
        }
      }
    }

    document.addEventListener('click', handleAnchorClick)

    // Cleanup
    return () => {
      document.removeEventListener('click', handleAnchorClick)
      cancelAnimationFrame(animationId)
      if (scrollTriggerTimeout) {
        clearTimeout(scrollTriggerTimeout)
      }
      lenis.destroy()
      for (const trigger of ScrollTrigger.getAll()) {
        trigger.kill()
      }
    }
  }, [])

  return <>{children}</>
}
