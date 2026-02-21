'use client'

import { Link } from '@tanstack/react-router'
import type { Blog } from '@/types'
import ArticleItem from './ArticleItem'
import ArticlesHoverEffect from './ArticlesHoverEffect'

interface ArticlesSectionProps {
  articles: Blog[]
}

export default function ArticlesSection({ articles }: ArticlesSectionProps) {
  return (
    <section id="articles" className="py-32 px-6 md:px-12 bg-[#111] text-white relative z-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-16">
          <h2 className="text-xs font-mono uppercase tracking-widest text-gray-500">
            03 / Insights
          </h2>
        </div>

        {articles.length === 0 ? (
          <p className="text-gray-400 text-center py-12">記事は現在準備中です。Coming soon...</p>
        ) : (
          <>
            {/* Hover Image Container */}
            <ArticlesHoverEffect />

            <div className="space-y-px bg-gray-800 articles-container">
              {articles.map((article) => {
                // Format date
                const date = new Date(article.publishedAt)
                  .toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })
                  .replace(/\//g, '.')

                return (
                  <ArticleItem
                    key={article.id}
                    id={article.id}
                    title={article.title}
                    date={date}
                    category={article.category.name}
                    image={article.eyecatch.url}
                  />
                )
              })}
            </div>

            <div className="mt-16 text-center">
              <Link
                to="/article/page/$page"
                params={{ page: '1' }}
                className="inline-block border-b border-gray-700 pb-1 text-sm font-mono uppercase tracking-widest text-gray-500 hover:text-white hover:border-white transition-colors"
              >
                View All Articles
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
