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

export function getCurrentYear(): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: TOKYO_TIME_ZONE,
    year: 'numeric',
  }).format(new Date())
}

export function generatePageTitle(title: string): string {
  return `${title} | Yunosuke Yoshino Portfolio`
}

export function generateMetadata({
  title,
  description,
  url,
  image,
}: {
  title: string
  description: string
  url?: string
  image?: string
}) {
  const siteUrl = process.env.SITE_URL || 'https://yunosukeyoshino.com'
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl
  const ogImage = image || `${siteUrl}/assets/images/og-image.jpg`

  return {
    title: generatePageTitle(title),
    description,
    openGraph: {
      title: generatePageTitle(title),
      description,
      url: fullUrl,
      siteName: 'Yunosuke Yoshino Portfolio',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'ja_JP',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: generatePageTitle(title),
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}
