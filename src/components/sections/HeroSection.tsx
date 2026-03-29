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
        <source src="/images/hero-loop.mp4" type="video/mp4" />
        <track kind="descriptions" src="" label="Hero background" />
      </video>

      {/* Center text */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <div className="overflow-hidden">
          <p
            className="hero-name text-4xl leading-[1.1] tracking-tight text-white md:text-7xl lg:text-8xl"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            <span className="italic">Servitude</span> is Freedom
          </p>
        </div>

        <p className="hero-tagline mt-6 font-mono text-[11px] tracking-[0.2em] text-white/60 uppercase md:mt-8 md:text-xs">
          Yunosuke Yoshino — Creative Developer
        </p>
      </div>

      {/* Bottom scroll indicator */}
      <div className="hero-bottom absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2 md:bottom-12">
        <span className="font-mono text-[9px] tracking-[0.3em] text-white/40 uppercase">
          Scroll
        </span>
        <ArrowDown className="h-3.5 w-3.5 animate-pulse text-white/40" />
      </div>
    </section>
  )
}
