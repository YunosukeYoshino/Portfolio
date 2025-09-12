'use client'

import type { ReactNode } from 'react'
import { useEffect } from 'react'

interface LenisProviderProps {
  children: ReactNode
}

function SimpleAnchorHandler() {
  useEffect(() => {
    function handleAnchorClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      const link = target.closest('a')

      if (link?.href) {
        const url = new URL(link.href)
        if (url.pathname === window.location.pathname && url.hash) {
          e.preventDefault()
          const targetElement = document.querySelector(url.hash) as HTMLElement
          if (targetElement) {
            // Use native smooth scroll instead of lenis
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            })
            // Add small offset
            setTimeout(() => {
              window.scrollBy(0, -100)
            }, 100)
          }
        }
      }
    }

    document.addEventListener('click', handleAnchorClick)
    return () => document.removeEventListener('click', handleAnchorClick)
  }, [])

  return null
}

export default function LenisProvider({ children }: LenisProviderProps) {
  return (
    <>
      <SimpleAnchorHandler />
      {children}
    </>
  )
}
