import Image from 'next/image'
import Link from 'next/link'
import { getBlogs } from '@/lib/microcms'
import { formatDate } from '@/lib/utils'
import type { BlogListProps } from '@/types'

interface BlogProps extends BlogListProps {
  className?: string
}

export default async function Blog({ limit = 6, column = 2, page = 1, className = '' }: BlogProps) {
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
            <div className="text-center py-8">
              <p className="text-gray-500 mb-2">
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
                className="p-article bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                <Link href={`/article/${blog.id}`} className="block">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={blog.eyecatch.url}
                      alt={blog.eyecatch.alt || blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                        {blog.category.name}
                      </span>
                      <time dateTime={blog.publishedAt} className="text-sm text-gray-500">
                        {formatDate(blog.publishedAt)}
                      </time>
                    </div>
                    <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {blog.title}
                    </h3>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {blogs.length === limit && (
            <div className="text-center mt-12">
              <Link
                href="/article/page/1"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                すべての記事を見る
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
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
          <p className="text-center text-red-500 py-8">記事の取得に失敗しました</p>
        </div>
      </div>
    )
  }
}
