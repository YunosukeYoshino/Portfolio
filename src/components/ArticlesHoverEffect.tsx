'use client'

import gsap from 'gsap'
import { useCallback, useEffect, useRef, useState } from 'react'

export default function ArticlesHoverEffect() {
  const [hoveredImage, setHoveredImage] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const hoverRevealRef = useRef<HTMLDivElement>(null)
  const mousePosition = useRef({ x: 0, y: 0 })
  const revealPosition = useRef({ x: 0, y: 0 })
  const animationIdRef = useRef<number | undefined>(undefined)

  // Mouse move tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY }
    }

    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  // Animation loop (only runs when isAnimating is true)
  useEffect(() => {
    if (!isAnimating) return

    const updateHoverReveal = () => {
      if (!hoverRevealRef.current || !isAnimating) return

      revealPosition.current.x += (mousePosition.current.x - revealPosition.current.x) * 0.1
      revealPosition.current.y += (mousePosition.current.y - revealPosition.current.y) * 0.1

      const width = hoverRevealRef.current.offsetWidth
      const height = hoverRevealRef.current.offsetHeight

      gsap.set(hoverRevealRef.current, {
        x: revealPosition.current.x - width / 2,
        y: revealPosition.current.y - height / 2,
      })

      animationIdRef.current = requestAnimationFrame(updateHoverReveal)
    }

    updateHoverReveal()

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [isAnimating])

  const handleMouseEnter = useCallback((image: string) => {
    setHoveredImage(image)
    setIsAnimating(true)
    if (hoverRevealRef.current) {
      gsap.to(hoverRevealRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: 'power2.out',
      })
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsAnimating(false)
    if (hoverRevealRef.current) {
      gsap.to(hoverRevealRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        ease: 'power2.out',
      })
    }
  }, [])

  useEffect(() => {
    const handleArticleHover = (e: Event) => {
      const target = e.currentTarget as HTMLElement
      const image = target.getAttribute('data-image')
      if (image && e.type === 'mouseenter') {
        handleMouseEnter(image)
      } else if (e.type === 'mouseleave') {
        handleMouseLeave()
      }
    }

    const articleLinks = document.querySelectorAll('.article-link')
    articleLinks.forEach((link) => {
      link.addEventListener('mouseenter', handleArticleHover)
      link.addEventListener('mouseleave', handleArticleHover)
    })

    return () => {
      articleLinks.forEach((link) => {
        link.removeEventListener('mouseenter', handleArticleHover)
        link.removeEventListener('mouseleave', handleArticleHover)
      })
    }
  }, [handleMouseEnter, handleMouseLeave])

  return (
    <div
      ref={hoverRevealRef}
      className="fixed top-0 left-0 w-[300px] h-[200px] pointer-events-none z-30 opacity-0 hidden md:block overflow-hidden rounded-lg"
      style={{ willChange: 'transform' }}
    >
      {hoveredImage && (
        <div
          className="w-full h-full bg-cover bg-center transform scale-110 transition-transform duration-700"
          style={{ backgroundImage: `url(${hoveredImage})` }}
        />
      )}
    </div>
  )
}
