import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import Blog from '@/components/article/Blog'
import Breadcrumb from '@/components/layout/Breadcrumb'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import JsonLd, { createBlogSchema, createBreadcrumbSchema } from '@/components/seo/JsonLd'
import { getBlogs } from '@/lib/microcms'
import type { ArticleFeedItem, Blog as MicroCMSBlog } from '@/types'

const BLOGS_PER_PAGE = 12
const MICROCMS_FETCH_LIMIT = 1000

const mapMicroCMSBlog = (blog: MicroCMSBlog): ArticleFeedItem => {
  return {
    id: blog.id,
    title: blog.title,
    publishedAt: blog.publishedAt,
    category: {
      id: blog.category.id,
      name: blog.category.name,
    },
    eyecatch: {
      url: blog.eyecatch.url,
      width: blog.eyecatch.width,
      height: blog.eyecatch.height,
      alt: blog.eyecatch.alt || blog.title,
    },
    source: 'microcms',
  }
}

export const Route = createFileRoute('/article/page/$page')({
  loader: async ({ params }) => {
    const currentPage = parseInt(params.page, 10)

    if (Number.isNaN(currentPage) || currentPage < 1) {
      throw notFound()
    }

    const { contents: microCMSBlogs } = await getBlogs({
      data: {
        queries: {
          limit: MICROCMS_FETCH_LIMIT,
          orders: '-publishedAt',
        },
      },
    })

    const allArticles = [...microCMSBlogs.map(mapMicroCMSBlog)].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )

    const totalCount = allArticles.length

    const totalPages = Math.ceil(totalCount / BLOGS_PER_PAGE)

    if (currentPage > totalPages && totalPages > 0) {
      throw notFound()
    }

    const offset = (currentPage - 1) * BLOGS_PER_PAGE
    const blogs = allArticles.slice(offset, offset + BLOGS_PER_PAGE)

    return { blogs, currentPage, totalPages, totalCount }
  },
  // Prevent re-fetching on client-side navigation for static sites
  staleTime: Number.POSITIVE_INFINITY,
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: 'Articles | Yunosuke Yoshino' }] }
    }
    const { currentPage } = loaderData
    const url = `https://yunosukeyoshino.com/article/page/${currentPage}/`
    const pageTitle =
      currentPage === 1
        ? 'Articles | Yunosuke Yoshino'
        : `Articles - Page ${currentPage} | Yunosuke Yoshino`
    const paginationLinks: Array<{ rel: string; href: string }> = [{ rel: 'canonical', href: url }]
    if (currentPage > 1) {
      paginationLinks.push({
        rel: 'prev',
        href: `https://yunosukeyoshino.com/article/page/${currentPage - 1}/`,
      })
    }
    return {
      meta: [
        { title: pageTitle },
        {
          name: 'description',
          content: 'フロントエンド開発、UI/UXデザイン、Web技術に関する記事一覧',
        },
        ...(currentPage > 1 ? [{ name: 'robots', content: 'noindex, follow' }] : []),
        { property: 'og:title', content: pageTitle },
        { property: 'og:url', content: url },
        {
          property: 'og:image',
          content: 'https://yunosukeyoshino.com/assets/og-image.png',
        },
        { name: 'twitter:title', content: pageTitle },
        {
          name: 'twitter:description',
          content: 'フロントエンド開発、UI/UXデザイン、Web技術に関する記事一覧',
        },
        {
          name: 'twitter:image',
          content: 'https://yunosukeyoshino.com/assets/og-image.png',
        },
      ],
      links: paginationLinks,
    }
  },
  component: BlogListPage,
})

function Pagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  const pages = []
  const maxVisible = 5

  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
  const end = Math.min(totalPages, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return (
    <nav className="flex justify-center items-center space-x-2" aria-label="ページネーション">
      {/* Previous */}
      {currentPage > 1 && (
        <Link
          to="/article/page/$page/"
          params={{ page: String(currentPage - 1) }}
          reloadDocument
          className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-black hover:text-white hover:border-black transition-all duration-300"
          aria-label="前のページ"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
      )}

      {/* First page */}
      {start > 1 && (
        <>
          <Link
            to="/article/page/$page/"
            params={{ page: '1' }}
            reloadDocument
            className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-black hover:text-white hover:border-black transition-all duration-300 font-medium"
          >
            1
          </Link>
          {start > 2 && <span className="px-2 text-gray-400">…</span>}
        </>
      )}

      {/* Page numbers */}
      {pages.map((page) => (
        <Link
          key={page}
          to="/article/page/$page/"
          params={{ page: String(page) }}
          reloadDocument
          className={`px-4 py-2 border font-medium transition-all duration-300 ${
            page === currentPage
              ? 'bg-black text-white border-black'
              : 'border-gray-300 text-gray-700 hover:bg-black hover:text-white hover:border-black'
          }`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </Link>
      ))}

      {/* Last page */}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-2 text-gray-400">…</span>}
          <Link
            to="/article/page/$page/"
            params={{ page: String(totalPages) }}
            reloadDocument
            className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-black hover:text-white hover:border-black transition-all duration-300 font-medium"
          >
            {totalPages}
          </Link>
        </>
      )}

      {/* Next */}
      {currentPage < totalPages && (
        <Link
          to="/article/page/$page/"
          params={{ page: String(currentPage + 1) }}
          reloadDocument
          className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-black hover:text-white hover:border-black transition-all duration-300"
          aria-label="次のページ"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </nav>
  )
}

function BlogListPage() {
  const { blogs, currentPage, totalPages } = Route.useLoaderData()

  const breadcrumbItems = [
    { name: 'ホーム', url: '/' },
    {
      name: currentPage === 1 ? '記事一覧' : `記事一覧 - ${currentPage}ページ目`,
      url: `/article/page/${currentPage}`,
    },
  ]

  const blogSchema = createBlogSchema()
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'ホーム', url: 'https://yunosukeyoshino.com/' },
    {
      name: currentPage === 1 ? '記事一覧' : `記事一覧 - ${currentPage}ページ目`,
      url: `https://yunosukeyoshino.com/article/page/${currentPage}/`,
    },
  ])

  return (
    <>
      <JsonLd data={blogSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Header />
      <main className="bg-white">
        <div className="py-24 md:py-32">
          <div className="container-custom">
            {/* Breadcrumb */}
            <Breadcrumb items={breadcrumbItems} className="mb-8" />

            {/* Page Header */}
            <header className="mb-16">
              <h1 className="text-section-title text-display text-black mb-6 uppercase tracking-tight">
                {currentPage === 1 ? 'ARTICLES' : `ARTICLES - PAGE ${currentPage}`}
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl">
                Technical articles and insights about frontend development, UI/UX design, and modern
                web technologies.
              </p>
            </header>

            {/* Blog List */}
            <Blog blogs={blogs} column={3} className="mb-16" showViewAllButton={false} />

            {/* Pagination */}
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} />}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
