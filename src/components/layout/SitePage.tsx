import type { ReactNode, Ref } from 'react'
import NoiseOverlay from '@/components/effects/NoiseOverlay'
import { cn } from '@/lib/utils'
import { PAGE_SHELL_TRANSITION_NAME } from '@/lib/viewTransitions'
import Footer from './Footer'
import Header from './Header'

interface SitePageProps {
  readonly children: ReactNode
  readonly mainClassName?: string
  readonly mainRef?: Ref<HTMLElement>
  readonly noiseOverlay?: boolean
  readonly afterMain?: ReactNode
  readonly showFooter?: boolean
}

export default function SitePage({
  children,
  mainClassName,
  mainRef,
  noiseOverlay = false,
  afterMain,
  showFooter = true,
}: SitePageProps) {
  return (
    <>
      {noiseOverlay ? <NoiseOverlay /> : null}
      <Header />
      <div style={{ viewTransitionName: PAGE_SHELL_TRANSITION_NAME }}>
        <main ref={mainRef} className={cn(mainClassName)}>
          {children}
        </main>
        {afterMain}
      </div>
      {showFooter ? <Footer /> : null}
    </>
  )
}
