import type { ArticleFeedItem } from '@/types'

export interface CategoryInfo {
  readonly id: string
  readonly name: string
  readonly count: number
}

export function extractCategories(articles: readonly ArticleFeedItem[]): readonly CategoryInfo[] {
  const countMap = new Map<string, { name: string; count: number }>()
  for (const article of articles) {
    const existing = countMap.get(article.category.id)
    if (existing) {
      countMap.set(article.category.id, {
        name: existing.name,
        count: existing.count + 1,
      })
    } else {
      countMap.set(article.category.id, {
        name: article.category.name,
        count: 1,
      })
    }
  }
  return Array.from(countMap.entries())
    .map(([id, { name, count }]) => ({ id, name, count }))
    .sort((a, b) => b.count - a.count)
}

export function filterArticles(
  articles: readonly ArticleFeedItem[],
  searchQuery: string,
  activeCategory: string | null
): readonly ArticleFeedItem[] {
  const lowerQuery = searchQuery.toLowerCase()
  return articles.filter((article) => {
    const matchesSearch = lowerQuery === '' || article.title.toLowerCase().includes(lowerQuery)
    const matchesCategory = activeCategory === null || article.category.id === activeCategory
    return matchesSearch && matchesCategory
  })
}

export function paginateArticles(
  articles: readonly ArticleFeedItem[],
  page: number,
  perPage: number
): readonly ArticleFeedItem[] {
  const offset = (page - 1) * perPage
  return articles.slice(offset, offset + perPage)
}

export function calculateTotalPages(totalItems: number, perPage: number): number {
  return Math.max(1, Math.ceil(totalItems / perPage))
}
