'use client'

import { useEffect, useRef } from 'react'

export default function MainVisual() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const title = titleRef.current
    const subtitle = subtitleRef.current
    const description = descriptionRef.current

    if (title && subtitle && description) {
      // Advanced text reveal animation
      const elements = [title, subtitle, description]

      elements.forEach((el, index) => {
        el.style.opacity = '0'
        el.style.transform = 'translateY(100px)'

        setTimeout(
          () => {
            el.style.transition =
              'opacity 1.2s cubic-bezier(0.23, 1, 0.32, 1), transform 1.2s cubic-bezier(0.23, 1, 0.32, 1)'
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
          },
          300 + index * 200
        )
      })
    }
  }, [])

  return (
    <section className="p-mainVisual relative min-h-screen flex items-center justify-start overflow-hidden bg-black">
      <div className="container-custom z-10">
        <div className="max-w-4xl">
          <p
            ref={subtitleRef}
            className="text-sm md:text-base uppercase tracking-[0.2em] text-gray-400 mb-4 font-medium"
          >
            Portfolio 2024
          </p>

          <h1 ref={titleRef} className="text-display mb-8 text-white font-black tracking-tight">
            <span className="block text-6xl md:text-8xl lg:text-9xl leading-none uppercase">
              FRONTEND
            </span>
            <span className="block text-6xl md:text-8xl lg:text-9xl leading-none uppercase">
              DEVELOPER
            </span>
          </h1>

          <p
            ref={descriptionRef}
            className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed font-light uppercase tracking-wide"
          >
            YOU HAVE A PROJECT IDEA BUT YOU'RE LOST WITH ALL THE TECH STUFF? LET ME HANDLE IT AND
            MAKE IT HAPPEN!
          </p>

          <div className="mt-12 flex items-center space-x-8">
            <div className="h-px bg-gray-600 w-12"></div>
            <span className="text-xs uppercase tracking-[0.3em] text-gray-500">
              Scroll to explore
            </span>
          </div>
        </div>
      </div>

      {/* Minimalist overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5"></div>
      </div>
    </section>
  )
}
