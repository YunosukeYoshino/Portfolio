'use client'

import { Link } from '@tanstack/react-router'
import { formatDate } from '@/lib/utils'
import type { Blog as BlogType } from '@/types'

interface BlogProps {
  blogs: BlogType[]
  column?: number
  className?: string
  showViewAllButton?: boolean
}

export default function Blog({
  blogs,
  column = 2,
  className = '',
  showViewAllButton = true,
}: BlogProps) {
  if (!blogs || blogs.length === 0) {
    const isDevelopment = import.meta.env.DEV
    return (
      <div className={className}>
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
    <div className={className}>
      <div className="container-custom">
        <div className={`grid ${gridCols} gap-6 lg:gap-8`}>
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-lg"
            >
              <Link to="/article/$slug" params={{ slug: blog.id }} className="block">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={blog.eyecatch.url}
                    alt={blog.eyecatch.alt || blog.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
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
            <Link
              to="/article"
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
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
