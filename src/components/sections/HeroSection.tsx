'use client'

import { ArrowDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

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
        const tl = gsap.timeline({ delay: 0.3 })

        tl.from('.hero-title-line', {
          y: 80,
          opacity: 0,
          duration: 1.2,
          ease: 'expo.out',
          stagger: 0.15,
        })
          .from(
            '.hero-subtitle',
            {
              y: 30,
              opacity: 0,
              duration: 0.8,
              ease: 'expo.out',
            },
            '-=0.6'
          )
          .from(
            '.hero-cta',
            {
              y: 20,
              opacity: 0,
              duration: 0.6,
              ease: 'expo.out',
              stagger: 0.1,
            },
            '-=0.4'
          )
          .from(
            '.hero-badge',
            {
              y: -20,
              opacity: 0,
              duration: 0.6,
              ease: 'expo.out',
            },
            '-=0.8'
          )
          .from(
            '.hero-bottom',
            {
              y: 20,
              opacity: 0,
              duration: 0.6,
              ease: 'expo.out',
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
      className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden"
    >
      <h1 className="sr-only">Yunosuke Yoshino Portfolio</h1>

      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
      >
        <source src="/images/hero-bg-loop.mp4" type="video/mp4" />
        <track kind="descriptions" src="" label="Hero background" />
      </video>

      {/* Soft overlay for text readability */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-black/10" />

      {/* Badge */}
      <div className="hero-badge absolute top-8 z-10 flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-1.5 backdrop-blur-sm md:top-12">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-white" />
        <span className="font-mono text-[10px] tracking-widest text-white/90 uppercase">
          Creative Developer Portfolio 2026
        </span>
      </div>

      {/* Center text */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <div className="overflow-hidden">
          <p className="hero-title-line" style={{ fontFamily: 'var(--font-serif)' }}>
            <span className="block text-4xl leading-none tracking-tight text-white italic md:text-7xl lg:text-8xl">
              Crafting Digital
            </span>
          </p>
        </div>
        <div className="overflow-hidden">
          <p className="hero-title-line" style={{ fontFamily: 'var(--font-serif)' }}>
            <span className="block text-4xl leading-none tracking-tight text-white italic md:text-7xl lg:text-8xl">
              Experiences
            </span>
          </p>
        </div>

        <p className="hero-subtitle mt-6 max-w-md font-mono text-xs leading-relaxed text-white/70 md:mt-8 md:text-sm">
          Motion, interactivity, and minimal aesthetics
          <br className="hidden md:block" />
          for immersive digital craft.
        </p>

        <div className="mt-8 flex items-center gap-6 md:mt-10">
          <a
            href="#works"
            className="hero-cta rounded-full border border-white/30 bg-white/15 px-6 py-2.5 font-mono text-xs tracking-wider text-white backdrop-blur-sm transition-colors hover:bg-white/25"
          >
            View Works
          </a>
          <a
            href="#about"
            className="hero-cta flex items-center gap-1.5 font-mono text-xs tracking-wider text-white/80 transition-colors hover:text-white"
          >
            About Me
            <ArrowDown className="h-3 w-3 rotate-[-90deg]" />
          </a>
        </div>
      </div>

      {/* Bottom info */}
      <div className="hero-bottom absolute bottom-8 left-6 right-6 z-10 flex items-end justify-between md:bottom-12 md:left-12 md:right-12">
        <span className="font-mono text-[10px] tracking-widest text-white/50 uppercase">
          Scroll to explore
        </span>
        <div className="animate-pulse">
          <ArrowDown className="h-4 w-4 text-white/50" />
        </div>
      </div>
    </section>
  )
}
