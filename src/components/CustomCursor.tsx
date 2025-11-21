'use client'

import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const mousePosition = useRef({ x: 0, y: 0 })
  const cursorPosition = useRef({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const animationIdRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    // Check if device is mobile/tablet
    const checkMobile = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const isSmallScreen = window.innerWidth <= 768
      setIsMobile(hasTouch || isSmallScreen)
    }

    // Initial check
    checkMobile()

    // Update on resize
    window.addEventListener('resize', checkMobile)

    const updateMousePosition = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    // Track mouse movement
    window.addEventListener('mousemove', updateMousePosition)

    // Track hover states for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [role="button"]')
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    })

    // Animation loop for smooth cursor movement
    const updateCursorPosition = () => {
      if (!cursorRef.current) return

      // Smooth lerp
      cursorPosition.current.x += (mousePosition.current.x - cursorPosition.current.x) * 0.15
      cursorPosition.current.y += (mousePosition.current.y - cursorPosition.current.y) * 0.15

      cursorRef.current.style.transform = `translate(${cursorPosition.current.x}px, ${cursorPosition.current.y}px)`

      animationIdRef.current = requestAnimationFrame(updateCursorPosition)
    }

    updateCursorPosition()

    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('mousemove', updateMousePosition)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [])

  // Don't render cursor on mobile devices
  if (isMobile) {
    return null
  }

  return <div ref={cursorRef} className={`custom-cursor ${isHovering ? 'hover' : ''}`} />
}
