import { Link } from '@tanstack/react-router'
import { HydratedEmailLink } from '@/components/common/HydratedEmail'
import { getCurrentYear } from '@/lib/utils'
import {
  createPersistentTransitionStyle,
  fadeViewTransition,
  SITE_FOOTER_TRANSITION_NAME,
} from '@/lib/viewTransitions'

const elsewhereLinks = [
  { label: 'GitHub', href: 'https://github.com/YunosukeYoshino' },
  { label: 'Zenn', href: 'https://zenn.dev/yuche' },
  { label: 'Qiita', href: 'https://qiita.com/pomufgd' },
] as const

export default function Footer() {
  const currentYear = getCurrentYear()

  return (
    <footer
      id="contact"
      style={createPersistentTransitionStyle(SITE_FOOTER_TRANSITION_NAME)}
      className="text-[15px] text-ink-soft"
    >
      <h2 className="label-mono mb-5">Elsewhere</h2>
      <div className="mb-10 flex flex-wrap gap-x-[22px] gap-y-3">
        <HydratedEmailLink
          user="hello"
          domain="yunosukeyoshino.com"
          placeholder="Email"
          label="Email"
          className="lnk"
        />
        {elsewhereLinks.map((link) => (
          <a
            key={link.label}
            className="lnk"
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.label}
          </a>
        ))}
      </div>

      <h2 className="label-mono mb-5">Index</h2>
      <div className="mb-10 flex flex-wrap gap-x-[22px] gap-y-3">
        <Link to="/" viewTransition={fadeViewTransition} className="lnk">
          Home
        </Link>
        <Link to="/about/" viewTransition={fadeViewTransition} className="lnk">
          About
        </Link>
        <Link
          to="/article/page/$page/"
          params={{ page: '1' }}
          viewTransition={fadeViewTransition}
          className="lnk"
        >
          Writing
        </Link>
        <Link to="/contact/" viewTransition={fadeViewTransition} className="lnk">
          Contact
        </Link>
        <Link to="/privacy-policy/" viewTransition={fadeViewTransition} className="lnk">
          Privacy
        </Link>
      </div>

      <p className="meta-mono text-ink-faint">© {currentYear} Yunosuke Yoshino</p>
    </footer>
  )
}
