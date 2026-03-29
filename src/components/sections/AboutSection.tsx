import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useEffect, useRef } from 'react'
import MagneticButton from '@/components/effects/MagneticButton'
import SplitText from '@/components/effects/SplitText'

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    let gsapContext: { revert: () => void } | undefined

    Promise.all([
      import('gsap').then((m) => m.default),
      import('gsap/ScrollTrigger').then((m) => m.default),
    ]).then(([gsap, ScrollTrigger]) => {
      gsap.registerPlugin(ScrollTrigger)

      gsapContext = gsap.context(() => {
        const mm = gsap.matchMedia()

        // Desktop parallax: heading moves slower than body to create depth
        mm.add('(min-width: 768px)', () => {
          // Section fade-in with subtle scale as it enters the viewport
          gsap.fromTo(
            '.about-section-inner',
            { opacity: 0, scale: 0.97 },
            {
              opacity: 1,
              scale: 1,
              duration: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 90%',
                end: 'top 50%',
                scrub: true,
              },
            }
          )

          // Label layer: slowest movement for depth hierarchy
          gsap.fromTo(
            '.about-label',
            { yPercent: 20 },
            {
              yPercent: -10,
              ease: 'none',
              force3D: true,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          )

          // Heading layer: moves slower than body for parallax depth
          gsap.fromTo(
            '.about-heading',
            { yPercent: 15 },
            {
              yPercent: -8,
              ease: 'none',
              force3D: true,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          )

          // Body content: moves faster to contrast with heading
          gsap.fromTo(
            '.about-body',
            { yPercent: 25 },
            {
              yPercent: -15,
              ease: 'none',
              force3D: true,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          )

          // CTA link: fastest layer, greatest travel distance
          gsap.fromTo(
            '.about-cta',
            { yPercent: 35 },
            {
              yPercent: -20,
              ease: 'none',
              force3D: true,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          )
        })

        // Mobile: reduced parallax for smoother scrolling on touch devices
        mm.add('(max-width: 767px)', () => {
          gsap.fromTo(
            '.about-section-inner',
            { opacity: 0 },
            {
              opacity: 1,
              duration: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 95%',
                end: 'top 70%',
                scrub: true,
              },
            }
          )

          // Subtle heading parallax only on mobile
          gsap.fromTo(
            '.about-heading',
            { yPercent: 8 },
            {
              yPercent: -4,
              ease: 'none',
              force3D: true,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          )
        })
      }, sectionRef)
    })

    return () => {
      if (gsapContext) gsapContext.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-32 px-6 md:px-12 bg-[#F3F3F1] relative z-20 overflow-hidden"
    >
      <div className="about-section-inner max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16">
        <div className="about-label md:col-span-3 will-change-transform">
          <span className="text-xs font-mono uppercase tracking-widest border-b border-black/20 pb-2 inline-block text-gray-500">
            01 / Profile
          </span>
        </div>

        <div className="md:col-span-9">
          <div className="about-heading will-change-transform">
            <SplitText
              as="h2"
              className="text-3xl md:text-5xl font-display font-medium leading-[1.2] mb-16"
            >
              I am Yunosuke Yoshino, a multidisciplinary creator. I build digital products that
              blend technical precision with visual elegance.
            </SplitText>
          </div>

          <div className="about-body will-change-transform">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-base leading-[1.8] text-gray-600 font-mono">
              <div className="space-y-6">
                <p>
                  1995年生まれ、広島出身。アパレル販売の現場からウェブ開発の世界へと転身し、現在は東京を拠点に活動しています。
                  ECサイトを中心としたフロントエンド開発に特化し、データ分析に基づく継続的な改善提案を行っています。
                </p>
              </div>
              <div className="space-y-6">
                <p>
                  ReactやNext.jsといったモダンなフレームワークを活用し、保守性と拡張性を重視したコードを書くことを大切にしています。
                  業務の傍ら、AIエージェント構築やDify、n8nを活用した業務自動化など、新しい技術の研究と実装にも取り組み、常に学び続けることで、より良いユーザー体験の実現を目指しています。
                </p>
              </div>
            </div>
          </div>

          <div className="about-cta mt-16 will-change-transform">
            <MagneticButton>
              <Link
                to="/about/"
                className="group inline-flex items-center gap-3 text-sm font-bold uppercase tracking-wide hover-trigger"
              >
                <span className="border-b border-black pb-1 group-hover:border-blue-600 group-hover:text-blue-600 transition-colors">
                  Read Full Story
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform group-hover:text-blue-600" />
              </Link>
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  )
}
