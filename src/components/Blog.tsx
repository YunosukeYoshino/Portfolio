import Image from 'next/image'
import Link from 'next/link'
import { getBlogs } from '@/lib/microcms'
import { formatDate } from '@/lib/utils'
import type { BlogListProps } from '@/types'

interface BlogProps extends BlogListProps {
  className?: string
  showViewAllButton?: boolean
}

export default async function Blog({
  limit = 6,
  column = 2,
  page = 1,
  className = '',
  showViewAllButton = true,
}: BlogProps) {
  try {
    const offset = (page - 1) * limit
    const { contents: blogs } = await getBlogs({
      limit,
      offset,
      orders: '-publishedAt',
    })

    if (!blogs || blogs.length === 0) {
      const isDevelopment = process.env.NODE_ENV === 'development'
      return (
        <div className={`p-articleList ${className}`}>
          <div className="container-custom">
            <div className="py-8 text-center">
              <p className="mb-2 text-gray-500">
                {isDevelopment ? '開発モード: 記事データがありません' : '記事がありません'}
              </p>
              {isDevelopment && (
                <p className="text-sm text-gray-400">
                  実際のコンテンツを表示するには、.env.local にmicroCMSの認証情報を設定してください
                </p>
              )}
            </div>
          </div>
        </div>
      )
    }

    const gridCols =
      column === 1
        ? 'grid-cols-1'
        : column === 2
          ? 'grid-cols-1 md:grid-cols-2'
          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'

    return (
      <div className={`p-articleList ${className}`}>
        <div className="container-custom">
          <div className={`grid ${gridCols} gap-6 lg:gap-8`}>
            {blogs.map((blog) => (
              <article
                key={blog.id}
                className="p-article group overflow-hidden rounded-lg bg-white border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-gray-300"
              >
                <Link href={`/article/${blog.id}`} className="block">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={blog.eyecatch.url}
                      alt={blog.eyecatch.alt || blog.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600">
                        {blog.category.name}
                      </span>
                      <time dateTime={blog.publishedAt} className="text-sm text-gray-500">
                        {formatDate(blog.publishedAt)}
                      </time>
                    </div>
                    <h3 className="line-clamp-2 font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                      {blog.title}
                    </h3>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {showViewAllButton && (
            <div className="mt-20 flex justify-center">
              <a
                href="/article"
                className="group relative inline-flex items-center gap-2 overflow-hidden border border-black px-6 py-3 text-sm font-medium text-black transition-all duration-300 ease-out hover:bg-black hover:text-white"
              >
                <span className="uppercase tracking-wide">VIEW ALL ARTICLES</span>
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: Error logging is necessary for debugging
    console.error('Error fetching blogs:', error)
    return (
      <div className={`p-articleList ${className}`}>
        <div className="container-custom">
          <p className="py-8 text-center text-red-500">記事の取得に失敗しました</p>
        </div>
      </div>
    )
  }
}
