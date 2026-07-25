import { createFileRoute, Link } from '@tanstack/react-router'
import ArticleCta from '@/components/article/ArticleCta'
import CodeHighlight from '@/components/article/CodeHighlight'
import Breadcrumb from '@/components/layout/Breadcrumb'
import SitePage from '@/components/layout/SitePage'
import JsonLd, { createArticleSchema, createBreadcrumbSchema } from '@/components/seo/JsonLd'
import { highlightContent } from '@/lib/highlight'
import { parseContentMarkdown } from '@/lib/markdown'
import { getBlogDetail } from '@/lib/microcms'
import { getSeoDescription, getSeoMetadata, getSeoTitle } from '@/lib/seoMetadata'
import { createStandardHead, DEFAULT_OG_IMAGE_URL, toCanonicalUrl } from '@/lib/siteMetadata'
import { formatDate } from '@/lib/utils'
import {
  createDirectionalViewTransition,
  getArticleTitleTransitionStyle,
} from '@/lib/viewTransitions'

export const Route = createFileRoute('/article/$slug')({
  loader: async ({ params }) => {
    const blog = await getBlogDetail({ data: { contentId: params.slug } })
    const { html: parsedContent } = await parseContentMarkdown({
      data: { content: blog.content },
    })
    const highlightedContent = await highlightContent({ data: { html: parsedContent } })
    return { blog, highlightedContent }
  },
  staleTime: Number.POSITIVE_INFINITY,
  head: ({ loaderData }) => {
    if (!loaderData?.blog) {
      return { meta: [{ title: 'Loading... | Yunosuke Yoshino' }] }
    }

    const { blog } = loaderData
    const seoTitle = getSeoTitle(blog.id, blog.title)
    const description = getSeoDescription(blog.id, blog.content)

    return createStandardHead({
      title: `${seoTitle} | Yunosuke Yoshino`,
      path: `/article/${blog.id}`,
      description,
      image: blog.eyecatch?.url ?? DEFAULT_OG_IMAGE_URL,
      ogType: 'article',
    })
  },
  component: BlogDetailPage,
})

function BlogDetailPage() {
  const { blog, highlightedContent } = Route.useLoaderData()

  const breadcrumbItems = [
    { name: 'ホーム', url: '/' },
    { name: '記事一覧', url: '/article/page/1' },
    { name: blog.title, url: `/article/${blog.id}` },
  ]

  const seo = getSeoMetadata(blog.id)
  const articleSchema = createArticleSchema(blog, seo ?? undefined)
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'ホーム', url: toCanonicalUrl('/') },
    { name: '記事一覧', url: toCanonicalUrl('/article/page/1') },
    {
      name: blog.title,
      url: toCanonicalUrl(`/article/${blog.id}`),
    },
  ])

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      <SitePage afterMain={<ArticleCta />}>
        <article className="mb-[var(--sectiongap)]">
          <Breadcrumb items={breadcrumbItems} className="mb-8" />

          <header className="mb-10">
            <div className="label-mono mb-5 flex items-center gap-3">
              <span>{blog.category.name}</span>
              <span aria-hidden="true">/</span>
              <time dateTime={blog.publishedAt}>{formatDate(blog.publishedAt)}</time>
            </div>

            <h1
              style={getArticleTitleTransitionStyle(blog.id)}
              className="text-[28px] leading-snug font-semibold tracking-[-0.015em] md:text-[32px]"
            >
              {blog.title}
            </h1>

            {blog.eyecatch ? (
              <img
                src={`${blog.eyecatch.url}?w=1200&fm=webp`}
                alt={blog.eyecatch.alt || blog.title}
                width={1200}
                height={675}
                className="mt-10 aspect-video w-full object-cover"
              />
            ) : null}
          </header>

          <CodeHighlight content={highlightedContent} />

          <footer className="mt-16 border-t border-rule pt-8">
            <Link
              to="/article/page/$page/"
              params={{ page: '1' }}
              viewTransition={createDirectionalViewTransition('back', ['article-index'])}
              className="meta-mono transition-colors hover:text-ink"
            >
              ← All writing
            </Link>
          </footer>
        </article>
      </SitePage>
    </>
  )
}
