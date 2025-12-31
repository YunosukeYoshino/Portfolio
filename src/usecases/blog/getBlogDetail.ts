/**
 * GetBlogDetail UseCase
 *
 * UseCase層: ビジネスロジック
 * BlogRepository Port のみに依存（microCMSを知らない）
 */

import type { Blog } from '@/domain/entities/blog'
import type { BlogQueries, BlogRepository } from '@/domain/repositories/blogRepository'

export class GetBlogDetailUseCase {
  constructor(private readonly repository: BlogRepository) {}

  /**
   * IDでブログ記事を取得
   */
  async execute(id: string, queries?: BlogQueries): Promise<Blog> {
    return this.repository.findById(id, queries)
  }
}
