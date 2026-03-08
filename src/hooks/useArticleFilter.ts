import { useMemo, useState } from 'react'
import type { ArticleFeedItem } from '@/types'
import {
  type CategoryInfo,
  calculateTotalPages,
  extractCategories,
  filterArticles,
  paginateArticles,
} from './articleFilterLogic'
import { useDebounce } from './useDebounce'

interface UseArticleFilterResult {
  readonly searchQuery: string
  readonly onSearchChange: (query: string) => void
  readonly activeCategory: string | null
  readonly onCategorySelect: (categoryId: string | null) => void
  readonly categories: readonly CategoryInfo[]
  readonly filteredArticles: readonly ArticleFeedItem[]
  readonly paginatedArticles: readonly ArticleFeedItem[]
  readonly filteredPage: number
  readonly filteredTotalPages: number
  readonly onFilteredPageChange: (page: number) => void
  readonly isFiltering: boolean
  readonly resultCount: number
}

export function useArticleFilter(
  allArticles: readonly ArticleFeedItem[],
  perPage: number
): UseArticleFilterResult {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [filteredPage, setFilteredPage] = useState(1)

  const debouncedQuery = useDebounce(searchQuery, 300)

  const categories = useMemo(() => extractCategories(allArticles), [allArticles])

  const filtered = useMemo(
    () => filterArticles(allArticles, debouncedQuery, activeCategory),
    [allArticles, debouncedQuery, activeCategory]
  )

  const filteredTotalPages = calculateTotalPages(filtered.length, perPage)

  const paginated = useMemo(
    () => paginateArticles(filtered, filteredPage, perPage),
    [filtered, filteredPage, perPage]
  )

  const isFiltering = debouncedQuery !== '' || activeCategory !== null

  const onSearchChange = (query: string) => {
    setSearchQuery(query)
    setFilteredPage(1)
  }

  const onCategorySelect = (categoryId: string | null) => {
    setActiveCategory(categoryId)
    setFilteredPage(1)
  }

  return {
    searchQuery,
    onSearchChange,
    activeCategory,
    onCategorySelect,
    categories,
    filteredArticles: filtered,
    paginatedArticles: paginated,
    filteredPage,
    filteredTotalPages,
    onFilteredPageChange: setFilteredPage,
    isFiltering,
    resultCount: filtered.length,
  }
}
