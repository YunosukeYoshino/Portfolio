/**
 * GetBlogs UseCase
 *
 * UseCase層: ビジネスロジック
 * BlogRepository Port のみに依存（microCMSを知らない）
 */

import type { BlogResponse } from '@/domain/entities/blog'
import type { BlogQueries, BlogRepository } from '@/domain/repositories/blogRepository'

export class GetBlogsUseCase {
  constructor(private readonly repository: BlogRepository) {}

  /**
   * ブログ記事一覧を取得
   */
  async execute(queries?: BlogQueries): Promise<BlogResponse> {
    return this.repository.findAll(queries)
  }

  /**
   * ページネーション付きでブログ記事を取得
   */
  async paginated(page: number = 1, limit: number = 6): Promise<BlogResponse> {
    const offset = (page - 1) * limit
    return this.repository.findAll({
      offset,
      limit,
      orders: '-publishedAt',
    })
  }
}
