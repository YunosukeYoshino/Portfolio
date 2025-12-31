'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const INTERACTIVE_SELECTOR = 'a, button, [role="button"]'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const mousePosition = useRef({ x: -100, y: -100 })
  const cursorPosition = useRef({ x: -100, y: -100 })
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const animationIdRef = useRef<number | undefined>(undefined)

  // Event delegation handlers - work with dynamically added elements
  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as Element
    if (target.closest(INTERACTIVE_SELECTOR)) {
      setIsHovering(true)
    }
  }, [])

  const handleMouseOut = useCallback((e: MouseEvent) => {
    const relatedTarget = e.relatedTarget as Element | null
    // Only reset if not moving to another interactive element
    if (!relatedTarget?.closest(INTERACTIVE_SELECTOR)) {
      setIsHovering(false)
    }
  }, [])

  useEffect(() => {
    // Check if device is mobile/tablet - if so, don't show cursor
    // Note: macOS trackpads report maxTouchPoints > 0, so we need a more reliable check
    const isTouchPrimary = window.matchMedia('(pointer: coarse)').matches
    const isSmallScreen = window.innerWidth <= 768

    // Only hide on actual touch-primary devices (phones/tablets)
    if (isTouchPrimary && isSmallScreen) {
      return
    }

    // Show cursor on desktop (including laptops with trackpads)
    setIsVisible(true)

    const updateMousePosition = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY }
    }

    // Track mouse movement
    window.addEventListener('mousemove', updateMousePosition)

    // Event delegation: listen at document level for dynamic elements
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)

    // Animation loop for smooth cursor movement
    const updateCursorPosition = () => {
      // Always request next frame to keep loop running
      animationIdRef.current = requestAnimationFrame(updateCursorPosition)

      // Skip update if ref not yet available (component still mounting)
      if (!cursorRef.current) return

      // Smooth lerp
      cursorPosition.current.x += (mousePosition.current.x - cursorPosition.current.x) * 0.15
      cursorPosition.current.y += (mousePosition.current.y - cursorPosition.current.y) * 0.15

      cursorRef.current.style.transform = `translate(${cursorPosition.current.x}px, ${cursorPosition.current.y}px)`
    }

    updateCursorPosition()

    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [handleMouseOver, handleMouseOut])

  // Don't render cursor until we know we're on desktop
  if (!isVisible) {
    return null
  }

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor ${isHovering ? 'hover' : ''}`}
      suppressHydrationWarning
    />
  )
}
