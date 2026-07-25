import { Link } from '@tanstack/react-router'
import { fadeViewTransition } from '@/lib/viewTransitions'

export default function ArticleCta() {
  return (
    <aside className="mb-[var(--sectiongap)]">
      <h2 className="label-mono mb-5">Contact</h2>
      <p className="mb-3 text-base font-medium">AIの活用、一緒に考えませんか?</p>
      <p className="mb-6 text-[15px] text-ink-soft">
        AIエージェントの構築やAI導入のアドバイスを行っています。まずは無料相談から、お気軽にお申し込みください。
      </p>
      <Link to="/contact/" viewTransition={fadeViewTransition} className="lnk text-base">
        Talk to me →
      </Link>
    </aside>
  )
}
