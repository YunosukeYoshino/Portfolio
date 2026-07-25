/**
 * Type Definitions
 *
 * 後方互換性のため、Domain層のエンティティを再エクスポート
 * 新規コードでは @/domain/entities から直接インポートを推奨
 */

import type { Blog } from '@/domain/entities/blog'

// Re-export from domain layer for backward compatibility
export type {
  Blog,
  BlogCategory,
  BlogEyecatch,
  BlogResponse,
} from '@/domain/entities/blog'

/**
 * 記事フィードのソース種別。新しい記事ソースを足すときはここを拡張する。
 */
export type ArticleSource = 'microcms'

/**
 * 記事フィードの1項目。
 * `Blog` のうちフィード表示に不要な本文・管理日時を除外し、
 * ソース判別と外部リンク先を付与した形状。
 * `category` / `eyecatch` は `Blog` と同じ型を再利用し、構造の重複を避ける。
 */
export type ArticleFeedItem = Omit<Blog, 'createdAt' | 'updatedAt' | 'revisedAt' | 'content'> & {
  source: ArticleSource
  externalUrl?: string
}
