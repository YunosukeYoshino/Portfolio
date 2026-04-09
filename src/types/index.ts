/**
 * Type Definitions
 *
 * 後方互換性のため、Domain層のエンティティを再エクスポート
 * 新規コードでは @/domain/entities から直接インポートを推奨
 */

// Re-export from domain layer for backward compatibility
export type {
  Blog,
  BlogCategory,
  BlogEyecatch,
  BlogResponse,
} from '@/domain/entities/blog'

export interface ArticleFeedItem {
  id: string
  title: string
  publishedAt: string
  category: {
    id: string
    name: string
  }
  eyecatch: {
    url: string
    width: number
    height: number
    alt: string
  }
  source: 'microcms' | 'zenn' | 'qiita'
  externalUrl?: string
}
