'use client'

import { Search, X } from 'lucide-react'

interface CategoryInfo {
  readonly id: string
  readonly name: string
  readonly count: number
}

interface ArticleSearchBarProps {
  readonly searchQuery: string
  readonly onSearchChange: (query: string) => void
  readonly categories: readonly CategoryInfo[]
  readonly activeCategory: string | null
  readonly onCategorySelect: (categoryId: string | null) => void
  readonly resultCount: number
}

export default function ArticleSearchBar({
  searchQuery,
  onSearchChange,
  categories,
  activeCategory,
  onCategorySelect,
  resultCount,
}: ArticleSearchBarProps) {
  return (
    <search className="mb-12 space-y-5" aria-label="記事の検索とフィルター">
      {/* Search Input */}
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-ink-faint"
          size={16}
          aria-hidden="true"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="記事をタイトルで検索"
          className="w-full border-b border-rule bg-transparent py-2.5 pr-8 pl-6 text-base transition-colors placeholder:text-ink-faint/60 focus:border-ink focus:outline-none"
          aria-label="記事をタイトルで検索"
        />
        {searchQuery !== '' && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-ink-faint transition-colors hover:text-ink"
            aria-label="検索をクリア"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <button
          type="button"
          onClick={() => onCategorySelect(null)}
          className={`meta-mono transition-colors ${
            activeCategory === null ? 'text-ink underline underline-offset-4' : 'hover:text-ink'
          }`}
          aria-pressed={activeCategory === null}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => onCategorySelect(activeCategory === category.id ? null : category.id)}
            className={`meta-mono transition-colors ${
              activeCategory === category.id
                ? 'text-ink underline underline-offset-4'
                : 'hover:text-ink'
            }`}
            aria-pressed={activeCategory === category.id}
          >
            {category.name}
            <span className="ml-1 opacity-60">({category.count})</span>
          </button>
        ))}
      </div>

      {/* Result Count */}
      {(searchQuery !== '' || activeCategory !== null) && (
        <p className="meta-mono">{resultCount}件の記事が見つかりました</p>
      )}
    </search>
  )
}
