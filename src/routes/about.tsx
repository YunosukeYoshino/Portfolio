import { createFileRoute } from '@tanstack/react-router'
import NoiseOverlay from '@/components/effects/NoiseOverlay'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import JsonLd, { createBreadcrumbSchema, createPersonSchema } from '@/components/seo/JsonLd'

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      { title: 'About｜Yunosuke Yoshino' },
      { property: 'og:title', content: 'About｜Yunosuke Yoshino' },
      { property: 'og:description', content: 'Career and background of Yunosuke Yoshino.' },
    ],
  }),
  component: AboutPage,
})

const timelineData = [
  {
    year: '1995',
    title: 'Born in Hiroshima',
    description: '広島県で生まれ育つ。',
  },
  {
    year: '2015 - 2019',
    title: 'Apparel Sales',
    description:
      'アパレル販売の現場で接客や店舗運営に従事。顧客体験の向上と売上改善のアプローチを学ぶ。',
  },
  {
    year: '2020 - 2022',
    title: 'Transition to Web Development',
    description:
      '独学および実務を通して、HTML/CSS、JavaScriptを習得。徐々にフロントエンド開発の領域へシフトし、ECサイトの構築や運用に携わる。',
  },
  {
    year: '2023 - Present',
    title: 'Frontend Engineer',
    description:
      '東京を拠点に、ReactやNext.jsを活用したモダンなフロントエンド開発に特化。ビジネス要件に基づいたUI/UXの改善提案や、Dify、n8nを用いたAIエージェントによる業務自動化など、幅広い技術領域で価値提供を行う。',
  },
]

function AboutPage() {
  const personSchema = createPersonSchema()
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'ホーム', url: 'https://yunosukeyoshino.com' },
    { name: 'About', url: 'https://yunosukeyoshino.com/about' },
  ])

  return (
    <>
      <JsonLd data={personSchema} />
      <JsonLd data={breadcrumbSchema} />
      <NoiseOverlay />
      <Header />
      <main className="pt-32 pb-24 bg-[#F3F3F1] min-h-screen">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="mb-20">
            <span className="text-xs font-mono uppercase tracking-widest border-b border-black/20 pb-2 inline-block text-gray-500 mb-8">
              About
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-medium leading-tight mb-8">
              My Journey
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl font-mono">
              アパレル販売からフロントエンドエンジニアへ。技術の探求と、より良いユーザー体験の実現を目指して歩んできた道のり。
            </p>
          </div>

          {/* Timeline UI */}
          <div className="relative border-l border-black/20 md:ml-0 md:pl-12 ml-4 pl-8">
            {timelineData.map((item) => (
              <div key={item.year} className="mb-16 relative">
                {/* Timeline dot */}
                <div className="absolute w-3 h-3 bg-black rounded-full -left-[38px] md:-left-[54px] top-1.5" />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 hover-trigger">
                  <div className="md:col-span-1">
                    <span className="text-sm font-mono text-gray-500 font-bold tracking-widest uppercase">
                      {item.year}
                    </span>
                  </div>
                  <div className="md:col-span-3">
                    <h2 className="text-2xl font-display font-medium mb-4">{item.title}</h2>
                    <p className="text-gray-600 leading-relaxed font-mono text-sm md:text-base">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
