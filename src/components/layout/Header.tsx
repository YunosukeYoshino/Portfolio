import { Link } from '@tanstack/react-router'
import {
  createDirectionalViewTransition,
  createPersistentTransitionStyle,
  SITE_HEADER_TRANSITION_NAME,
} from '@/lib/viewTransitions'

interface HeaderProps {
  /** On the index page the site name doubles as the page h1. */
  readonly siteRoot?: boolean
}

export default function Header({ siteRoot = false }: HeaderProps) {
  const NameTag = siteRoot ? 'h1' : 'p'

  return (
    <header
      style={createPersistentTransitionStyle(SITE_HEADER_TRANSITION_NAME)}
      className="mb-[var(--sectiongap)]"
    >
      <Link
        to="/"
        viewTransition={createDirectionalViewTransition('back')}
        className="inline-block"
        aria-label="Yunosuke Yoshino — Home"
      >
        <NameTag className="text-base font-semibold tracking-[-0.01em]">Yunosuke Yoshino</NameTag>
        <p className="mt-0.5 text-[15px] text-ink-soft">Frontend Developer, Tokyo</p>
      </Link>
    </header>
  )
}
