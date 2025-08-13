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
      <main className="min-h-screen bg-white pt-24">
        <div className="container-custom py-20">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-4">
              CONTACT
            </h1>
            <p className="text-lg text-gray-600 mb-12">
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
