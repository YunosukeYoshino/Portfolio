'use client'

import { ArticleLink } from '@/components/article/ArticleLink'
import { RuleList, RuleRowBody } from '@/components/common/RuleList'
import { formatDateEditorial } from '@/lib/utils'
import { getArticleTitleTransitionStyle } from '@/lib/viewTransitions'
import type { ArticleFeedItem } from '@/types'

interface BlogProps {
  blogs: ArticleFeedItem[]
  className?: string
}

export default function Blog({ blogs, className = '' }: BlogProps) {
  if (!blogs || blogs.length === 0) {
    const isDevelopment = import.meta.env.DEV
    return (
      <div className={className}>
        <p className="border-t border-rule py-[var(--rowpad)] text-[15px] text-ink-soft">
          {isDevelopment ? '開発モード: 記事データがありません' : '記事がありません'}
        </p>
        {isDevelopment && (
          <p className="text-[13px] text-ink-faint">
            実際のコンテンツを表示するには、.env.local にmicroCMSの認証情報を設定してください
          </p>
        )}
      </div>
    )
  }

  return (
    <RuleList className={className}>
      {blogs.map((blog) => {
        const isInternalArticle = !blog.externalUrl

        return (
          <ArticleLink
            key={`${blog.source}-${blog.id}`}
            externalUrl={blog.externalUrl}
            slug={blog.id}
            className="rule-row py-[var(--rowpad-sm)] transition-opacity hover:opacity-60"
          >
            <RuleRowBody
              title={
                <span
                  style={isInternalArticle ? getArticleTitleTransitionStyle(blog.id) : undefined}
                >
                  {blog.title}
                </span>
              }
              description={blog.category.name}
              meta={`${formatDateEditorial(blog.publishedAt)}${isInternalArticle ? '' : ' ↗'}`}
            />
          </ArticleLink>
        )
      })}
    </RuleList>
  )
}
