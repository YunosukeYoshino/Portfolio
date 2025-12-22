// Blog types for microCMS
export interface BlogCategory {
  id: string
  name: string
}

export interface BlogEyecatch {
  url: string
  width: number
  height: number
  alt: string
}

export interface Blog {
  id: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  revisedAt: string
  title: string
  content: string
  category: BlogCategory
  eyecatch: BlogEyecatch
}

export interface BlogResponse {
  totalCount: number
  offset: number
  limit: number
  contents: Blog[]
}

// Component props types
export interface BlogListProps {
  limit?: number
  column?: number
  page?: number
}

// Page props types
export interface BlogPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export interface BlogListPageProps {
  params: Promise<{ page: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
