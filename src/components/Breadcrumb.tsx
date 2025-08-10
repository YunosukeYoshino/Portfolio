import Link from 'next/link'

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
      className={`flex items-center space-x-1 text-sm text-gray-500 ${className}`}
      aria-label="パンくずリスト"
    >
      {items.map((item, index) => (
        <div key={item.url} className="flex items-center">
          {index > 0 && (
            <svg
              className="mx-2 h-3 w-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
          {index === items.length - 1 ? (
            <span
              className="font-medium text-gray-900"
              aria-current="page"
            >
              {item.name}
            </span>
          ) : (
            <Link
              href={item.url}
              className="transition-colors duration-200 hover:text-gray-900"
            >
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}