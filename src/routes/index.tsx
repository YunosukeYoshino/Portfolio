import { createFileRoute, Link } from '@tanstack/react-router'
import Blog from '@/components/article/Blog'
import SitePage from '@/components/layout/SitePage'
import JsonLd, {
  createBreadcrumbSchema,
  createPersonSchema,
  createWebsiteSchema,
} from '@/components/seo/JsonLd'
import { buildArticleFeed, microcmsArticleSourceAdapter } from '@/lib/articleFeed'
import { getBlogs } from '@/lib/microcms'
import { createStandardHead, DEFAULT_SITE_TITLE } from '@/lib/siteMetadata'
import { fadeViewTransition } from '@/lib/viewTransitions'

export const Route = createFileRoute('/')({
  loader: async () => {
    const { contents } = await getBlogs({
      data: {
        queries: {
          limit: 3,
          orders: '-publishedAt',
        },
      },
    })
    const articles = buildArticleFeed([{ adapter: microcmsArticleSourceAdapter, items: contents }])
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

/**
 * What I have worked on — a plain enumeration, not a portfolio of deliverables.
 * Keep in sync with the "Selected Works" section of src/server/markdown/home.ts.
 */
const works = [
  { description: 'WebGL & motion personal site', year: '2025' },
  { description: 'Jamstack corporate rebuild', year: '2024' },
  { description: 'Headless commerce frontend', year: '2024' },
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
        <section className="mb-10 text-base text-ink-body">
          <p className="mb-4">
            React、Astro、JavaScript、TypeScript
            を軸にフロントエンドを設計・実装しています。もとはアパレル販売、いまは東京でコードを書いています。
          </p>
          <p>
            Claude や Codex、Dify、n8n を組み合わせた AI
            エージェンティックコーディングを推進し、プロダクト開発と業務改善の両方に取り組んでいます。
          </p>
        </section>

        <ul className="mb-[var(--sectiongap)] space-y-1.5">
          {works.map((work) => (
            <li key={work.description} className="flex gap-4 text-[15px] text-ink-soft">
              <span>{work.description}</span>
              <span className="meta-mono ml-auto">{work.year}</span>
            </li>
          ))}
        </ul>

        <section className="mb-[var(--sectiongap)]">
          <h2 className="label-mono mb-5">Writing</h2>
          <Blog blogs={articles} />
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
