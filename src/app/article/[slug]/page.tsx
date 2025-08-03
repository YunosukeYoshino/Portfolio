import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { getAllBlogIds, getBlogDetail } from '@/lib/microcms'
import { generateMetadata as createMetadata, formatDate } from '@/lib/utils'
import type { BlogPageProps } from '@/types'

// Generate static params for pre-rendering
export async function generateStaticParams() {
  try {
    const blogIds = await getAllBlogIds()
    return blogIds.map((id) => ({
      slug: id,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const blog = await getBlogDetail(slug)

    return createMetadata({
      title: blog.title,
      description: blog.content.replace(/<[^>]*>/g, '').slice(0, 160),
      url: `/article/${blog.id}`,
      image: blog.eyecatch.url,
    })
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

    return (
      <>
        <Header />
        <main className="l-main">
          <article className="py-16 md:py-24">
            <div className="container-custom">
              {/* Breadcrumb */}
              <nav className="mb-8" aria-label="パンくずリスト">
                <ol className="flex items-center space-x-2 text-sm text-gray-500">
                  <li>
                    <Link href="/" className="hover:text-gray-700 transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>/</li>
                  <li>
                    <Link href="/article/page/1" className="hover:text-gray-700 transition-colors">
                      Article
                    </Link>
                  </li>
                  <li>/</li>
                  <li className="text-gray-900">{blog.title}</li>
                </ol>
              </nav>

              {/* Article Header */}
              <header className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-full">
                    {blog.category.name}
                  </span>
                  <time dateTime={blog.publishedAt} className="text-gray-500">
                    {formatDate(blog.publishedAt)}
                  </time>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-8">
                  {blog.title}
                </h1>

                <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
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
              <div className="max-w-4xl mx-auto">
                <div
                  className="prose prose-lg max-w-none prose-blue prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-800"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              </div>

              {/* Article Footer */}
              <footer className="mt-16 pt-8 border-t border-gray-200">
                <div className="flex justify-center">
                  <Link
                    href="/article/page/1"
                    className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <svg
                      className="mr-2 w-4 h-4"
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
                    記事一覧に戻る
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
    console.error('Error loading blog detail:', error)
    notFound()
  }
}
