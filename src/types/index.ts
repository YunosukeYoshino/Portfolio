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

// Component props types
export interface BlogListProps {
  limit?: number
  column?: number
  page?: number
}

export interface SEOProps {
  title: string
  description: string
  url?: string
  image?: string
  type?: 'website' | 'article'
}

// Page props types
export interface BlogPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export interface BlogListPageProps {
  params: Promise<{ page: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Utility types
export type Route<T extends string = string> = T
