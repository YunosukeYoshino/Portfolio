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

    // Animation loop for smooth cursor movement - only runs when needed
    const updateCursorPosition = () => {
      animationIdRef.current = undefined

      if (!cursorRef.current) return

      const dx = mousePosition.current.x - cursorPosition.current.x
      const dy = mousePosition.current.y - cursorPosition.current.y

      cursorPosition.current.x += dx * 0.15
      cursorPosition.current.y += dy * 0.15

      cursorRef.current.style.transform = `translate(${cursorPosition.current.x}px, ${cursorPosition.current.y}px)`

      // Continue loop only while cursor is still catching up to mouse
      if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
        animationIdRef.current = requestAnimationFrame(updateCursorPosition)
      }
    }

    const updateMousePosition = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY }
      // Start rAF loop only if not already running
      if (!animationIdRef.current) {
        animationIdRef.current = requestAnimationFrame(updateCursorPosition)
      }
    }

    // Track mouse movement
    window.addEventListener('mousemove', updateMousePosition)

    // Event delegation: listen at document level for dynamic elements
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)

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
