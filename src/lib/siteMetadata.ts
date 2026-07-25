export const SITE_URL = 'https://yunosukeyoshino.com'
export const SITE_NAME = 'Yunosuke Yoshino Portfolio'
export const DEFAULT_SITE_DESCRIPTION =
  'フロントエンドエンジニア Yunosuke Yoshinoのポートフォリオサイト。React, Astro, TypeScriptを軸にしたWeb開発に加え、ClaudeやCodex、Dify、n8nを組み合わせたAIエージェンティックコーディングで開発と業務改善を推進しています。'
export const DEFAULT_OG_IMAGE_URL = `${SITE_URL}/assets/og-image.png`
export const GA_TRACKING_ID = 'G-7C1W0FTJR6'
export const GOOGLE_SITE_VERIFICATION = 'eP52H3GTHVunNESnXhZ0XTxke4SSzgyVgyCbOQFCFcc'

export function toCanonicalUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const pathname = normalizedPath.endsWith('/') ? normalizedPath : `${normalizedPath}/`
  return `${SITE_URL}${pathname}`
}
