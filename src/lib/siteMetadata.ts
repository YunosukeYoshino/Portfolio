export const SITE_URL = 'https://yunosukeyoshino.com'
export const SITE_NAME = 'Yunosuke Yoshino Portfolio'
export const DEFAULT_SITE_TITLE = 'Yunosuke Yoshino｜Portfolio'
export const DEFAULT_SITE_DESCRIPTION =
  'フロントエンドエンジニア Yunosuke Yoshinoのポートフォリオサイト。React, Next.js, TypeScriptを専門とし、ECサイトを中心としたモダンなWeb開発と技術記事を発信しています。'
export const DEFAULT_OG_IMAGE_URL = `${SITE_URL}/assets/og-image.png`
export const GA_TRACKING_ID = 'G-7C1W0FTJR6'

export interface StandardHeadOptions {
  readonly title: string
  readonly path: string
  readonly description?: string
  readonly image?: string
  readonly ogType?: 'website' | 'article'
  readonly robots?: string
}

export function toCanonicalUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const pathname = normalizedPath.endsWith('/') ? normalizedPath : `${normalizedPath}/`
  return `${SITE_URL}${pathname}`
}

export function createStandardHead({
  title,
  path,
  description = DEFAULT_SITE_DESCRIPTION,
  image = DEFAULT_OG_IMAGE_URL,
  ogType = 'website',
  robots,
}: StandardHeadOptions) {
  const canonicalUrl = toCanonicalUrl(path)

  return {
    meta: [
      { title },
      { name: 'description', content: description },
      ...(robots ? [{ name: 'robots', content: robots }] : []),
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: ogType },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:image', content: image },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ],
    links: [{ rel: 'canonical', href: canonicalUrl }],
  }
}
