/**
 * Mock Data for Development
 *
 * Infrastructure層: 開発用モックデータ
 * 本番環境では使用されない
 */

import type { Blog, BlogResponse } from '@/domain/entities/blog'

/**
 * モック用ブログ記事を生成
 */
export const createMockBlog = (contentId: string): Blog => ({
  id: contentId,
  title: 'Development Blog Post',
  content:
    '<p>This is a mock blog post for development purposes. Configure your microCMS credentials in .env.local to see real content.</p>',
  eyecatch: {
    url: '/assets/images/noise.png',
    width: 1200,
    height: 630,
    alt: 'Mock blog image',
  },
  category: {
    id: 'development',
    name: 'Development',
  },
  publishedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  revisedAt: new Date().toISOString(),
})

/**
 * モック用ブログID一覧
 */
export const mockBlogIds: readonly string[] = ['sample-blog-1', 'sample-blog-2', 'sample-blog-3']

/**
 * 空のブログレスポンスを生成
 */
export const createEmptyBlogResponse = (offset: number = 0, limit: number = 10): BlogResponse => ({
  contents: [],
  totalCount: 0,
  offset,
  limit,
})
