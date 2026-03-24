'use client'

import { useEffect, useRef } from 'react'

export default function SkillsMarquee() {
  const containerRef = useRef<HTMLDivElement>(null)

  const skills = [
    { text: 'UI/UX Design', highlight: false, id: 'sk-1' },
    { text: 'Creative Development', highlight: true, id: 'sk-2' },
    { text: 'WebGL', highlight: false, id: 'sk-3' },
    { text: 'React / Next.js', highlight: true, id: 'sk-4' },
    { text: 'Interaction Design', highlight: false, id: 'sk-5' },
  ]

  useEffect(() => {
    if (typeof window === 'undefined') return

    let gsapContext: { revert: () => void } | undefined

    Promise.all([
      import('gsap').then((m) => m.default),
      import('gsap/ScrollTrigger').then((m) => m.default),
    ]).then(([gsap, ScrollTrigger]) => {
      gsap.registerPlugin(ScrollTrigger)

      gsapContext = gsap.context(() => {
        const content = containerRef.current?.querySelector('.marquee-content') as HTMLElement
        if (!content) return

        let direction = -1

        const contentWidth = content.offsetWidth / 2 // since we double the items

        gsap.set(content, { x: 0 })

        const mod = gsap.utils.wrap(0, -contentWidth)

        let previousScrollTop = 0
        let speed = 1

        const updateMarquee = () => {
          const currentScrollTop = window.scrollY
          const delta = currentScrollTop - previousScrollTop

          if (delta > 0) direction = -1
          else if (delta < 0) direction = 1

          const velocity = Math.abs(delta)
          // Boost speed briefly based on scroll velocity
          const targetSpeed = 1 + velocity * 0.1
          speed += (targetSpeed - speed) * 0.1 // ease into speed

          if (speed > 1) {
            speed *= 0.9 // decay
          }
          if (speed < 1) speed = 1

          // Current x
          const currentX = parseFloat(gsap.getProperty(content, 'x') as string) || 0
          const newX = currentX + direction * speed * 2

          gsap.set(content, { x: mod(newX) })

          previousScrollTop = currentScrollTop
          requestAnimationFrame(updateMarquee)
        }

        requestAnimationFrame(updateMarquee)
      }, containerRef)
    })

    return () => {
      if (gsapContext) gsapContext.revert()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="py-16 border-t border-b border-gray-200 bg-white relative z-20 mt-20 overflow-hidden"
    >
      <div className="font-display text-4xl md:text-6xl font-medium text-gray-300/50 whitespace-nowrap flex w-max">
        <div className="marquee-content flex gap-12 pl-12">
          {/* Double up the array to make it seamless */}
          {skills
            .concat(skills, skills, skills)
            .map((skill, index) => ({ ...skill, uniqueId: `${skill.id}-${index}` }))
            .map((skill) => (
              <span
                key={skill.uniqueId}
                className={`inline-block ${skill.highlight ? 'text-black' : ''}`}
              >
                {skill.text}
              </span>
            ))}
        </div>
      </div>
    </div>
  )
}
