/**
 * microCMS Blog Repository Implementation
 *
 * Infrastructure層: BlogRepository Portの具体実装
 * Domain層のインターフェースを実装し、microCMS固有の詳細をカプセル化
 */

import type { Blog, BlogResponse } from '@/domain/entities/blog'
import type { BlogQueries, BlogRepository } from '@/domain/repositories/blogRepository'
import type { MicroCMSClient } from './client'
import { createEmptyBlogResponse, createMockBlog, mockBlogIds } from './mock'

/**
 * microCMS用BlogRepository実装
 * Portを実装し、外部CMS固有の詳細を隠蔽
 */
export class MicroCMSBlogRepository implements BlogRepository {
  constructor(private readonly client: MicroCMSClient) {}

  async findAll(queries?: BlogQueries): Promise<BlogResponse> {
    if (this.client.shouldUseMock()) {
      this.logDevWarning('Using mock blog data (placeholder credentials)')
      return createEmptyBlogResponse(queries?.offset, queries?.limit)
    }

    try {
      this.logDev('Fetching blogs with queries:', queries)
      const response = await this.client.request<BlogResponse>('blogs', queries)
      this.logDev('Blog fetch successful:', response.totalCount, 'items')
      return response
    } catch (error) {
      this.logError('Error fetching blogs:', error)

      if (this.client.isDevelopment()) {
        this.logDevWarning('Returning mock blog data (API error)')
        return createEmptyBlogResponse(queries?.offset, queries?.limit)
      }

      throw new Error('Failed to fetch blogs')
    }
  }

  async findById(id: string, queries?: BlogQueries): Promise<Blog> {
    if (this.client.shouldUseMock()) {
      this.logDevWarning(`Using mock blog data: ${id}`)
      return createMockBlog(id)
    }

    try {
      return await this.client.request<Blog>(`blogs/${id}`, queries)
    } catch (error) {
      this.logError('Error fetching blog detail:', error)

      if (this.client.isDevelopment()) {
        this.logDevWarning(`Returning mock blog data: ${id}`)
        return createMockBlog(id)
      }

      throw new Error(`Failed to fetch blog: ${id}`)
    }
  }

  async getAllIds(): Promise<readonly string[]> {
    if (this.client.shouldUseMock()) {
      this.logDevWarning('Using mock blog IDs (placeholder credentials)')
      return mockBlogIds
    }

    try {
      const response = await this.findAll({ fields: 'id', limit: 1000 })
      return response.contents.map((blog) => blog.id)
    } catch (error) {
      this.logError('Error fetching blog IDs:', error)

      if (this.client.isDevelopment()) {
        this.logDevWarning('Returning mock blog IDs (API error)')
        return mockBlogIds
      }

      return []
    }
  }

  // biome-ignore lint/suspicious/noExplicitAny: Development logging accepts any type
  private logDev(...args: any[]): void {
    // biome-ignore lint/suspicious/noConsole: Development logging
    console.log(...args)
  }

  // biome-ignore lint/suspicious/noExplicitAny: Development warning accepts any type
  private logDevWarning(...args: any[]): void {
    // biome-ignore lint/suspicious/noConsole: Development warning
    console.warn(...args)
  }

  // biome-ignore lint/suspicious/noExplicitAny: Error logging accepts any type
  private logError(...args: any[]): void {
    // biome-ignore lint/suspicious/noConsole: Error logging
    console.error(...args)
  }
}
