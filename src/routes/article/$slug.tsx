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
      <SitePage mainClassName="bg-white" afterMain={<ArticleCta />}>
        <article className="py-24 md:py-32">
          <div className="container-custom">
            <Breadcrumb items={breadcrumbItems} className="mb-8" />

            <header className="mb-16">
              <div className="mb-8 flex items-center justify-between">
                <span className="bg-gray-100 px-4 py-2 text-sm font-medium uppercase tracking-wide text-gray-700">
                  {blog.category.name}
                </span>
                <time
                  dateTime={blog.publishedAt}
                  className="text-sm uppercase tracking-wide text-gray-500"
                >
                  {formatDate(blog.publishedAt)}
                </time>
              </div>

              <h1 className="text-section-title text-display mb-12 leading-tight tracking-tight text-black">
                {blog.title}
              </h1>

              {blog.eyecatch ? (
                <div className="relative aspect-video overflow-hidden rounded-lg border border-gray-200">
                  <img
                    src={`${blog.eyecatch.url}?w=1200&fm=webp`}
                    alt={blog.eyecatch.alt || blog.title}
                    width={1200}
                    height={675}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : null}
            </header>

            <div className="mx-auto max-w-4xl">
              <CodeHighlight content={highlightedContent} />
            </div>

            <footer className="mt-20 border-t border-gray-200 pt-8">
              <div className="flex justify-center">
                <Link
                  to="/article/page/$page/"
                  params={{ page: '1' }}
                  reloadDocument
                  className="group relative inline-flex items-center gap-2 overflow-hidden border border-black px-6 py-3 text-sm font-medium text-black transition-all duration-300 ease-out hover:bg-black hover:text-white"
                >
                  <svg
                    className="h-4 w-4 transition-transform group-hover:-translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span className="uppercase tracking-wide">BACK TO ARTICLES</span>
                </Link>
              </div>
            </footer>
          </div>
        </article>
      </SitePage>
    </>
  )
}
