import { Fragment, type ReactNode } from 'react'
import { buildPaginationModel } from '@/lib/pagination'
import { cn } from '@/lib/utils'

interface PaginationNavProps {
  readonly currentPage: number
  readonly totalPages: number
  readonly ariaLabel: string
  readonly getHref?: (page: number) => string
  readonly onPageChange?: (page: number) => void
}

const activeClass = 'bg-black text-white border-black'
const inactiveClass =
  'border-gray-300 text-gray-700 hover:bg-black hover:text-white hover:border-black'
const baseClass = 'px-4 py-2 border font-medium transition-all duration-300'
const navClass =
  'px-4 py-2 border border-gray-300 text-gray-700 hover:bg-black hover:text-white hover:border-black transition-all duration-300'

const prevArrow = (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
)

const nextArrow = (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

export default function PaginationNav({
  currentPage,
  totalPages,
  ariaLabel,
  getHref,
  onPageChange,
}: PaginationNavProps) {
  const model = buildPaginationModel({ currentPage, totalPages })

  if (!getHref && !onPageChange) {
    throw new Error('PaginationNav requires getHref or onPageChange')
  }

  const renderControl = ({
    page,
    className,
    children,
    ariaCurrent,
    ariaLabel: controlLabel,
  }: {
    readonly page: number
    readonly className: string
    readonly children: ReactNode
    readonly ariaCurrent?: 'page'
    readonly ariaLabel?: string
  }) => {
    if (getHref) {
      return (
        <a
          href={getHref(page)}
          className={className}
          aria-current={ariaCurrent}
          aria-label={controlLabel}
        >
          {children}
        </a>
      )
    }

    return (
      <button
        type="button"
        onClick={() => onPageChange?.(page)}
        className={className}
        aria-current={ariaCurrent}
        aria-label={controlLabel}
      >
        {children}
      </button>
    )
  }

  return (
    <nav className="flex items-center justify-center space-x-2" aria-label={ariaLabel}>
      {model.hasPrevious && model.previousPage !== null
        ? renderControl({
            page: model.previousPage,
            className: navClass,
            children: prevArrow,
            ariaLabel: '前のページ',
          })
        : null}

      {model.showFirstPage ? (
        <>
          {renderControl({
            page: 1,
            className: `${baseClass} ${inactiveClass}`,
            children: 1,
          })}
          {model.hasLeadingEllipsis ? <span className="px-2 text-gray-400">...</span> : null}
        </>
      ) : null}

      {model.pages.map((page) => (
        <Fragment key={page}>
          {renderControl({
            page,
            className: cn(baseClass, page === currentPage ? activeClass : inactiveClass),
            children: page,
            ariaCurrent: page === currentPage ? 'page' : undefined,
          })}
        </Fragment>
      ))}

      {model.showLastPage ? (
        <>
          {model.hasTrailingEllipsis ? <span className="px-2 text-gray-400">...</span> : null}
          {renderControl({
            page: totalPages,
            className: `${baseClass} ${inactiveClass}`,
            children: totalPages,
          })}
        </>
      ) : null}

      {model.hasNext && model.nextPage !== null
        ? renderControl({
            page: model.nextPage,
            className: navClass,
            children: nextArrow,
            ariaLabel: '次のページ',
          })
        : null}
    </nav>
  )
}
