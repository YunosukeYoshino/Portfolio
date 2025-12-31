/**
 * GetAllBlogIds UseCase
 *
 * UseCase層: ビジネスロジック
 * 静的生成用に全ブログIDを取得
 */

import type { BlogRepository } from '@/domain/repositories/blogRepository'

export class GetAllBlogIdsUseCase {
  constructor(private readonly repository: BlogRepository) {}

  /**
   * 全てのブログIDを取得（静的生成用）
   */
  async execute(): Promise<readonly string[]> {
    return this.repository.getAllIds()
  }
}
