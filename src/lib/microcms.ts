import type { Blog, BlogResponse } from '@/types'

// Check if we're in development with placeholder credentials
const isDevelopment = process.env.NODE_ENV === 'development'
const hasPlaceholderCredentials =
  process.env.MICROCMS_SERVICE_DOMAIN === 'placeholder-domain' ||
  process.env.MICROCMS_API_KEY === 'placeholder-api-key'

if (!process.env.MICROCMS_SERVICE_DOMAIN) {
  throw new Error('MICROCMS_SERVICE_DOMAIN is required')
}

if (!process.env.MICROCMS_API_KEY) {
  throw new Error('MICROCMS_API_KEY is required')
}

// Direct API configuration
const API_CONFIG = {
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
  baseUrl: `https://${process.env.MICROCMS_SERVICE_DOMAIN}/api/v1`,
}

console.log('microCMS config:', {
  serviceDomain: API_CONFIG.serviceDomain,
  apiKeyLength: API_CONFIG.apiKey?.length || 0,
  baseUrl: API_CONFIG.baseUrl,
})

// Helper function to make API requests
const apiRequest = async <T>(
  endpoint: string,
  params?: Record<string, string | number>
): Promise<T> => {
  const url = new URL(`${API_CONFIG.baseUrl}/${endpoint}`)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value))
      }
    })
  }

  const response = await fetch(url.toString(), {
    headers: {
      'X-MICROCMS-API-KEY': API_CONFIG.apiKey,
    },
  })

  if (!response.ok) {
    throw new Error(`microCMS API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// Helper function to check if we should use mock data
const shouldUseMockData = (): boolean => {
  return isDevelopment && hasPlaceholderCredentials
}

// API functions with proper error handling and development fallbacks
export const getBlogs = async (
  queries?: Record<string, string | number>
): Promise<BlogResponse> => {
  // Return mock data immediately if using placeholder credentials
  if (shouldUseMockData()) {
    console.warn('Using mock blog data for development (placeholder credentials detected)')
    return {
      contents: [],
      totalCount: 0,
      offset: Number(queries?.offset) || 0,
      limit: Number(queries?.limit) || 10,
    }
  }

  try {
    console.log('Attempting to fetch blogs with queries:', queries)
    const response = await apiRequest<BlogResponse>('blogs', queries)
    console.log('Blog fetch successful:', response.totalCount, 'items')
    return response
  } catch (error) {
    console.error('Error fetching blogs:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : 'Error',
      stack: error instanceof Error ? error.stack : undefined,
    })

    // Return mock data in development mode when API fails
    if (isDevelopment) {
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
}

export const getBlogDetail = async (
  contentId: string,
  queries?: Record<string, string | number>
): Promise<Blog> => {
  // Return mock data immediately if using placeholder credentials
  if (shouldUseMockData()) {
    console.warn(`Using mock blog data for development: ${contentId}`)
    return {
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
    }
  }

  try {
    const response = await apiRequest<Blog>(`blogs/${contentId}`, queries)
    return response
  } catch (error) {
    console.error('Error fetching blog detail:', error)

    // Return mock blog data in development mode when API fails
    if (isDevelopment) {
      console.warn(`Returning mock blog data for development: ${contentId}`)
      return {
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
      }
    }

    throw new Error(`Failed to fetch blog: ${contentId}`)
  }
}

// Helper function for pagination
export const getPaginatedBlogs = async (
  page: number = 1,
  limit: number = 6
): Promise<BlogResponse> => {
  const offset = (page - 1) * limit
  return getBlogs({
    offset,
    limit,
    orders: '-publishedAt',
  })
}

// Helper function to get all blog IDs for static generation
export const getAllBlogIds = async (): Promise<string[]> => {
  // Return mock data immediately if using placeholder credentials
  if (shouldUseMockData()) {
    console.warn('Using mock blog IDs for development (placeholder credentials detected)')
    return ['sample-blog-1', 'sample-blog-2', 'sample-blog-3']
  }

  try {
    const response = await getBlogs({
      fields: 'id',
      limit: 1000, // Adjust based on your needs
    })
    return response.contents.map((blog) => blog.id)
  } catch (error) {
    console.error('Error fetching blog IDs:', error)

    // Return mock blog IDs in development mode
    if (isDevelopment) {
      console.warn('Returning mock blog IDs for development (API error)')
      return ['sample-blog-1', 'sample-blog-2', 'sample-blog-3']
    }

    return []
  }
}
