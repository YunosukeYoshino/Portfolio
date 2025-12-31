/**
 * microCMS API Facade
 *
 * 後方互換性のためのファサード層
 * 既存のAPIを維持しながら、内部でClean Architectureを使用
 *
 * 新規コードでは useCases を直接使用することを推奨:
 * import { useCases } from '@/infrastructure/di'
 */

import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import type { Blog, BlogResponse } from '@/domain/entities/blog'
import { useCases } from '@/infrastructure/di'

// Re-export types for backward compatibility
export type { Blog, BlogResponse } from '@/domain/entities/blog'

// Zod schemas for input validation
const queriesSchema = z.record(z.string(), z.union([z.string(), z.number()])).optional()

const getBlogsInputSchema = z.object({
  queries: queriesSchema,
})

const getBlogDetailInputSchema = z.object({
  contentId: z
    .string()
    .min(1, 'contentId is required')
    .regex(/^[a-zA-Z0-9_-]+$/, 'contentId contains invalid characters'),
  queries: queriesSchema,
})

/**
 * Server function for fetching blogs list
 * @deprecated Use useCases.getBlogs.execute() directly
 */
export const getBlogs = createServerFn({ method: 'GET' })
  .inputValidator((data: unknown) => getBlogsInputSchema.parse(data))
  .handler(async ({ data }): Promise<BlogResponse> => {
    const { queries } = data
    return useCases.getBlogs.execute(queries)
  })

/**
 * Server function for fetching blog detail
 * @deprecated Use useCases.getBlogDetail.execute() directly
 */
export const getBlogDetail = createServerFn({ method: 'GET' })
  .inputValidator((data: unknown) => getBlogDetailInputSchema.parse(data))
  .handler(async ({ data }): Promise<Blog> => {
    const { contentId, queries } = data
    return useCases.getBlogDetail.execute(contentId, queries)
  })

/**
 * Helper function for pagination
 * @deprecated Use useCases.getBlogs.paginated() directly
 */
export const getPaginatedBlogs = async (
  page: number = 1,
  limit: number = 6
): Promise<BlogResponse> => {
  return useCases.getBlogs.paginated(page, limit)
}

/**
 * Server function to get all blog IDs for static generation
 * @deprecated Use useCases.getAllBlogIds.execute() directly
 */
export const getAllBlogIds = createServerFn({ method: 'GET' }).handler(
  async (): Promise<string[]> => {
    const ids = await useCases.getAllBlogIds.execute()
    return [...ids] // Convert readonly array to mutable for backward compatibility
  }
)
