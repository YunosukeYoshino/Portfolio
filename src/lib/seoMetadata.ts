/**
 * SEO Metadata Cache Reader
 *
 * ビルド時にseo-metadata.jsonからSEO最適化されたtitle/descriptionを読み込む
 * CLIスクリプト (scripts/seo-optimize.ts) で生成されたキャッシュを参照
 */

interface SeoEntry {
  readonly seoTitle: string
  readonly seoDescription: string
  readonly originalTitle: string
  readonly contentHash: string
  readonly generatedAt: string
}

type SeoMetadataCache = Record<string, SeoEntry>

let cache: SeoMetadataCache | null = null

function loadCache(): SeoMetadataCache {
  if (cache) return cache

  try {
    // Vite handles JSON imports at build time
    // Dynamic import not needed since this is resolved statically
    const data = import.meta.glob('../data/seo-metadata.json', { eager: true })
    const moduleKey = Object.keys(data)[0]
    if (moduleKey && data[moduleKey]) {
      cache = (data[moduleKey] as { default: SeoMetadataCache }).default ?? {}
    } else {
      cache = {}
    }
  } catch {
    cache = {}
  }

  return cache ?? {}
}

/**
 * 記事IDに対応するSEOメタデータを取得
 * キャッシュに存在しない場合はnullを返す
 */
export function getSeoMetadata(
  articleId: string
): { readonly seoTitle: string; readonly seoDescription: string } | null {
  const metadata = loadCache()
  const entry = metadata[articleId]

  if (!entry) return null

  return {
    seoTitle: entry.seoTitle,
    seoDescription: entry.seoDescription,
  }
}

/**
 * 記事のSEOタイトルを取得 (フォールバック付き)
 */
export function getSeoTitle(articleId: string, fallbackTitle: string): string {
  const metadata = getSeoMetadata(articleId)
  return metadata?.seoTitle ?? fallbackTitle
}

/**
 * 記事のSEO descriptionを取得 (フォールバック付き)
 */
export function getSeoDescription(articleId: string, fallbackContent: string): string {
  const metadata = getSeoMetadata(articleId)

  if (metadata?.seoDescription) return metadata.seoDescription

  return fallbackContent
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160)
}
