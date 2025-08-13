import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'
import Footer from '@/components/Footer'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'Contact | Yunosuke Yoshino',
  description: 'Get in touch with Yunosuke Yoshino for collaborations, projects, or inquiries.',
}

export default function ContactPage() {
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
