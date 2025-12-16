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

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
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
        <ArticlesSection />
      </main>
      <Footer />
    </>
  )
}
