import { Suspense } from 'react'
import About from '@/components/About'
import Blog from '@/components/Blog'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import MainVisual from '@/components/MainVisual'

function BlogSection() {
  return (
    <section className="p-mainArticleList py-16 md:py-24" id="article">
      <div className="container-custom">
        <header className="text-center mb-12">
          <h2 className="p-sectionUpperText text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Article
          </h2>
        </header>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg aspect-[4/3] animate-pulse" />
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
    <section className="p-contactArea py-16 md:py-24 bg-gray-50" id="contact">
      <div className="container-custom text-center">
        <header className="mb-12">
          <h2 className="p-sectionUpperText text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Contact
          </h2>
        </header>
        <div className="max-w-2xl mx-auto">
          <p className="text-gray-600 mb-8 leading-relaxed">
            お仕事のご依頼、ご相談がございましたら、 お気軽にお問い合わせください。
          </p>
          <a
            className="p-contactArea__mailLink inline-block group"
            href="mailto:yunosukeyoshino@gmail.com"
          >
            <span className="p-contactArea__mail block text-2xl md:text-3xl font-medium text-blue-600 group-hover:text-blue-800 transition-colors mb-2">
              yunosukeyoshino@gmail.com
            </span>
            <span
              className="text-sm text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-hidden="true"
            >
              Click to send email
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
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
