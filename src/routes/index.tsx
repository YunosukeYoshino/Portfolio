import { createFileRoute } from '@tanstack/react-router'
import AboutSection from '@/components/AboutSection'
import ArticlesSection from '@/components/ArticlesSection'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import JsonLd, {
  createBreadcrumbSchema,
  createPersonSchema,
  createWebsiteSchema,
} from '@/components/JsonLd'
import NoiseOverlay from '@/components/NoiseOverlay'
import SkillsMarquee from '@/components/SkillsMarquee'
import WorksSection from '@/components/WorksSection'
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
    ],
  }),
  component: HomePage,
})

function HomePage() {
  const { articles } = Route.useLoaderData()

  const personSchema = createPersonSchema()
  const websiteSchema = createWebsiteSchema()
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'ホーム', url: 'https://yunosukeyoshino.com' },
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
