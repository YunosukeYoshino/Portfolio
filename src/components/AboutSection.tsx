import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function AboutSection() {
  return (
    <section id="about" className="py-32 px-6 md:px-12 bg-[#F3F3F1] relative z-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16">
        <div className="md:col-span-3">
          <span className="text-xs font-mono uppercase tracking-widest border-b border-black/20 pb-2 inline-block text-gray-500">
            01 / Profile
          </span>
        </div>

        <div className="md:col-span-9">
          <h2 className="text-3xl md:text-5xl font-display font-medium leading-[1.2] mb-16 split-text">
            I am Yunosuke Yoshino, a multidisciplinary creator. <br />I build digital products that
            blend <span className="text-gray-400">technical precision</span> with{' '}
            <span className="text-gray-400">visual elegance</span>.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm leading-relaxed text-gray-600 font-mono">
            <div className="space-y-6">
              <p>
                1993年生まれ、広島出身。スポーツの世界からデザインの世界へ転身し、現在は東京を拠点に活動中。
                グラフィックデザインのバックグラウンドを活かし、機能美と視覚的な心地よさを両立させたWebアプリケーション構築を得意としています。
              </p>
            </div>
            <div className="space-y-6">
              <p>
                主にReactエコシステム（Next.js）を用いたフロントエンド開発に従事。
                コードを書くことは、私にとって論理的な構造の中に美しさを見出す行為です。
              </p>
            </div>
          </div>

          <div className="mt-16">
            <Link
              href="#"
              className="group inline-flex items-center gap-3 text-sm font-bold uppercase tracking-wide hover-trigger"
            >
              <span className="border-b border-black pb-1 group-hover:border-blue-600 group-hover:text-blue-600 transition-colors">
                Read Full Story
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform group-hover:text-blue-600" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
