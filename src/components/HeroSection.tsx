'use client'

import gsap from 'gsap'
import { ArrowDown } from 'lucide-react'
import { useEffect, useRef } from 'react'
import WebGLBackground from './WebGLBackground'

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      tl.to('.reveal-anim', {
        y: 0,
        opacity: 1,
        duration: 1.4,
        stagger: 0.1,
        ease: 'power4.out',
        delay: 0.2,
      }).to(
        '.fade-in-anim',
        {
          opacity: 1,
          duration: 1,
          stagger: 0.1,
        },
        '-=0.5'
      )
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative h-screen w-full flex flex-col justify-center overflow-hidden"
    >
      <WebGLBackground />

      <div className="hero-text-layer w-full px-6 md:px-12 pt-20 relative">
        <div className="flex justify-between items-end mb-4 md:mb-8 border-b border-black/10 pb-4 max-w-[200px] md:max-w-xs">
          <span className="font-mono text-xs text-gray-400">PORTFOLIO 2025</span>
          <span className="font-mono text-xs text-gray-400">V.2.0</span>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <h1 className="text-[15vw] md:text-[13vw] leading-[0.8] font-display font-semibold tracking-tighter reveal-anim opacity-0 text-[#111]">
              Frontend
            </h1>
          </div>
          <div className="overflow-hidden pl-[5vw] md:pl-[10vw]">
            <h1 className="text-[15vw] md:text-[13vw] leading-[0.8] font-display font-semibold tracking-tighter reveal-anim opacity-0 text-[#111] italic">
              Developer
            </h1>
          </div>
          <div className="overflow-hidden text-right pr-4">
            <h1 className="text-[6vw] leading-[1.1] font-display font-normal tracking-tight reveal-anim opacity-0 text-gray-400 mt-4">
              & Visual Designer
            </h1>
          </div>
        </div>

        <div className="absolute bottom-[-15vh] md:bottom-[-20vh] left-6 md:left-12 right-6 md:right-12 flex justify-between items-end mix-blend-multiply">
          <div className="max-w-sm">
            <p className="font-mono text-xs md:text-sm leading-relaxed text-gray-600 fade-in-anim opacity-0">
              Crafting immersive digital experiences with a focus on motion, interactivity, and
              minimal aesthetics.
            </p>
          </div>
          <div className="fade-in-anim opacity-0 animate-pulse">
            <ArrowDown className="w-5 h-5 text-black/50" />
          </div>
        </div>
      </div>
    </section>
  )
}
