import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { getExternalLinkProps } from '@/lib/link'
import { createDirectionalViewTransition } from '@/lib/viewTransitions'

interface ArticleLinkProps {
  externalUrl?: string
  slug: string
  className?: string
  children: ReactNode
}

/**
 * Article link component that automatically opens external links in a new tab.
 * Internal articles use TanStack Router's Link, external ones use a plain anchor.
 */
export function ArticleLink({ externalUrl, slug, className, children }: ArticleLinkProps) {
  if (externalUrl) {
    return (
      <a href={externalUrl} {...getExternalLinkProps(externalUrl)} className={className}>
        {children}
      </a>
    )
  }

  return (
    <Link
      to="/article/$slug/"
      params={{ slug }}
      viewTransition={createDirectionalViewTransition('forward', ['article-open'])}
      className={className}
    >
      {children}
    </Link>
  )
}
