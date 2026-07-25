import { createFileRoute } from '@tanstack/react-router'
import ContactForm from '@/components/forms/ContactForm'
import SitePage from '@/components/layout/SitePage'
import { createStandardHead } from '@/lib/siteMetadata'

export const Route = createFileRoute('/contact')({
  head: () =>
    createStandardHead({
      title: 'Contact | Yunosuke Yoshino',
      path: '/contact',
      description: 'Get in touch with Yunosuke Yoshino for collaborations, projects, or inquiries.',
    }),
  component: ContactPage,
})

function ContactPage() {
  return (
    <SitePage>
      <section className="mb-[var(--sectiongap)]">
        <h1 className="label-mono mb-5">Contact</h1>
        <p className="mb-12 text-base text-ink-body">
          お仕事のご依頼、ご相談などお気軽にお問い合わせください。
        </p>

        <ContactForm />
      </section>
    </SitePage>
  )
}
