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
    <search className="mb-12 space-y-6" aria-label="記事の検索とフィルター">
      {/* Search Input */}
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
          aria-hidden="true"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="記事をタイトルで検索..."
          className="w-full border-2 border-black py-3 pl-12 pr-12 text-base transition-colors duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          aria-label="記事をタイトルで検索"
        />
        {searchQuery !== '' && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-black"
            aria-label="検索をクリア"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Category Chips */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => onCategorySelect(null)}
          className={`shrink-0 px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
            activeCategory === null
              ? 'bg-black text-white'
              : 'border border-gray-300 text-gray-600 hover:border-black hover:text-black'
          }`}
          aria-pressed={activeCategory === null}
        >
          ALL
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => onCategorySelect(activeCategory === category.id ? null : category.id)}
            className={`shrink-0 px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
              activeCategory === category.id
                ? 'bg-black text-white'
                : 'border border-gray-300 text-gray-600 hover:border-black hover:text-black'
            }`}
            aria-pressed={activeCategory === category.id}
          >
            {category.name}
            <span className="ml-1.5 opacity-60">({category.count})</span>
          </button>
        ))}
      </div>

      {/* Result Count */}
      {(searchQuery !== '' || activeCategory !== null) && (
        <p className="text-sm text-gray-500">{resultCount}件の記事が見つかりました</p>
      )}
    </search>
  )
}
