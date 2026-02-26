import { createFileRoute } from '@tanstack/react-router'
import ContactForm from '@/components/forms/ContactForm'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'

export const Route = createFileRoute('/contact')({
  head: () => ({
    meta: [
      { title: 'Contact | Yunosuke Yoshino' },
      {
        name: 'description',
        content: 'Get in touch with Yunosuke Yoshino for collaborations, projects, or inquiries.',
      },
      { property: 'og:title', content: 'Contact | Yunosuke Yoshino' },
      { property: 'og:url', content: 'https://yunosukeyoshino.com/contact/' },
      {
        property: 'og:image',
        content: 'https://yunosukeyoshino.com/assets/og-image.png',
      },
      { name: 'twitter:title', content: 'Contact | Yunosuke Yoshino' },
      {
        name: 'twitter:description',
        content: 'Get in touch with Yunosuke Yoshino for collaborations, projects, or inquiries.',
      },
      {
        name: 'twitter:image',
        content: 'https://yunosukeyoshino.com/assets/og-image.png',
      },
    ],
    links: [{ rel: 'canonical', href: 'https://yunosukeyoshino.com/contact/' }],
  }),
  component: ContactPage,
})

function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white py-24 md:py-40">
        <div className="container-custom">
          <div className="mx-auto max-w-2xl">
            <h1 className="mb-4 text-4xl font-bold uppercase tracking-tighter md:text-6xl">
              CONTACT
            </h1>
            <p className="mb-12 text-lg text-gray-600">
              お仕事のご依頼、ご相談などお気軽にお問い合わせください。
            </p>

            <ContactForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
