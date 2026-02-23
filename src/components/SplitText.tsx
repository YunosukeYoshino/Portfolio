'use client'

import React, { useEffect, useRef } from 'react'

interface SplitTextProps {
  children: string | React.ReactNode
  className?: string
  as?: React.ElementType
}

export default function SplitText({
  children,
  className = '',
  as: Component = 'div',
}: SplitTextProps) {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container || typeof window === 'undefined') return

    // Quick check to strip React nodes to plain text if needed
    // In our usage, we expect string or simple children, but we'll animate elements with .word class
    const words = container.querySelectorAll('.word')

    let gsapContext: { revert: () => void } | undefined

    Promise.all([
      import('gsap').then((m) => m.default),
      import('gsap/ScrollTrigger').then((m) => m.default),
    ]).then(([gsap, ScrollTrigger]) => {
      gsap.registerPlugin(ScrollTrigger)

      gsapContext = gsap.context(() => {
        gsap.fromTo(
          words,
          {
            opacity: 0,
            yPercent: 100,
            rotateZ: 4,
          },
          {
            opacity: 1,
            yPercent: 0,
            rotateZ: 0,
            duration: 1,
            ease: 'expo.out',
            stagger: 0.05,
            scrollTrigger: {
              trigger: container,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }, containerRef)
    })

    return () => {
      if (gsapContext) gsapContext.revert()
    }
  }, [])

  // Helper to safely split only text
  const splitContent = React.Children.map(children, (child) => {
    if (typeof child === 'string') {
      return child.split(/(\s+)/).map((word, i) => {
        if (word.trim() === '') return word // keep spaces as is
        return (
          <span key={i} className="inline-block overflow-hidden align-bottom">
            <span className="word inline-block transform origin-bottom-left will-change-transform">
              {word}
            </span>
          </span>
        )
      })
    }
    // If it's a DOM element (like <br/> or <span>), keep as is but wrap words if it has children
    return child
  })

  return (
    <Component ref={containerRef} className={className}>
      {splitContent}
    </Component>
  )
}
