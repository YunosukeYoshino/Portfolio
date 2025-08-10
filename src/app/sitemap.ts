import type { MetadataRoute } from 'next'
import { getBlogs } from '@/lib/microcms'

export const dynamic = 'force-static'
export const revalidate = 86400 // 24 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://yunosukeyoshino.com'

  // Static pages
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/article`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  try {
    // Get all blog posts for dynamic pages
    const blogsResponse = await getBlogs({
      fields: 'id,publishedAt,updatedAt',
      limit: 1000,
    })

    // Add blog post pages
    const blogRoutes = blogsResponse.contents.map(blog => ({
      url: `${baseUrl}/article/${blog.id}`,
      lastModified: new Date(blog.updatedAt || blog.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    // Add pagination pages if we have more than 12 posts
    const totalPages = Math.ceil(blogsResponse.totalCount / 12)
    const paginationRoutes = []
    for (let page = 1; page <= totalPages; page++) {
      if (page > 1) {
        // Skip page 1 as it's the same as /article
        paginationRoutes.push({
          url: `${baseUrl}/article/page/${page}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.5,
        })
      }
    }

    return [...routes, ...blogRoutes, ...paginationRoutes]
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: Required for debugging API errors during build
    console.error('Error generating sitemap:', error)
    // Return at least static routes if blog fetching fails
    return routes
  }
}
