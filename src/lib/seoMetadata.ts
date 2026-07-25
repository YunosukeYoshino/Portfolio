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

/**
 * `seo-metadata.json` のビルド時生成キャッシュは { [articleId]: SeoEntry } の Record。
 * 取得失敗時は空キャッシュへフォールバックさせるため、object かどうかだけ緩く検証する。
 */
function isSeoMetadataCache(value: unknown): value is SeoMetadataCache {
  return typeof value === 'object' && value !== null
}

function loadCache(): SeoMetadataCache {
  if (cache) return cache

  try {
    // Vite resolves this glob at build time; the JSON default export is untyped,
    // so narrow with isSeoMetadataCache before using it as a cache.
    const modules = import.meta.glob('../data/seo-metadata.json', {
      eager: true,
      import: 'default',
    })
    const raw = Object.values(modules)[0]
    cache = isSeoMetadataCache(raw) ? raw : {}
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
