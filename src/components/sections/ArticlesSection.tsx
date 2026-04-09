'use client'

import { Link } from '@tanstack/react-router'
import { useRef } from 'react'
import ArticleItem from '@/components/article/ArticleItem'
import ArticlesHoverEffect from '@/components/article/ArticlesHoverEffect'
import { formatDateCompact } from '@/lib/utils'
import { createDirectionalViewTransition } from '@/lib/viewTransitions'
import type { Blog } from '@/types'
import { useArticlesSectionAnimation } from './useArticlesSectionAnimation'

interface ArticlesSectionProps {
  articles: Blog[]
}

export default function ArticlesSection({ articles }: ArticlesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  useArticlesSectionAnimation(sectionRef)

  return (
    <section
      ref={sectionRef}
      id="articles"
      className="py-32 px-6 md:px-12 bg-[#111] text-white relative z-20"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-16 articles-heading">
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
                const date = formatDateCompact(article.publishedAt)

                return (
                  <div key={article.id} className="article-batch-item">
                    <ArticleItem
                      id={article.id}
                      title={article.title}
                      date={date}
                      category={article.category.name}
                      image={article.eyecatch?.url}
                    />
                  </div>
                )
              })}
            </div>

            <div className="mt-16 text-center articles-view-all">
              <Link
                to="/article/page/$page/"
                params={{ page: '1' }}
                viewTransition={createDirectionalViewTransition('forward', ['article-index'])}
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
