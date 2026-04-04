import { ArrowUpRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { getExternalLinkProps } from '@/lib/link'

const works = [
  {
    id: 1,
    title: 'YUNOSUKE Portfolio',
    category: 'Design / WebGL',
    image:
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=2555&auto=format&fit=crop',
    alt: 'YUNOSUKE Portfolio - WebGL and motion design portfolio site',
    link: '#',
  },
  {
    id: 2,
    title: 'Corporate Renewal',
    category: 'Frontend / Jamstack',
    image:
      'https://images.unsplash.com/photo-1621600411688-4be93cd68504?q=80&w=2680&auto=format&fit=crop',
    alt: 'Corporate Renewal - Jamstack corporate site renewal',
    link: '#',
  },
  {
    id: 3,
    title: 'E-Commerce Platform',
    category: 'React / Next.js',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop',
    alt: 'E-Commerce Platform - Headless commerce with modern frontend',
    link: '#',
  },
  {
    id: 4,
    title: 'Nanatau',
    category: 'Blog / Content',
    image: '/images/projects/nanatau-home-card.png',
    alt: 'Nanatau blog homepage',
    link: 'https://blog.nanatau.com',
  },
]

export default function WorksSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !isMounted) return

    let ctx: { revert: () => void } | undefined

    const initAnimation = async () => {
      const gsap = (await import('gsap')).default
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        const mm = gsap.matchMedia()

        // Desktop: horizontal scroll gallery pinned to viewport
        mm.add('(min-width: 768px)', () => {
          const track = trackRef.current
          if (!track) return

          const getDesktopEndGap = () => {
            return Math.min(Math.max(window.innerWidth * 0.115, 116), 184)
          }

          // Stop with intentional breathing room after the last card instead of
          // aligning the whole track flush to the viewport edge.
          const getScrollAmount = () => {
            const cards = track.querySelectorAll<HTMLElement>('.works-card')
            const lastCard = cards[cards.length - 1]
            if (!lastCard) return 0

            const availableRightEdge = window.innerWidth - getDesktopEndGap()
            const lastCardRightEdge = lastCard.offsetLeft + lastCard.offsetWidth

            return Math.min(0, availableRightEdge - lastCardRightEdge)
          }

          gsap.to(track, {
            x: getScrollAmount,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: () => `+=${Math.abs(getScrollAmount())}`,
              pin: true,
              scrub: true,
              invalidateOnRefresh: true,
            },
          })
        })

        // Mobile: simple vertical reveal for each card
        mm.add('(max-width: 767px)', () => {
          const cards = gsap.utils.toArray<HTMLElement>('.works-card')

          for (const card of cards) {
            gsap.from(card, {
              y: 60,
              opacity: 0,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            })
          }
        })
      }, sectionRef)
    }

    initAnimation()

    return () => {
      ctx?.revert()
    }
  }, [isMounted])

  return (
    <section ref={sectionRef} id="works" className="relative z-20 overflow-hidden bg-white">
      {/* Section header -- always visible above the gallery */}
      <div className="px-4 pt-32 pb-16 md:px-12 md:pt-32 md:pb-0">
        <div className="flex flex-col items-end justify-between border-b border-gray-100 px-2 pb-8 md:flex-row">
          <div>
            <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-gray-500">
              02 / Selected Works
            </span>
            <h2 className="font-display text-6xl font-medium tracking-tighter md:text-8xl">
              Projects
            </h2>
          </div>
          <span className="mb-2 font-mono text-xs text-gray-400">(2023 — 2025)</span>
        </div>
      </div>

      {/* --- Mobile: vertical card stack --- */}
      <div className="flex flex-col gap-16 px-4 pb-32 md:hidden">
        {works.map((work) => (
          <WorkCard key={work.id} work={work} />
        ))}
      </div>

      {/* --- Desktop: horizontal scroll track --- */}
      <div className="hidden md:block">
        <div
          ref={trackRef}
          className="flex items-center gap-8 px-12 py-16"
          style={{ willChange: 'transform' }}
        >
          {works.map((work, index) => (
            <div
              key={work.id}
              className={`works-card flex-shrink-0 ${index % 2 === 1 ? 'mt-24' : ''}`}
              style={{ width: 'clamp(500px, 40vw, 700px)' }}
            >
              <WorkCard work={work} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// -- WorkCard -----------------------------------------------------------------

interface Work {
  readonly id: number
  readonly title: string
  readonly category: string
  readonly image: string
  readonly alt: string
  readonly link: string
}

function WorkCard({ work }: { readonly work: Work }) {
  return (
    <article className="group cursor-pointer hover-trigger">
      <a href={work.link} {...getExternalLinkProps(work.link)}>
        <div className="relative mb-6 aspect-video overflow-hidden rounded-sm bg-gray-100 shadow-sm transition-shadow duration-500 group-hover:shadow-lg">
          <div className="h-full w-full transform transition-transform duration-700 group-hover:scale-[1.03]">
            <img
              src={work.image}
              alt={work.alt}
              width={1200}
              height={675}
              loading="lazy"
              className="absolute inset-0 block h-full w-full object-cover object-center grayscale transition-[filter] duration-700 group-hover:grayscale-0"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5" />
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display mb-1 text-2xl font-medium">{work.title}</h3>
            <p className="font-mono text-xs font-semibold text-gray-500">{work.category}</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 transition-all group-hover:border-black group-hover:bg-black group-hover:text-white">
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </div>
        </div>
      </a>
    </article>
  )
}
