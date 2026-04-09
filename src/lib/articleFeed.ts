import type { Blog } from '@/domain/entities/blog'
import type { ArticleFeedItem } from '@/types'

export interface ArticleSourceAdapter<TSourceItem> {
  readonly source: ArticleFeedItem['source']
  toFeedItems(items: readonly TSourceItem[]): readonly ArticleFeedItem[]
}

export interface ArticleFeedSource<TSourceItem> {
  readonly adapter: ArticleSourceAdapter<TSourceItem>
  readonly items: readonly TSourceItem[]
}

export interface ArticleFeedPage {
  readonly items: readonly ArticleFeedItem[]
  readonly totalCount: number
  readonly totalPages: number
}

export const microcmsArticleSourceAdapter: ArticleSourceAdapter<Blog> = {
  source: 'microcms',
  toFeedItems: (items) =>
    items.map((blog) => ({
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
    })),
}

export function buildArticleFeed<TSourceItem>(
  sources: readonly ArticleFeedSource<TSourceItem>[]
): readonly ArticleFeedItem[] {
  return sources
    .flatMap((source) => source.adapter.toFeedItems(source.items))
    .sort((left, right) => {
      return new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime()
    })
}

export function getArticleFeedPage(
  articles: readonly ArticleFeedItem[],
  currentPage: number,
  perPage: number
): ArticleFeedPage {
  const totalCount = articles.length
  const totalPages = Math.max(1, Math.ceil(totalCount / perPage))
  const offset = (currentPage - 1) * perPage

  return {
    items: articles.slice(offset, offset + perPage),
    totalCount,
    totalPages,
  }
}
