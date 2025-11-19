'use client'

import gsap from 'gsap'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const articles = [
  {
    id: 1,
    title: 'SSGformとは？静的サイトフォームの最適解',
    date: '2025.08.19',
    category: 'Frontend',
    image:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop',
    link: '#',
  },
  {
    id: 2,
    title: 'Next.js 既存プロジェクトのTypeScript化ガイド',
    date: '2023.01.16',
    category: 'Engineering',
    image:
      'https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=2070&auto=format&fit=crop',
    link: '#',
  },
  {
    id: 3,
    title: 'WebGLとReactで作る没入型体験',
    date: '2022.11.05',
    category: 'WebGL',
    image:
      'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2070&auto=format&fit=crop',
    link: '#',
  },
]

export default function ArticlesSection() {
  const [hoveredImage, setHoveredImage] = useState<string | null>(null)
  const hoverRevealRef = useRef<HTMLDivElement>(null)
  const mousePosition = useRef({ x: 0, y: 0 })
  const revealPosition = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY }
    }

    const updateHoverReveal = () => {
      if (!hoverRevealRef.current) return

      revealPosition.current.x += (mousePosition.current.x - revealPosition.current.x) * 0.1
      revealPosition.current.y += (mousePosition.current.y - revealPosition.current.y) * 0.1

      const width = hoverRevealRef.current.offsetWidth
      const height = hoverRevealRef.current.offsetHeight

      gsap.set(hoverRevealRef.current, {
        x: revealPosition.current.x - width / 2,
        y: revealPosition.current.y - height / 2,
      })

      requestAnimationFrame(updateHoverReveal)
    }

    document.addEventListener('mousemove', handleMouseMove)
    updateHoverReveal()

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const handleMouseEnter = (image: string) => {
    setHoveredImage(image)
    if (hoverRevealRef.current) {
      gsap.to(hoverRevealRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: 'power2.out',
      })
    }
  }

  const handleMouseLeave = () => {
    if (hoverRevealRef.current) {
      gsap.to(hoverRevealRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        ease: 'power2.out',
      })
    }
  }

  return (
    <section id="articles" className="py-32 px-6 md:px-12 bg-[#111] text-white relative z-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-gray-500">
            03 / Insights
          </span>
        </div>

        {/* Hover Image Container */}
        <div
          ref={hoverRevealRef}
          className="fixed top-0 left-0 w-[300px] h-[200px] pointer-events-none z-30 opacity-0 hidden md:block overflow-hidden rounded-lg"
          style={{ willChange: 'transform' }}
        >
          {hoveredImage && (
            <div
              className="w-full h-full bg-cover bg-center transform scale-110 transition-transform duration-700"
              style={{ backgroundImage: `url(${hoveredImage})` }}
            />
          )}
        </div>

        <div className="space-y-px bg-gray-800">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={article.link as '/'}
              className="article-link group block bg-[#111] hover:bg-[#161616] transition-colors py-8 px-4 hover-trigger"
              onMouseEnter={() => handleMouseEnter(article.image)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                <div className="flex-1">
                  <h3 className="text-xl font-display font-medium mb-2 group-hover:text-gray-300 transition-colors">
                    {article.title}
                  </h3>
                  <div className="flex gap-3 text-xs font-mono text-gray-500">
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{article.category}</span>
                  </div>
                </div>
                <span className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
