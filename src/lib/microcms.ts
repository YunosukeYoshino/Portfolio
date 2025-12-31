import { createServerFn } from '@tanstack/react-start'
import type { Blog, BlogResponse } from '@/types'

// Lazy configuration getter for server-side environment variables
const getApiConfig = () => {
  const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN
  const apiKey = process.env.MICROCMS_API_KEY

  const isDevelopment = import.meta.env.DEV
  const hasPlaceholderCredentials =
    serviceDomain === 'placeholder-domain' || apiKey === 'placeholder-api-key'

  if (!serviceDomain && !isDevelopment) {
    throw new Error('MICROCMS_SERVICE_DOMAIN is required')
  }

  if (!apiKey && !isDevelopment) {
    throw new Error('MICROCMS_API_KEY is required')
  }

  return {
    serviceDomain: serviceDomain || 'placeholder-domain',
    apiKey: apiKey || 'placeholder-api-key',
    baseUrl: serviceDomain ? `https://${serviceDomain}/api/v1` : '',
    isDevelopment,
    hasPlaceholderCredentials: !serviceDomain || !apiKey || hasPlaceholderCredentials,
  }
}

// Helper function to make API requests
const apiRequest = async <T>(
  endpoint: string,
  params?: Record<string, string | number>
): Promise<T> => {
  const config = getApiConfig()
  const url = new URL(`${config.baseUrl}/${endpoint}`)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value))
      }
    })
  }

  const response = await fetch(url.toString(), {
    headers: {
      'X-MICROCMS-API-KEY': config.apiKey,
    },
  })

  if (!response.ok) {
    throw new Error(`microCMS API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// Helper function to check if we should use mock data
const shouldUseMockData = (): boolean => {
  const config = getApiConfig()
  return config.isDevelopment && config.hasPlaceholderCredentials
}

// Mock data for development
const createMockBlog = (contentId: string): Blog => ({
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

// Server function for fetching blogs list
export const getBlogs = createServerFn({ method: 'GET' })
  .inputValidator((data: { queries?: Record<string, string | number> }) => data)
  .handler(async ({ data }): Promise<BlogResponse> => {
    const { queries } = data

    // Return mock data immediately if using placeholder credentials
    if (shouldUseMockData()) {
      // biome-ignore lint/suspicious/noConsole: Development warning for mock data usage
      console.warn('Using mock blog data for development (placeholder credentials detected)')
      return {
        contents: [],
        totalCount: 0,
        offset: Number(queries?.offset) || 0,
        limit: Number(queries?.limit) || 10,
      }
    }

    try {
      // biome-ignore lint/suspicious/noConsole: Development logging for API requests
      console.log('Attempting to fetch blogs with queries:', queries)
      const response = await apiRequest<BlogResponse>('blogs', queries)
      // biome-ignore lint/suspicious/noConsole: Development logging for successful API responses
      console.log('Blog fetch successful:', response.totalCount, 'items')
      return response
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: Development error logging for debugging
      console.error('Error fetching blogs:', error)

      // Return mock data in development mode when API fails
      if (import.meta.env.DEV) {
        // biome-ignore lint/suspicious/noConsole: Development warning for fallback mock data
        console.warn('Returning mock blog data for development (API error)')
        return {
          contents: [],
          totalCount: 0,
          offset: Number(queries?.offset) || 0,
          limit: Number(queries?.limit) || 10,
        }
      }

      throw new Error('Failed to fetch blogs')
    }
  })

// Server function for fetching blog detail
export const getBlogDetail = createServerFn({ method: 'GET' })
  .inputValidator((data: { contentId: string; queries?: Record<string, string | number> }) => data)
  .handler(async ({ data }): Promise<Blog> => {
    const { contentId, queries } = data

    // Return mock data immediately if using placeholder credentials
    if (shouldUseMockData()) {
      // biome-ignore lint/suspicious/noConsole: Development warning for mock blog data
      console.warn(`Using mock blog data for development: ${contentId}`)
      return createMockBlog(contentId)
    }

    try {
      const response = await apiRequest<Blog>(`blogs/${contentId}`, queries)
      return response
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: Development error logging for blog detail fetch
      console.error('Error fetching blog detail:', error)

      // Return mock blog data in development mode when API fails
      if (getApiConfig().isDevelopment) {
        // biome-ignore lint/suspicious/noConsole: Development warning for fallback mock blog data
        console.warn(`Returning mock blog data for development: ${contentId}`)
        return createMockBlog(contentId)
      }

      throw new Error(`Failed to fetch blog: ${contentId}`)
    }
  })

// Helper function for pagination
export const getPaginatedBlogs = async (
  page: number = 1,
  limit: number = 6
): Promise<BlogResponse> => {
  const offset = (page - 1) * limit
  return getBlogs({
    data: {
      queries: {
        offset,
        limit,
        orders: '-publishedAt',
      },
    },
  })
}

// Server function to get all blog IDs for static generation
export const getAllBlogIds = createServerFn({ method: 'GET' }).handler(
  async (): Promise<string[]> => {
    // Return mock data immediately if using placeholder credentials
    if (shouldUseMockData()) {
      // biome-ignore lint/suspicious/noConsole: Development warning for mock blog IDs
      console.warn('Using mock blog IDs for development (placeholder credentials detected)')
      return ['sample-blog-1', 'sample-blog-2', 'sample-blog-3']
    }

    try {
      const response = await getBlogs({
        data: {
          queries: {
            fields: 'id',
            limit: 1000,
          },
        },
      })
      return response.contents.map((blog: Blog) => blog.id)
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: Development error logging for blog IDs fetch
      console.error('Error fetching blog IDs:', error)

      // Return mock blog IDs in development mode
      if (import.meta.env.DEV) {
        // biome-ignore lint/suspicious/noConsole: Development warning for fallback mock blog IDs
        console.warn('Returning mock blog IDs for development (API error)')
        return ['sample-blog-1', 'sample-blog-2', 'sample-blog-3']
      }

      return []
    }
  }
)
