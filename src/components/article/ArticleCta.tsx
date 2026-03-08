import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

export default function ArticleCta() {
  return (
    <aside className="relative overflow-hidden bg-[#111111] px-6 py-16 md:px-12 md:py-20">
      {/* Decorative diagonal line */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 opacity-[0.06]"
        style={{
          background:
            'repeating-linear-gradient(45deg, transparent, transparent 8px, #fff 8px, #fff 9px)',
        }}
      />

      <div className="relative mx-auto grid max-w-4xl grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
        {/* Label */}
        <div className="md:col-span-3">
          <span className="inline-block border-b border-white/30 pb-2 font-mono text-xs uppercase tracking-widest text-gray-400">
            Contact
          </span>
        </div>

        {/* Content */}
        <div className="md:col-span-9">
          <p className="font-display mb-6 text-2xl font-medium leading-tight tracking-tight text-white md:text-3xl">
            AIの活用、一緒に考えませんか?
          </p>

          <p className="mb-10 max-w-lg font-mono text-sm leading-relaxed text-gray-300">
            AIエージェントの構築やAI導入のアドバイスを行っています。
            まずは無料相談から、お気軽にお申し込みください。
          </p>

          {/* CTA Button */}
          <Link
            to="/contact/"
            reloadDocument
            className="group inline-flex items-center gap-3 border border-white px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 ease-out hover:bg-white hover:text-black"
          >
            <span>Talk to me</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </aside>
  )
}
