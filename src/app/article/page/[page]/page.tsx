import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Blog from '@/components/Blog'
import Breadcrumb from '@/components/Breadcrumb'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import JsonLd, {
  createBlogSchema,
  createBreadcrumbSchema,
  createWebsiteSchema,
} from '@/components/JsonLd'
import { getBlogs } from '@/lib/microcms'
import { generateMetadata as createMetadata } from '@/lib/utils'
import type { BlogListPageProps } from '@/types'

const BLOGS_PER_PAGE = 12

// Generate static params for pagination
export async function generateStaticParams() {
  try {
    const { totalCount } = await getBlogs({ limit: 1 })
    const totalPages = Math.ceil(totalCount / BLOGS_PER_PAGE)

    return Array.from({ length: totalPages }, (_, i) => ({
      page: String(i + 1),
    }))
  } catch (_error) {
    return [{ page: '1' }]
  }
}

// Generate metadata
export async function generateMetadata({ params }: BlogListPageProps): Promise<Metadata> {
  const { page } = await params
  const pageNum = parseInt(page, 10)

  const canonicalUrl = pageNum === 1 ? '/article' : `/article/page/${pageNum}`

  return {
    ...createMetadata({
      title: pageNum === 1 ? 'Articles' : `Articles - Page ${pageNum}`,
      description: 'フロントエンド開発、UI/UXデザイン、Web技術に関する記事一覧',
      url: canonicalUrl,
    }),
    alternates: {
      canonical: `https://yunosukeyoshino.com${canonicalUrl}`,
    },
  }
}

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
    <nav
      className="c-pageNation flex justify-center items-center space-x-2"
      aria-label="ページネーション"
    >
      {/* Previous */}
      {currentPage > 1 && (
        <Link
          href={`/article/page/${currentPage - 1}`}
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
            href="/article/page/1"
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
          href={`/article/page/${page}`}
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
            href={`/article/page/${totalPages}`}
            className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-black hover:text-white hover:border-black transition-all duration-300 font-medium"
          >
            {totalPages}
          </Link>
        </>
      )}

      {/* Next */}
      {currentPage < totalPages && (
        <Link
          href={`/article/page/${currentPage + 1}`}
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

export default async function BlogListPage({ params }: BlogListPageProps) {
  try {
    const { page } = await params
    const currentPage = parseInt(page, 10)

    if (Number.isNaN(currentPage) || currentPage < 1) {
      notFound()
    }

    const { totalCount } = await getBlogs({ limit: 1 })
    const totalPages = Math.ceil(totalCount / BLOGS_PER_PAGE)

    if (currentPage > totalPages && totalPages > 0) {
      notFound()
    }

    const breadcrumbItems = [
      { name: 'ホーム', url: '/' },
      {
        name: currentPage === 1 ? '記事一覧' : `記事一覧 - ${currentPage}ページ目`,
        url: currentPage === 1 ? '/article' : `/article/page/${currentPage}`,
      },
    ]

    const blogSchema = createBlogSchema()
    const websiteSchema = createWebsiteSchema()
    const breadcrumbSchema = createBreadcrumbSchema([
      { name: 'ホーム', url: 'https://yunosukeyoshino.com' },
      {
        name: currentPage === 1 ? '記事一覧' : `記事一覧 - ${currentPage}ページ目`,
        url: `https://yunosukeyoshino.com/article/page/${currentPage}`,
      },
    ])

    return (
      <>
        <JsonLd data={blogSchema} />
        <JsonLd data={websiteSchema} />
        <JsonLd data={breadcrumbSchema} />
        <Header />
        <main className="l-main bg-white">
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
                  Technical articles and insights about frontend development, UI/UX design, and
                  modern web technologies.
                </p>
              </header>

              {/* Blog List */}
              <Blog
                limit={BLOGS_PER_PAGE}
                column={3}
                page={currentPage}
                className="mb-16"
                showViewAllButton={false}
              />

              {/* Pagination */}
              {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} />}
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: Required for debugging API errors during build
    console.error('Error loading blog list:', error)
    notFound()
  }
}
