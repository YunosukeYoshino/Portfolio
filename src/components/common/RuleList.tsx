import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface RuleListProps {
  readonly children: ReactNode
  readonly className?: string
}

/**
 * Hairline-separated list. Each child renders its own top rule via `.rule-row`,
 * so the list only has to cap the bottom edge.
 */
export function RuleList({ children, className }: RuleListProps) {
  return (
    <div className={cn(className)}>
      {children}
      <div className="border-t border-rule" />
    </div>
  )
}

interface RuleRowBodyProps {
  readonly title: ReactNode
  readonly description?: ReactNode
  readonly meta?: ReactNode
}

/** The two grid cells of a `.rule-row`: title (+ description) and trailing meta. */
export function RuleRowBody({ title, description, meta }: RuleRowBodyProps) {
  return (
    <>
      <div>
        <span className="text-base font-medium">{title}</span>
        {description ? <span className="text-[15px] text-ink-soft"> — {description}</span> : null}
      </div>
      {meta ? <span className="meta-mono">{meta}</span> : null}
    </>
  )
}
