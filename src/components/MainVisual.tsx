'use client'

import { Suspense, useEffect, useRef } from 'react'
import ThreeScene from './ThreeScene'

export default function MainVisual() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const title = titleRef.current
    const subtitle = subtitleRef.current
    const description = descriptionRef.current

    if (title && subtitle && description) {
      // Advanced text reveal animation with extended timing for 3D scene loading
      const elements = [title, subtitle, description]

      elements.forEach((el, index) => {
        el.style.opacity = '0'
        el.style.transform = 'translateY(100px)'

        setTimeout(
          () => {
            el.style.transition =
              'opacity 1.5s cubic-bezier(0.23, 1, 0.32, 1), transform 1.5s cubic-bezier(0.23, 1, 0.32, 1)'
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
          },
          800 + index * 300 // Extended delay for dramatic effect with 3D scene
        )
      })
    }
  }, [])

  return (
    <section className="p-mainVisual relative flex min-h-screen items-center justify-start overflow-hidden bg-black">
      {/* Revolutionary 3D Background Scene */}
      <div className="absolute inset-0 z-0">
        <Suspense
          fallback={
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-pulse font-mono text-lg text-white/20">
                  LOADING EXPERIENCE...
                </div>
              </div>
            </div>
          }
        >
          <ThreeScene className="absolute inset-0 h-full w-full" />
        </Suspense>
      </div>

      {/* Content Overlay with Enhanced Backdrop */}
      <div className="relative z-10 w-full">
        {/* Cinematic backdrop for text readability */}
        <div className="absolute inset-0"></div>

        <div className="container-custom relative z-10">
          <div className="max-w-4xl">
            <p
              ref={subtitleRef}
              className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-orange-400 drop-shadow-lg md:text-base"
            >
              Creative Portfolio {new Date().getFullYear()}
            </p>

            <h1
              ref={titleRef}
              className="text-display mb-8 font-black tracking-tight text-white drop-shadow-2xl"
            >
              <span className="block bg-gradient-to-r from-white via-orange-100 to-orange-200 bg-clip-text text-6xl uppercase leading-none text-transparent md:text-8xl lg:text-9xl">
                YUNOSUKE YOSHINO
              </span>
            </h1>
            <h2 className="text-display mb-8 font-black tracking-tight text-white drop-shadow-2xl">
              <span className="block bg-gradient-to-r from-orange-200 via-orange-300 to-white bg-clip-text text-6xl uppercase leading-none text-transparent md:text-8xl lg:text-8xl">
                PORTFOLIO
              </span>
            </h2>
            <p
              ref={descriptionRef}
              className="max-w-2xl text-lg font-light uppercase leading-relaxed tracking-wide text-gray-200 drop-shadow-lg md:text-xl"
            >
              CRAFTING MODERN WEB EXPERIENCES
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
