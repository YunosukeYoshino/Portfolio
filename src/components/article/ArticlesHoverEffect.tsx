'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type GSAPType = typeof import('gsap').default

export default function ArticlesHoverEffect() {
  const [hoveredImage, setHoveredImage] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [gsapLoaded, setGsapLoaded] = useState(false)
  const hoverRevealRef = useRef<HTMLDivElement>(null)
  const mousePosition = useRef({ x: 0, y: 0 })
  const revealPosition = useRef({ x: 0, y: 0 })
  const animationIdRef = useRef<number | undefined>(undefined)
  const gsapRef = useRef<GSAPType | null>(null)

  // Load GSAP dynamically
  useEffect(() => {
    let mounted = true

    const loadGsap = async () => {
      const gsapModule = await import('gsap')
      if (mounted) {
        gsapRef.current = gsapModule.default
        setGsapLoaded(true)
      }
    }

    loadGsap()

    return () => {
      mounted = false
    }
  }, [])

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

  // Animation loop (only runs when isAnimating is true and GSAP is loaded)
  useEffect(() => {
    if (!isAnimating || !gsapLoaded || !gsapRef.current) return

    const gsap = gsapRef.current

    // Cache dimensions once to avoid layout thrashing in rAF loop
    // The element has fixed CSS dimensions (w-[300px] h-[200px])
    const REVEAL_HALF_WIDTH = 150
    const REVEAL_HALF_HEIGHT = 84

    const updateHoverReveal = () => {
      if (!hoverRevealRef.current || !isAnimating) return

      revealPosition.current.x += (mousePosition.current.x - revealPosition.current.x) * 0.1
      revealPosition.current.y += (mousePosition.current.y - revealPosition.current.y) * 0.1

      gsap.set(hoverRevealRef.current, {
        x: revealPosition.current.x - REVEAL_HALF_WIDTH,
        y: revealPosition.current.y - REVEAL_HALF_HEIGHT,
      })

      animationIdRef.current = requestAnimationFrame(updateHoverReveal)
    }

    updateHoverReveal()

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [isAnimating, gsapLoaded])

  const handleMouseEnter = useCallback((image: string) => {
    // Snap the initial position to the current mouse position
    revealPosition.current = { ...mousePosition.current }

    setHoveredImage(image)
    setIsAnimating(true)
    if (hoverRevealRef.current && gsapRef.current) {
      // Kill any running animations to avoid conflicts
      gsapRef.current.killTweensOf(hoverRevealRef.current)

      // Instantly position it at the cursor before fading in
      gsapRef.current.set(hoverRevealRef.current, {
        x: mousePosition.current.x - 150,
        y: mousePosition.current.y - 84,
        scale: 0.8,
      })

      gsapRef.current.to(hoverRevealRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: 'power2.out',
      })
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsAnimating(false)
    if (hoverRevealRef.current && gsapRef.current) {
      gsapRef.current.killTweensOf(hoverRevealRef.current)
      gsapRef.current.to(hoverRevealRef.current, {
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

    const handleSectionLeave = () => {
      handleMouseLeave()
    }

    const handleScroll = () => {
      // Reset hover effect on scroll
      handleMouseLeave()
    }

    const articleLinks = document.querySelectorAll('.article-link')
    const articlesContainer = document.querySelector('.articles-container')

    // Preload images to ensure they show up immediately on first hover
    articleLinks.forEach((link) => {
      const image = link.getAttribute('data-image')
      if (image) {
        const img = new Image()
        img.src = image
      }
    })

    articleLinks.forEach((link) => {
      link.addEventListener('mouseenter', handleArticleHover)
      link.addEventListener('mouseleave', handleArticleHover)
    })

    // Add listener to the articles container to ensure hover effect resets when leaving the section
    if (articlesContainer) {
      articlesContainer.addEventListener('mouseleave', handleSectionLeave)
    }

    // Add scroll listener to reset hover effect when scrolling
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      articleLinks.forEach((link) => {
        link.removeEventListener('mouseenter', handleArticleHover)
        link.removeEventListener('mouseleave', handleArticleHover)
      })
      if (articlesContainer) {
        articlesContainer.removeEventListener('mouseleave', handleSectionLeave)
      }
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleMouseEnter, handleMouseLeave])

  // Don't render until GSAP is loaded
  if (!gsapLoaded) {
    return null
  }

  return (
    <div
      ref={hoverRevealRef}
      className="fixed top-0 left-0 w-[300px] aspect-video pointer-events-none z-30 opacity-0 hidden md:block overflow-hidden rounded-lg"
      style={{ willChange: 'transform' }}
    >
      <div
        className="w-full h-full bg-contain bg-center bg-no-repeat transform scale-110 transition-transform duration-700"
        style={{ backgroundImage: hoveredImage ? `url(${hoveredImage})` : 'none' }}
      />
    </div>
  )
}
