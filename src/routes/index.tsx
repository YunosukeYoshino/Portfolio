import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import NoiseOverlay from '@/components/effects/NoiseOverlay'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import AboutSection from '@/components/sections/AboutSection'
import ArticlesSection from '@/components/sections/ArticlesSection'
import HeroSection from '@/components/sections/HeroSection'
import SkillsMarquee from '@/components/sections/SkillsMarquee'
import WorksSection from '@/components/sections/WorksSection'
import JsonLd, {
  createBreadcrumbSchema,
  createPersonSchema,
  createWebsiteSchema,
} from '@/components/seo/JsonLd'
import { getBlogs } from '@/lib/microcms'

export const Route = createFileRoute('/')({
  loader: async () => {
    const { contents: articles } = await getBlogs({
      data: {
        queries: {
          limit: 3,
          orders: '-publishedAt',
        },
      },
    })
    return { articles }
  },
  // Prevent re-fetching on client-side navigation for static sites
  staleTime: Number.POSITIVE_INFINITY,
  head: () => ({
    meta: [
      { title: 'Yunosuke Yoshino｜Portfolio' },
      {
        property: 'og:title',
        content: 'Yunosuke Yoshino｜Portfolio',
      },
      { property: 'og:url', content: 'https://yunosukeyoshino.com/' },
      {
        property: 'og:image',
        content: 'https://yunosukeyoshino.com/assets/og-image.png',
      },
      { name: 'twitter:title', content: 'Yunosuke Yoshino｜Portfolio' },
      {
        name: 'twitter:description',
        content:
          'フロントエンドエンジニア Yunosuke Yoshinoのポートフォリオサイト。React, Next.js, TypeScriptを専門とし、ECサイトを中心としたモダンなWeb開発と技術記事を発信しています。',
      },
      {
        name: 'twitter:image',
        content: 'https://yunosukeyoshino.com/assets/og-image.png',
      },
    ],
    links: [{ rel: 'canonical', href: 'https://yunosukeyoshino.com/' }],
  }),
  component: HomePage,
})

/**
 * Section background color mapping for scroll-linked transitions.
 * Each entry defines the target background color when scrolling into
 * the corresponding section. The transition is driven by ScrollTrigger
 * scrub so the color blends smoothly over a short scroll distance.
 */
const SECTION_COLORS = [
  { selector: '[data-section="hero"]', color: 'transparent' },
  { selector: '[data-section="skills"]', color: '#f3f3f1' },
  { selector: '[data-section="about"]', color: '#f3f3f1' },
  { selector: '[data-section="works"]', color: '#ffffff' },
  { selector: '[data-section="articles"]', color: '#111111' },
] as const

function useScrollBackgroundTransitions(mainRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!mainRef.current) return

    let ctx: { revert: () => void } | undefined

    const initScrollColors = async () => {
      const gsap = (await import('gsap')).default
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const mainEl = mainRef.current
      if (!mainEl) return

      ctx = gsap.context(() => {
        for (const { selector, color } of SECTION_COLORS) {
          const trigger = mainEl.querySelector(selector)
          if (!trigger) continue

          gsap.to(mainEl, {
            backgroundColor: color,
            ease: 'none',
            scrollTrigger: {
              trigger,
              start: 'top 80%',
              end: 'top 20%',
              scrub: true,
            },
          })
        }
      }, mainEl)
    }

    initScrollColors()

    return () => {
      ctx?.revert()
    }
  }, [mainRef])
}

function HomePage() {
  const { articles } = Route.useLoaderData()
  const mainRef = useRef<HTMLElement>(null)

  useScrollBackgroundTransitions(mainRef)

  const personSchema = createPersonSchema()
  const websiteSchema = createWebsiteSchema()
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'ホーム', url: 'https://yunosukeyoshino.com/' },
  ])

  return (
    <>
      <JsonLd data={personSchema} />
      <JsonLd data={websiteSchema} />
      <JsonLd data={breadcrumbSchema} />
      <NoiseOverlay />
      <Header />
      <main ref={mainRef}>
        <div data-section="hero">
          <HeroSection />
        </div>
        <div data-section="skills">
          <SkillsMarquee />
        </div>
        <div data-section="about">
          <AboutSection />
        </div>
        <div data-section="works">
          <WorksSection />
        </div>
        <div data-section="articles">
          <ArticlesSection articles={articles} />
        </div>
      </main>
      <Footer />
    </>
  )
}
