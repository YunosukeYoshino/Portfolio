'use client'

import { ReactLenis, useLenis } from 'lenis/react'
import type { ReactNode } from 'react'
import { useEffect } from 'react'

interface LenisProviderProps {
  children: ReactNode
}

function LenisAnchorHandler() {
  const lenis = useLenis()

  useEffect(() => {
    function handleAnchorClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      const link = target.closest('a')

      if (link?.href) {
        const url = new URL(link.href)
        if (url.pathname === window.location.pathname && url.hash) {
          e.preventDefault()
          const targetElement = document.querySelector(url.hash) as HTMLElement
          if (targetElement && lenis) {
            lenis.scrollTo(targetElement, {
              offset: -100,
              duration: 1.2,
              easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
            })
          }
        }
      }
    }

    document.addEventListener('click', handleAnchorClick)
    return () => document.removeEventListener('click', handleAnchorClick)
  }, [lenis])

  return null
}

export default function LenisProvider({ children }: LenisProviderProps) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      }}
    >
      <LenisAnchorHandler />
      {children}
    </ReactLenis>
  )
}
