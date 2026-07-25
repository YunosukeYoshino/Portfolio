import type { ReactNode, Ref } from 'react'
import { cn } from '@/lib/utils'
import { PAGE_SHELL_TRANSITION_NAME } from '@/lib/viewTransitions'
import Footer from './Footer'
import Header from './Header'

interface SitePageProps {
  readonly children: ReactNode
  readonly mainClassName?: string
  readonly mainRef?: Ref<HTMLElement>
  readonly afterMain?: ReactNode
  readonly showFooter?: boolean
  /** Render the site name as the page h1. Only the index page should set this. */
  readonly siteRoot?: boolean
}

export default function SitePage({
  children,
  mainClassName,
  mainRef,
  afterMain,
  showFooter = true,
  siteRoot = false,
}: SitePageProps) {
  return (
    <div className="measure relative z-[2] pt-[var(--pagetop)] pb-[var(--pagebottom)]">
      <Header siteRoot={siteRoot} />
      <div style={{ viewTransitionName: PAGE_SHELL_TRANSITION_NAME }}>
        <main ref={mainRef} className={cn(mainClassName)}>
          {children}
        </main>
        {afterMain}
      </div>
      {showFooter ? <Footer /> : null}
    </div>
  )
}
