import { ArrowUpRight } from 'lucide-react'
import { useEffect } from 'react'

const works = [
  {
    id: 2,
    title: 'YUNOSUKE Portfolio',
    category: 'Design / WebGL',
    image:
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=2555&auto=format&fit=crop',
    link: '#',
    offsetClass: 'md:pt-32',
  },
  {
    id: 4,
    title: 'Corporate Renewal',
    category: 'Frontend / Jamstack',
    image:
      'https://images.unsplash.com/photo-1621600411688-4be93cd68504?q=80&w=2680&auto=format&fit=crop',
    link: '#',
    offsetClass: 'md:pt-32',
  },
]

export default function WorksSection() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    let gsapContext: { revert: () => void } | undefined

    Promise.all([
      import('gsap').then((m) => m.default),
      import('gsap/ScrollTrigger').then((m) => m.default),
    ]).then(([gsap, ScrollTrigger]) => {
      gsap.registerPlugin(ScrollTrigger)

      gsapContext = gsap.context(() => {
        const images = gsap.utils.toArray('.parallax-image') as HTMLElement[]

        // Use matchMedia to only run parallax on screens larger than mobile
        // because mobile scrolling can be jerky with heavy parallax
        const mm = gsap.matchMedia()

        mm.add('(min-width: 768px)', () => {
          images.forEach((img) => {
            // Start the image shifted UP (-10%) so we can scroll it DOWN to (+10%)
            gsap.fromTo(
              img,
              { yPercent: -10 },
              {
                yPercent: 10,
                ease: 'none',
                force3D: true, // Force GPU layer creation so it repaints while scrolling
                scrollTrigger: {
                  trigger: img.parentElement, // Trigger off the image wrapper
                  start: 'top bottom', // Start when wrapper hits bottom of screen
                  end: 'bottom top', // End when wrapper hits top of screen
                  scrub: true, // Smooth scrubbing
                },
              }
            )
          })
        })
      })
    })

    return () => {
      if (gsapContext) gsapContext.revert()
    }
  }, [])

  return (
    <section id="works" className="relative z-20 bg-white px-4 py-32 md:px-12">
      <div className="mb-24 flex flex-col items-end justify-between border-b border-gray-100 px-2 pb-8 md:flex-row">
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

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-12 gap-y-24 md:grid-cols-2">
        {works.map((work) => (
          <article
            key={work.id}
            className={`work-item group cursor-pointer hover-trigger ${work.offsetClass}`}
          >
            <a href={work.link}>
              <div className="relative mb-6 aspect-video overflow-hidden bg-gray-100 shadow-sm transition-shadow duration-500 group-hover:shadow-lg rounded-sm">
                <div className="w-full h-full transform transition-transform duration-700 group-hover:scale-[1.03]">
                  <img
                    src={work.image}
                    alt=""
                    width={1200}
                    height={675}
                    loading="lazy"
                    className="parallax-image h-[120%] w-full object-cover grayscale transition-[filter] duration-700 group-hover:grayscale-0 block absolute top-[-10%] left-0"
                  />
                </div>
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5 pointer-events-none" />
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
        ))}
      </div>
    </section>
  )
}
