import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const TOKYO_TIME_ZONE = 'Asia/Tokyo'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function getTokyoDateParts(dateInput: string | Date) {
  const formatter = new Intl.DateTimeFormat('ja-JP', {
    timeZone: TOKYO_TIME_ZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  })
  const parts = formatter.formatToParts(new Date(dateInput))

  const year = parts.find((part) => part.type === 'year')?.value ?? ''
  const month = parts.find((part) => part.type === 'month')?.value ?? ''
  const day = parts.find((part) => part.type === 'day')?.value ?? ''

  return { year, month, day }
}

export function formatDate(dateString: string): string {
  const { year, month, day } = getTokyoDateParts(dateString)
  return `${year}年${month}月${day}日`
}

export function formatDateCompact(dateString: string): string {
  const { year, month, day } = getTokyoDateParts(dateString)
  return `${year}.${month.padStart(2, '0')}.${day.padStart(2, '0')}`
}

const editorialDateFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: TOKYO_TIME_ZONE,
  year: 'numeric',
  month: 'short',
})

/** Trailing meta for hairline rows, e.g. "Nov 2025". Empty for an unparsable date. */
export function formatDateEditorial(dateString: string): string {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return ''
  return editorialDateFormatter.format(date)
}

export function getCurrentYear(): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: TOKYO_TIME_ZONE,
    year: 'numeric',
  }).format(new Date())
}
