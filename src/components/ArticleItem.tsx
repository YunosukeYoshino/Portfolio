'use client'

import Link from 'next/link'

interface ArticleItemProps {
  id: string
  title: string
  date: string
  category: string
  image: string
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export default function ArticleItem({
  id,
  title,
  date,
  category,
  image,
  onMouseEnter,
  onMouseLeave,
}: ArticleItemProps) {
  return (
    <Link
      href={`/article/${id}` as '/'}
      className="article-link group block bg-[#111] hover:bg-[#161616] transition-colors py-8 px-4 hover-trigger"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-image={image}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div className="flex-1">
          <h3 className="text-xl font-display font-medium mb-2 group-hover:text-gray-300 transition-colors">
            {title}
          </h3>
          <div className="flex gap-3 text-xs font-mono text-gray-500">
            <span>{date}</span>
            <span>•</span>
            <span>{category}</span>
          </div>
        </div>
        <span className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
          →
        </span>
      </div>
    </Link>
  )
}
