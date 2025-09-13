import Link from 'next/link'
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
    <section className="bg-white py-24 md:py-32" id="article">
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
              {[
                'skeleton-1',
                'skeleton-2',
                'skeleton-3',
                'skeleton-4',
                'skeleton-5',
                'skeleton-6',
              ].map((skeletonId) => (
                <div
                  key={skeletonId}
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
    <section className="border-t border-black/10 bg-gray-50 py-24 md:py-32" id="contact">
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

            <Link
              href="/contact"
              className="group relative inline-flex items-center justify-center px-8 py-4 bg-black text-white font-bold uppercase tracking-wider border-2 border-black overflow-hidden transition-all duration-500 hover:bg-black hover:text-white hover:scale-105 hover:shadow-2xl"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span>CONTACT</span>
                <svg
                  className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
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
      <main>
        <MainVisual />
        <About />
        <BlogSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
