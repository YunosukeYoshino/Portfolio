'use client'

import { useEffect, useRef } from 'react'

export default function MainVisual() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    // Animation will be added later with GSAP
    const title = titleRef.current
    const subtitle = subtitleRef.current

    if (title && subtitle) {
      // Simple fade-in animation
      title.style.opacity = '0'
      subtitle.style.opacity = '0'
      title.style.transform = 'translateY(20px)'
      subtitle.style.transform = 'translateY(20px)'

      setTimeout(() => {
        title.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out'
        subtitle.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out'
        title.style.opacity = '1'
        title.style.transform = 'translateY(0)'

        setTimeout(() => {
          subtitle.style.opacity = '1'
          subtitle.style.transform = 'translateY(0)'
        }, 200)
      }, 300)
    }
  }, [])

  return (
    <section className="p-mainVisual relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="container-custom text-center z-10">
        <h1
          ref={titleRef}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6"
        >
          Yunosuke Yoshino
        </h1>
        <p
          ref={subtitleRef}
          className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
        >
          Frontend Developer & UI/UX Designer
          <br />
          Creating meaningful digital experiences
        </p>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-purple-400 rounded-full opacity-40 animate-pulse delay-300"></div>
      <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-pink-400 rounded-full opacity-50 animate-pulse delay-700"></div>
    </section>
  )
}
