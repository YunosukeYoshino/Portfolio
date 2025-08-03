import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
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
  const siteUrl = process.env.SITE_URL || 'https://www.yunosukeyoshino.com'
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
