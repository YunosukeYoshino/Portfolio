import type { ReactNode } from 'react'
import { PAGE_SHELL_TRANSITION_NAME } from '@/lib/viewTransitions'
import Footer from './Footer'
import Header from './Header'

interface SitePageProps {
  readonly children: ReactNode
  /** Rendered after <main>, inside the page-shell transition (e.g. the article CTA). */
  readonly afterMain?: ReactNode
  /** Render the site name as the page h1. Only the index page should set this. */
  readonly siteRoot?: boolean
}

export default function SitePage({ children, afterMain, siteRoot = false }: SitePageProps) {
  return (
    <div className="measure relative z-[2] pt-[var(--pagetop)] pb-[var(--pagebottom)]">
      <Header siteRoot={siteRoot} />
      <div style={{ viewTransitionName: PAGE_SHELL_TRANSITION_NAME }}>
        <main>{children}</main>
        {afterMain}
      </div>
      <Footer />
    </div>
  )
}
