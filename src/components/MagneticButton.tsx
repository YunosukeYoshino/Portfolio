'use client'

import { useEffect, useRef } from 'react'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  intensity?: number
}

export default function MagneticButton({
  children,
  className = '',
  intensity = 0.5,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const button = buttonRef.current
    if (!button || typeof window === 'undefined') return

    // Quick check to skip on touch devices
    const isTouchPrimary = window.matchMedia('(pointer: coarse)').matches
    if (isTouchPrimary) return

    let gsapContext: { revert: () => void } | undefined

    import('gsap').then(({ default: gsap }) => {
      gsapContext = gsap.context(() => {
        const xTo = gsap.quickTo(button, 'x', { duration: 1, ease: 'elastic.out(1, 0.3)' })
        const yTo = gsap.quickTo(button, 'y', { duration: 1, ease: 'elastic.out(1, 0.3)' })

        const handleMouseMove = (e: MouseEvent) => {
          const { clientX, clientY } = e
          const { height, width, left, top } = button.getBoundingClientRect()
          const x = (clientX - (left + width / 2)) * intensity
          const y = (clientY - (top + height / 2)) * intensity
          xTo(x)
          yTo(y)
        }

        const handleMouseLeave = () => {
          xTo(0)
          yTo(0)
        }

        button.addEventListener('mousemove', handleMouseMove)
        button.addEventListener('mouseleave', handleMouseLeave)

        return () => {
          button.removeEventListener('mousemove', handleMouseMove)
          button.removeEventListener('mouseleave', handleMouseLeave)
        }
      }, buttonRef)
    })

    return () => {
      if (gsapContext) gsapContext.revert()
    }
  }, [intensity])

  return (
    <div ref={buttonRef} className={`inline-block ${className}`}>
      {children}
    </div>
  )
}
