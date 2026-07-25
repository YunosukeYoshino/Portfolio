import { createFileRoute, Link } from '@tanstack/react-router'
import { RuleList, RuleRowBody } from '@/components/common/RuleList'
import SitePage from '@/components/layout/SitePage'
import JsonLd, {
  createBreadcrumbSchema,
  createPersonSchema,
  createWebsiteSchema,
} from '@/components/seo/JsonLd'
import { getExternalLinkProps } from '@/lib/link'
import { getBlogs } from '@/lib/microcms'
import { createStandardHead, DEFAULT_SITE_TITLE } from '@/lib/siteMetadata'
import { formatDateEditorial } from '@/lib/utils'
import { fadeViewTransition } from '@/lib/viewTransitions'

export const Route = createFileRoute('/')({
  loader: async () => {
    const { contents: articles } = await getBlogs({
      data: {
        queries: {
          limit: 3,
          orders: '-publishedAt',
        },
      },
    })
    return { articles }
  },
  // Prevent re-fetching on client-side navigation for static sites
  staleTime: Number.POSITIVE_INFINITY,
  head: () =>
    createStandardHead({
      title: DEFAULT_SITE_TITLE,
      path: '/',
    }),
  component: HomePage,
})

const works = [
  {
    title: 'YUNOSUKE Portfolio',
    description: 'WebGL & motion personal site',
    year: '2025',
    link: '#',
  },
  {
    title: 'Corporate Renewal',
    description: 'Jamstack corporate rebuild',
    year: '2024',
    link: '#',
  },
  {
    title: 'E-Commerce Platform',
    description: 'Headless commerce frontend',
    year: '2024',
    link: '#',
  },
  {
    title: 'Nanatau',
    description: 'Content-first blog on microCMS',
    year: '2023',
    link: 'https://blog.nanatau.com',
  },
] as const

function HomePage() {
  const { articles } = Route.useLoaderData()

  const personSchema = createPersonSchema()
  const websiteSchema = createWebsiteSchema()
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'ホーム', url: 'https://yunosukeyoshino.com/' },
  ])

  return (
    <>
      <JsonLd data={personSchema} />
      <JsonLd data={websiteSchema} />
      <JsonLd data={breadcrumbSchema} />
      <SitePage siteRoot>
        <section className="mb-[var(--sectiongap)] text-base text-ink-body">
          <p className="mb-4">
            React と Next.js を軸に、EC
            を中心としたフロントエンドを設計・実装しています。保守しやすい UI
            を届け、データをもとに改善を重ねること。もとはアパレル販売、いまは東京でコードを書いています。
          </p>
          <p>
            現在は WebGL とモーション表現、Dify や n8n を使った AI 活用の業務自動化を探求中です。
          </p>
        </section>

        <section className="mb-[var(--sectiongap)]">
          <h2 className="label-mono mb-5">Selected Work</h2>
          <RuleList>
            {works.map((work) => (
              <a
                key={work.title}
                href={work.link}
                {...getExternalLinkProps(work.link)}
                className="rule-row py-[var(--rowpad)] transition-opacity hover:opacity-60"
              >
                <RuleRowBody
                  title={work.title}
                  description={work.description}
                  meta={`${work.year} ↗`}
                />
              </a>
            ))}
          </RuleList>
        </section>

        <section className="mb-[var(--sectiongap)]">
          <h2 className="label-mono mb-5">Writing</h2>
          {articles.length === 0 ? (
            <p className="border-t border-rule py-[var(--rowpad)] text-[15px] text-ink-soft">
              記事は現在準備中です。
            </p>
          ) : (
            <RuleList>
              {articles.map((article) => (
                <Link
                  key={article.id}
                  to="/article/$slug/"
                  params={{ slug: article.id }}
                  viewTransition={fadeViewTransition}
                  className="rule-row py-[var(--rowpad-sm)] transition-opacity hover:opacity-60"
                >
                  <span className="text-base">{article.title}</span>
                  <span className="meta-mono">{formatDateEditorial(article.publishedAt)}</span>
                </Link>
              ))}
            </RuleList>
          )}
          <Link
            to="/article/page/$page/"
            params={{ page: '1' }}
            viewTransition={fadeViewTransition}
            className="meta-mono mt-6 inline-block transition-opacity hover:opacity-60"
          >
            All writing →
          </Link>
        </section>
      </SitePage>
    </>
  )
}
