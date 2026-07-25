import { createFileRoute } from '@tanstack/react-router'
import { RuleList } from '@/components/common/RuleList'
import SitePage from '@/components/layout/SitePage'
import JsonLd, { createBreadcrumbSchema, createPersonSchema } from '@/components/seo/JsonLd'
import { createStandardHead } from '@/lib/siteMetadata'

export const Route = createFileRoute('/about')({
  head: () =>
    createStandardHead({
      title: 'About｜Yunosuke Yoshino',
      path: '/about',
      description:
        'アパレル販売からフロントエンドエンジニアへ転身したYunosuke Yoshinoの経歴。React、Astroを活用したモダンなWeb開発と、AIエージェンティックコーディングによる業務自動化に取り組んでいます。',
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
      '東京を拠点に、ReactやAstroを活用したモダンなフロントエンド開発に特化。ビジネス要件に基づいたUI/UXの改善提案に加え、ClaudeやCodex、Dify、n8nを組み合わせたAIエージェンティックコーディングで開発と業務改善を推進する。',
  },
]

function AboutPage() {
  const personSchema = createPersonSchema()
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'ホーム', url: 'https://yunosukeyoshino.com/' },
    { name: 'About', url: 'https://yunosukeyoshino.com/about/' },
  ])

  return (
    <>
      <JsonLd data={personSchema} />
      <JsonLd data={breadcrumbSchema} />
      <SitePage>
        <section className="mb-[var(--sectiongap)]">
          <h1 className="label-mono mb-5">About</h1>
          <p className="mb-4 text-base text-ink-body">
            1995年生まれ、広島出身。アパレル販売の現場からウェブ開発の世界へと転身し、現在は東京を拠点に活動しています。ECサイトを中心としたフロントエンド開発に特化し、データ分析に基づく継続的な改善提案を行っています。
          </p>
          <p className="text-base text-ink-body">
            ReactやAstroといったモダンなフレームワークを活用し、保守性と拡張性を重視したコードを書くことを大切にしています。近年はClaudeやCodex、Dify、n8nを組み合わせたAIエージェンティックコーディングを推進し、プロダクト開発と業務改善の両方に取り組んでいます。
          </p>
        </section>

        <section className="mb-[var(--sectiongap)]">
          <h2 className="label-mono mb-5">Timeline</h2>
          <RuleList>
            {timelineData.map((item) => (
              <div
                key={item.year}
                className="grid grid-cols-1 gap-2 border-t border-rule py-[var(--rowpad)] sm:grid-cols-[100px_1fr] sm:gap-6"
              >
                <span className="meta-mono sm:pt-0.5">{item.year}</span>
                <div>
                  <h3 className="mb-2 text-base font-medium">{item.title}</h3>
                  <p className="text-[15px] text-ink-soft">{item.description}</p>
                </div>
              </div>
            ))}
          </RuleList>
        </section>
      </SitePage>
    </>
  )
}
