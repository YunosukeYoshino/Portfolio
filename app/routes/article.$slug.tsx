import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import Breadcrumb from '@/components/Breadcrumb'
import CodeHighlight from '@/components/CodeHighlight'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import JsonLd, { createArticleSchema, createBreadcrumbSchema } from '@/components/JsonLd'
import { getAllBlogIds, getBlogDetail } from '@/lib/microcms'
import { formatDate } from '@/lib/utils'

export const Route = createFileRoute('/article/$slug')({
  loader: async ({ params }) => {
    try {
      const blog = await getBlogDetail(params.slug)
      return { blog }
    } catch (error) {
      throw notFound()
    }
  },
  component: BlogDetailPage,
  meta: ({ loaderData }) => {
    if (!loaderData?.blog) {
      return [
        {
          title: 'Article Not Found',
        },
        {
          name: 'description',
          content: 'The requested article could not be found.',
        },
      ]
    }

    const { blog } = loaderData
    const siteUrl = 'https://yunosukeyoshino.com'

    return [
      {
        title: `${blog.title} | Yunosuke Yoshino`,
      },
      {
        name: 'description',
        content: blog.content.replace(/<[^>]*>/g, '').slice(0, 160),
      },
      {
        property: 'og:type',
        content: 'article',
      },
      {
        property: 'og:title',
        content: blog.title,
      },
      {
        property: 'og:description',
        content: blog.content.replace(/<[^>]*>/g, '').slice(0, 160),
      },
      {
        property: 'og:image',
        content: `${siteUrl}/article/${blog.id}/opengraph-image`,
      },
      {
        property: 'article:published_time',
        content: blog.publishedAt,
      },
      {
        property: 'article:modified_time',
        content: blog.updatedAt,
      },
      {
        property: 'article:author',
        content: 'Yunosuke Yoshino',
      },
      {
        property: 'article:section',
        content: blog.category.name,
      },
    ]
  },
})

function BlogDetailPage() {
  const { blog } = Route.useLoaderData()

  const breadcrumbItems = [
    { name: 'ホーム', url: '/' },
    { name: '記事一覧', url: '/article' },
    { name: blog.title, url: `/article/${blog.id}` },
  ]

  const articleSchema = createArticleSchema(blog)
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'ホーム', url: 'https://yunosukeyoshino.com' },
    { name: '記事一覧', url: 'https://yunosukeyoshino.com/article' },
    {
      name: blog.title,
      url: `https://yunosukeyoshino.com/article/${blog.id}`,
    },
  ])

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Header />
      <main className="bg-white">
        <article className="py-24 md:py-32">
          <div className="container-custom">
            {/* Breadcrumb */}
            <Breadcrumb items={breadcrumbItems} className="mb-8" />

            {/* Article Header */}
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

              <h1 className="text-section-title text-display mb-12 uppercase leading-tight tracking-tight text-black">
                {blog.title}
              </h1>

              <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-gray-200">
                <img
                  src={blog.eyecatch.url}
                  alt={blog.eyecatch.alt || blog.title}
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
              </div>
            </header>

            {/* Article Content */}
            <div className="mx-auto max-w-4xl">
              <CodeHighlight content={blog.content} />
            </div>

            {/* Article Footer */}
            <footer className="mt-20 border-t border-gray-200 pt-8">
              <div className="flex justify-center">
                <Link
                  to="/article/page/$page"
                  params={{ page: '1' }}
                  className="group relative inline-flex items-center gap-2 overflow-hidden border border-black px-6 py-3 text-sm font-medium text-black transition-all duration-300 ease-out hover:bg-black hover:text-white"
                >
                  <svg
                    className="h-4 w-4 transition-transform group-hover:-translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span>記事一覧に戻る</span>
                </Link>
              </div>
            </footer>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
