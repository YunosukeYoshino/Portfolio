import { createFileRoute } from '@tanstack/react-router'
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

function HomePage() {
  const { articles } = Route.useLoaderData()

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
      <main>
        <HeroSection />
        <SkillsMarquee />
        <AboutSection />
        <WorksSection />
        <ArticlesSection articles={articles} />
      </main>
      <Footer />
    </>
  )
}
