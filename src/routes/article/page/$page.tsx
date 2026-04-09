import { createFileRoute, notFound } from '@tanstack/react-router'
import ArticleSearchBar from '@/components/article/ArticleSearchBar'
import Blog from '@/components/article/Blog'
import PaginationNav from '@/components/article/PaginationNav'
import Breadcrumb from '@/components/layout/Breadcrumb'
import SitePage from '@/components/layout/SitePage'
import JsonLd, { createBlogSchema, createBreadcrumbSchema } from '@/components/seo/JsonLd'
import { useArticleFilter } from '@/hooks/useArticleFilter'
import {
  buildArticleFeed,
  getArticleFeedPage,
  microcmsArticleSourceAdapter,
} from '@/lib/articleFeed'
import { getBlogs } from '@/lib/microcms'
import { createStandardHead, toCanonicalUrl } from '@/lib/siteMetadata'

const BLOGS_PER_PAGE = 12
const MICROCMS_FETCH_LIMIT = 1000

export const Route = createFileRoute('/article/page/$page')({
  loader: async ({ params }) => {
    const currentPage = Number.parseInt(params.page, 10)

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

    const allArticles = buildArticleFeed([
      {
        adapter: microcmsArticleSourceAdapter,
        items: microCMSBlogs,
      },
    ])
    const page = getArticleFeedPage(allArticles, currentPage, BLOGS_PER_PAGE)

    if (currentPage > page.totalPages && page.totalPages > 0) {
      throw notFound()
    }

    return {
      blogs: page.items,
      allArticles,
      currentPage,
      totalPages: page.totalPages,
      totalCount: page.totalCount,
    }
  },
  staleTime: Number.POSITIVE_INFINITY,
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: 'Articles | Yunosuke Yoshino' }] }
    }

    const { currentPage } = loaderData
    const pageTitle =
      currentPage === 1
        ? 'Articles | Yunosuke Yoshino'
        : `Articles - Page ${currentPage} | Yunosuke Yoshino`
    const head = createStandardHead({
      title: pageTitle,
      path: `/article/page/${currentPage}`,
      description: 'フロントエンド開発、UI/UXデザイン、Web技術に関する記事一覧',
      robots: currentPage > 1 ? 'noindex, follow' : undefined,
    })
    const links = [...head.links]

    if (currentPage > 1) {
      links.push({
        rel: 'prev',
        href: toCanonicalUrl(`/article/page/${currentPage - 1}`),
      })
    }

    return {
      meta: head.meta,
      links,
    }
  },
  component: BlogListPage,
})

function BlogListPage() {
  const { blogs, allArticles, currentPage, totalPages } = Route.useLoaderData()

  const {
    searchQuery,
    onSearchChange,
    activeCategory,
    onCategorySelect,
    categories,
    paginatedArticles,
    filteredPage,
    filteredTotalPages,
    onFilteredPageChange,
    isFiltering,
    resultCount,
  } = useArticleFilter(allArticles, BLOGS_PER_PAGE)

  const breadcrumbItems = [
    { name: 'ホーム', url: '/' },
    {
      name: currentPage === 1 ? '記事一覧' : `記事一覧 - ${currentPage}ページ目`,
      url: `/article/page/${currentPage}`,
    },
  ]

  const blogSchema = createBlogSchema()
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'ホーム', url: toCanonicalUrl('/') },
    {
      name: currentPage === 1 ? '記事一覧' : `記事一覧 - ${currentPage}ページ目`,
      url: toCanonicalUrl(`/article/page/${currentPage}`),
    },
  ])

  const displayedBlogs = isFiltering ? [...paginatedArticles] : [...blogs]

  return (
    <>
      <JsonLd data={blogSchema} />
      <JsonLd data={breadcrumbSchema} />
      <SitePage mainClassName="bg-white">
        <div className="py-24 md:py-32">
          <div className="container-custom">
            <Breadcrumb items={breadcrumbItems} className="mb-8" />

            <header className="mb-16">
              <h1 className="text-section-title text-display mb-6 uppercase tracking-tight text-black">
                {currentPage === 1 ? 'ARTICLES' : `ARTICLES - PAGE ${currentPage}`}
              </h1>
              <p className="max-w-2xl text-lg text-gray-600">
                Technical articles and insights about frontend development, UI/UX design, and modern
                web technologies.
              </p>
            </header>

            <ArticleSearchBar
              searchQuery={searchQuery}
              onSearchChange={onSearchChange}
              categories={categories}
              activeCategory={activeCategory}
              onCategorySelect={onCategorySelect}
              resultCount={resultCount}
            />

            {isFiltering && resultCount === 0 ? (
              <div className="mb-16 py-16 text-center">
                <p className="text-lg text-gray-500">条件に一致する記事が見つかりませんでした</p>
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange('')
                    onCategorySelect(null)
                  }}
                  className="mt-4 border border-black px-6 py-2 text-sm font-medium text-black transition-all duration-300 hover:bg-black hover:text-white"
                >
                  フィルターをリセット
                </button>
              </div>
            ) : (
              <Blog blogs={displayedBlogs} column={3} className="mb-16" showViewAllButton={false} />
            )}

            {isFiltering
              ? filteredTotalPages > 1 && (
                  <PaginationNav
                    mode="button"
                    currentPage={filteredPage}
                    totalPages={filteredTotalPages}
                    ariaLabel="フィルター結果のページネーション"
                    onPageChange={onFilteredPageChange}
                  />
                )
              : totalPages > 1 && (
                  <PaginationNav
                    mode="link"
                    currentPage={currentPage}
                    totalPages={totalPages}
                    ariaLabel="ページネーション"
                    getHref={(page) => `/article/page/${page}/`}
                  />
                )}
          </div>
        </div>
      </SitePage>
    </>
  )
}
