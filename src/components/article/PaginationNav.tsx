import { Link } from '@tanstack/react-router'
import { Fragment, type ReactNode } from 'react'
import { buildPaginationModel } from '@/lib/pagination'
import { cn } from '@/lib/utils'
import { createDirectionalViewTransition } from '@/lib/viewTransitions'

interface BasePaginationNavProps {
  readonly currentPage: number
  readonly totalPages: number
  readonly ariaLabel: string
}

type LinkPaginationNavProps = BasePaginationNavProps & {
  readonly mode: 'link'
  readonly getHref: (page: number) => string
  readonly onPageChange?: never
}

type ButtonPaginationNavProps = BasePaginationNavProps & {
  readonly mode: 'button'
  readonly onPageChange: (page: number) => void
  readonly getHref?: never
}

type PaginationNavProps = LinkPaginationNavProps | ButtonPaginationNavProps

interface PaginationControlProps {
  readonly page: number
  readonly className: string
  readonly children: ReactNode
  readonly ariaCurrent?: 'page'
  readonly ariaLabel?: string
}

const activeClass = 'text-ink underline underline-offset-4'
const inactiveClass = 'text-ink-label hover:text-ink'
const baseClass = 'font-mono text-[13px] transition-colors'
const navClass = 'font-mono text-[13px] text-ink-label transition-colors hover:text-ink'

const prevArrow = <span aria-hidden="true">←</span>
const nextArrow = <span aria-hidden="true">→</span>

export default function PaginationNav(props: PaginationNavProps) {
  const { currentPage, totalPages, ariaLabel } = props
  const model = buildPaginationModel({ currentPage, totalPages })

  const renderNav = (renderControl: (props: PaginationControlProps) => ReactNode) => (
    <nav
      className="flex items-center justify-center gap-4 border-t border-rule pt-8"
      aria-label={ariaLabel}
    >
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
          {model.hasLeadingEllipsis ? <span className="meta-mono">…</span> : null}
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
          {model.hasTrailingEllipsis ? <span className="meta-mono">…</span> : null}
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

  if (props.mode === 'link') {
    const getHref = props.getHref

    return renderNav(function LinkControl({
      page,
      className,
      children,
      ariaCurrent,
      ariaLabel,
    }: PaginationControlProps) {
      return (
        <Link
          to={getHref(page)}
          viewTransition={createDirectionalViewTransition(page > currentPage ? 'forward' : 'back', [
            'article-pagination',
          ])}
          className={className}
          aria-current={ariaCurrent}
          aria-label={ariaLabel}
        >
          {children}
        </Link>
      )
    })
  }

  const onPageChange = props.onPageChange

  return renderNav(function ButtonControl({
    page,
    className,
    children,
    ariaCurrent,
    ariaLabel,
  }: PaginationControlProps) {
    return (
      <button
        type="button"
        onClick={() => onPageChange(page)}
        className={className}
        aria-current={ariaCurrent}
        aria-label={ariaLabel}
      >
        {children}
      </button>
    )
  })
}
