'use client'

import { Link } from '@tanstack/react-router'
import { fadeViewTransition } from '@/lib/viewTransitions'

interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav
      className={`meta-mono flex items-center overflow-x-auto ${className}`}
      aria-label="パンくずリスト"
    >
      {items.map((item, index) => (
        <div key={item.url} className="flex items-center whitespace-nowrap">
          {index > 0 && (
            <span className="mx-2 text-ink-faint" aria-hidden="true">
              /
            </span>
          )}
          {index === items.length - 1 ? (
            <span className="text-ink" aria-current="page">
              {item.name}
            </span>
          ) : (
            <Link
              to={item.url}
              viewTransition={fadeViewTransition}
              className="transition-colors hover:text-ink"
            >
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}
