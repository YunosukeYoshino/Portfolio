/**
 * Dependency Injection Container
 *
 * Infrastructure層: 依存関係の組み立て
 * 外側で内側の依存を解決する
 */

import type { BlogRepository } from '@/domain/repositories/blogRepository'
import { GetAllBlogIdsUseCase, GetBlogDetailUseCase, GetBlogsUseCase } from '@/usecases/blog'
import { MicroCMSBlogRepository, MicroCMSClient } from '../microcms'

/**
 * シングルトンインスタンス
 */
const microCMSClient = new MicroCMSClient()
const blogRepository: BlogRepository = new MicroCMSBlogRepository(microCMSClient)

/**
 * UseCase インスタンス
 */
export const useCases = {
  getBlogs: new GetBlogsUseCase(blogRepository),
  getBlogDetail: new GetBlogDetailUseCase(blogRepository),
  getAllBlogIds: new GetAllBlogIdsUseCase(blogRepository),
} as const

/**
 * Repository インスタンス（テスト用に公開）
 */
export const repositories = {
  blog: blogRepository,
} as const

/**
 * テスト用: カスタムリポジトリでUseCaseを生成
 */
export const createUseCases = (customBlogRepository: BlogRepository) => ({
  getBlogs: new GetBlogsUseCase(customBlogRepository),
  getBlogDetail: new GetBlogDetailUseCase(customBlogRepository),
  getAllBlogIds: new GetAllBlogIdsUseCase(customBlogRepository),
})
