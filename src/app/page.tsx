import { Suspense } from 'react'
import About from '@/components/About'
import Blog from '@/components/Blog'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import JsonLd, {
  createBreadcrumbSchema,
  createPersonSchema,
  createWebsiteSchema,
} from '@/components/JsonLd'
import MainVisual from '@/components/MainVisual'

function BlogSection() {
  return (
    <section className="p-mainArticleList bg-white py-24 md:py-32" id="article">
      <div className="container-custom">
        <div className="mb-16 flex items-end justify-between">
          <header>
            <h2 className="text-section-title text-display mb-6 uppercase tracking-tight text-black">
              ARTICLES
            </h2>
            <p className="max-w-2xl text-lg text-gray-600">
              Technical articles and insights about frontend development, UI/UX design, and modern
              web technologies.
            </p>
          </header>
        </div>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={`skeleton-article-${i}`}
                  className="aspect-[4/3] animate-pulse rounded-lg bg-gray-200"
                />
              ))}
            </div>
          }
        >
          <Blog limit={6} column={2} />
        </Suspense>
      </div>
    </section>
  )
}

function ContactSection() {
  return (
    <section
      className="p-contactArea border-t border-black/10 bg-gray-50 py-24 md:py-32"
      id="contact"
    >
      <div className="container-custom">
        <header className="mb-16">
          <h2 className="text-section-title text-display mb-6 uppercase tracking-tight text-black">
            Let's Work Together
          </h2>
          <p className="max-w-2xl text-lg text-gray-600">
            Ready to bring your digital vision to life? Let's collaborate and create something
            extraordinary.
          </p>
        </header>

        <div className="grid items-center gap-16 md:grid-cols-2">
          <div>
            <p className="mb-8 text-lg leading-relaxed text-gray-700">
              お仕事のご依頼、ご相談がございましたら、お気軽にお問い合わせください。
              <br />
              <br />
              Available for freelance projects, collaborations, and full-time opportunities.
            </p>

            <a
              className="p-contactArea__mailLink group inline-block"
              href="mailto:yunosukeyoshino@gmail.com"
            >
              <span className="p-contactArea__mail mb-2 block text-2xl font-light text-black transition-colors duration-300 group-hover:text-gray-700 md:text-3xl">
                yunosukeyoshino@gmail.com
              </span>
              <span
                className="text-sm uppercase tracking-wider text-gray-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden="true"
              >
                Click to send email
              </span>
            </a>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="h-2 w-2 rounded-full bg-black"></div>
              <span className="text-sm uppercase tracking-wider text-gray-600">
                Currently based in Japan
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-2 w-2 rounded-full bg-black"></div>
              <span className="text-sm uppercase tracking-wider text-gray-600">
                Available for remote work
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-2 w-2 rounded-full bg-black"></div>
              <span className="text-sm uppercase tracking-wider text-gray-600">
                Response within 24 hours
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
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
      <Header />
      <main className="l-main">
        <MainVisual />
        <About />
        <BlogSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
