'use client'

import { ArrowDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import WebGLBackground from './WebGLBackground'

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Track mount state to ensure client-side only animations
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // Skip on server-side or before mount
    if (typeof window === 'undefined' || !isMounted) return

    let ctx: { revert: () => void } | undefined

    const initAnimation = async () => {
      const gsap = (await import('gsap')).default

      ctx = gsap.context(() => {
        const tl = gsap.timeline()

        // Simplified and faster animations
        tl.to(
          '.fade-in-anim',
          {
            opacity: 1,
            duration: 0.6, // Reduced from 1
            stagger: 0.08, // Reduced from 0.1
          },
          '-=0.3' // Overlap more for faster overall animation
        )
      }, heroRef)
    }

    initAnimation()

    return () => ctx?.revert()
  }, [isMounted])

  return (
    <section
      ref={heroRef}
      className="relative flex h-screen w-full flex-col justify-center overflow-hidden"
    >
      <WebGLBackground />

      <div className="hero-text-layer relative w-full px-6 pt-20 md:px-12">
        <div className="mb-4 flex max-w-[200px] items-end justify-between border-b border-black/10 pb-4 md:mb-8 md:max-w-xs">
          <span className="font-mono text-xs text-gray-400">PORTFOLIO 2026</span>
          <span className="font-mono text-xs text-gray-400">V.2.0</span>
        </div>

        <div className="absolute bottom-[-15vh] left-6 right-6 flex items-end justify-between mix-blend-multiply md:bottom-[-20vh] md:left-12 md:right-12">
          <div className="max-w-sm">
            <p className="fade-in-anim font-mono text-xs leading-relaxed text-gray-600 opacity-0 md:text-sm">
              Crafting immersive digital experiences with a focus on motion, interactivity, and
              minimal aesthetics.
            </p>
          </div>
          <div className="fade-in-anim animate-pulse opacity-0">
            <ArrowDown className="h-5 w-5 text-black/50" />
          </div>
        </div>
      </div>
    </section>
  )
}
