import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Breadcrumb from '@/components/Breadcrumb'
import CodeHighlight from '@/components/CodeHighlight'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import JsonLd, {
  createArticleSchema,
  createBreadcrumbSchema,
} from '@/components/JsonLd'
import { getAllBlogIds, getBlogDetail } from '@/lib/microcms'
import { generateMetadata as createMetadata, formatDate } from '@/lib/utils'
import type { BlogPageProps } from '@/types'

// Generate static params for pre-rendering
export async function generateStaticParams() {
  try {
    const blogIds = await getAllBlogIds()
    return blogIds.map(id => ({
      slug: id,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const blog = await getBlogDetail(slug)

    return {
      ...createMetadata({
        title: blog.title,
        description: blog.content.replace(/<[^>]*>/g, '').slice(0, 160),
        url: `/article/${blog.id}`,
      }),
      alternates: {
        canonical: `https://yunosukeyoshino.com/article/${blog.id}`,
      },
    }
  } catch {
    return createMetadata({
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
    })
  }
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  try {
    const { slug } = await params
    const blog = await getBlogDetail(slug)

    const breadcrumbItems = [
      { name: 'ホーム', url: '/' },
      { name: '記事一覧', url: '/article' },
      { name: blog.title, url: `/article/${blog.id}` },
    ]

    const articleSchema = createArticleSchema(blog)
    const breadcrumbSchema = createBreadcrumbSchema([
      { name: 'ホーム', url: 'https://yunosukeyoshino.com' },
      { name: '記事一覧', url: 'https://yunosukeyoshino.com/article' },
      {
        name: blog.title,
        url: `https://yunosukeyoshino.com/article/${blog.id}`,
      },
    ])

    return (
      <>
        <JsonLd data={articleSchema} />
        <JsonLd data={breadcrumbSchema} />
        <Header />
        <main className="l-main bg-white">
          <article className="py-24 md:py-32">
            <div className="container-custom">
              {/* Breadcrumb */}
              <Breadcrumb items={breadcrumbItems} className="mb-8" />
              
              {/* Article Header */}
              <header className="mb-16">
                <div className="mb-8 flex items-center justify-between">
                  <span className="bg-gray-100 px-4 py-2 text-sm font-medium uppercase tracking-wide text-gray-700">
                    {blog.category.name}
                  </span>
                  <time
                    dateTime={blog.publishedAt}
                    className="text-sm uppercase tracking-wide text-gray-500"
                  >
                    {formatDate(blog.publishedAt)}
                  </time>
                </div>

                <h1 className="text-section-title text-display mb-12 uppercase leading-tight tracking-tight text-black">
                  {blog.title}
                </h1>

                <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-gray-200">
                  <Image
                    src={blog.eyecatch.url}
                    alt={blog.eyecatch.alt || blog.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  />
                </div>
              </header>

              {/* Article Content */}
              <div className="mx-auto max-w-4xl">
                <CodeHighlight content={blog.content} />
              </div>

              {/* Article Footer */}
              <footer className="mt-20 border-t border-gray-200 pt-8">
                <div className="flex justify-center">
                  <Link
                    href="/article"
                    className="group relative inline-flex items-center gap-2 overflow-hidden border border-black px-6 py-3 text-sm font-medium text-black transition-all duration-300 ease-out hover:bg-black hover:text-white"
                  >
                    <svg
                      className="h-4 w-4 transition-transform group-hover:-translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    <span className="uppercase tracking-wide">
                      BACK TO ARTICLES
                    </span>
                  </Link>
                </div>
              </footer>
            </div>
          </article>
        </main>
        <Footer />
      </>
    )
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: Required for debugging API errors during build
    console.error('Error loading blog detail:', error)
    notFound()
  }
}
