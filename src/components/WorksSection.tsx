import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const works = [
  {
    id: 1,
    title: 'YUNOSUKE Portfolio',
    category: 'Design / WebGL',
    image:
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=2555&auto=format&fit=crop',
    link: '#',
    offsetClass: '',
  },
]

export default function WorksSection() {
  return (
    <section id="works" className="py-32 px-4 md:px-12 bg-white relative z-20">
      <div className="flex flex-col md:flex-row justify-between items-end mb-24 px-2 border-b border-gray-100 pb-8">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-gray-500 block mb-2">
            02 / Selected Works
          </span>
          <h2 className="text-6xl md:text-8xl font-display font-medium tracking-tighter">
            Projects
          </h2>
        </div>
        <span className="font-mono text-xs text-gray-400 mb-2">(2023 — 2025)</span>
      </div>

      <div className="grid grid-cols-1 gap-y-24 max-w-screen-xl mx-auto">
        {works.map((work) => (
          <article
            key={work.id}
            className={`work-item group cursor-pointer hover-trigger ${work.offsetClass}`}
          >
            <Link href={work.link as '/'}>
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 mb-6">
                <Image
                  src={work.image}
                  alt={work.title}
                  fill
                  loading="lazy"
                  className="work-img object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-display font-medium mb-1">{work.title}</h3>
                  <p className="font-mono text-xs text-gray-400">{work.category}</p>
                </div>
                <div className="w-8 h-8 border border-gray-200 rounded-full flex items-center justify-center group-hover:bg-black group-hover:border-black group-hover:text-white transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
