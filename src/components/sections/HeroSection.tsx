'use client'

import { ArrowDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import WebGLBackground from '@/components/effects/WebGLBackground'

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !isMounted) return

    let ctx: { revert: () => void } | undefined

    const initAnimation = async () => {
      const gsap = (await import('gsap')).default

      ctx = gsap.context(() => {
        const tl = gsap.timeline({ delay: 0.5 })

        tl.from('.hero-name', {
          y: 60,
          opacity: 0,
          duration: 1.4,
          ease: 'expo.out',
        })
          .from(
            '.hero-tagline',
            {
              y: 40,
              opacity: 0,
              duration: 1.0,
              ease: 'expo.out',
            },
            '-=0.8'
          )
          .from(
            '.hero-bottom',
            {
              opacity: 0,
              duration: 0.8,
              ease: 'power2.out',
            },
            '-=0.4'
          )
      }, heroRef)
    }

    initAnimation()

    return () => ctx?.revert()
  }, [isMounted])

  return (
    <section
      ref={heroRef}
      className="relative flex h-screen min-h-screen w-full flex-col items-center justify-center overflow-hidden supports-[height:100svh]:h-[100svh] supports-[min-height:100svh]:min-h-[100svh]"
    >
      <h1 className="sr-only">Yunosuke Yoshino Portfolio</h1>

      <WebGLBackground />

      {/* Center text */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <div className="overflow-hidden">
          <p
            className="hero-name text-4xl leading-[1.1] tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] md:text-7xl lg:text-8xl"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Catcher in the <span className="italic">Internet</span>
          </p>
        </div>

        <p className="hero-tagline mt-6 font-mono text-[11px] tracking-[0.2em] text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)] uppercase md:mt-8 md:text-xs">
          Yunosuke Yoshino — Creative Developer
        </p>
      </div>

      {/* Bottom scroll indicator */}
      <div className="hero-bottom absolute bottom-[calc(env(safe-area-inset-bottom)+3rem)] left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2 md:bottom-12">
        <span className="font-mono text-[9px] tracking-[0.3em] text-white/40 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] uppercase">
          Scroll
        </span>
        <ArrowDown className="h-3.5 w-3.5 animate-pulse text-white/40" />
      </div>
    </section>
  )
}
