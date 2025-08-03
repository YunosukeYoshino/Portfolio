import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import CodeHighlight from '@/components/CodeHighlight'
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
        <main className="l-main bg-white">
          <article className="py-24 md:py-32">
            <div className="container-custom">
              {/* Article Header */}
              <header className="mb-16">
                <div className="flex items-center justify-between mb-8">
                  <span className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium uppercase tracking-wide">
                    {blog.category.name}
                  </span>
                  <time dateTime={blog.publishedAt} className="text-gray-500 uppercase tracking-wide text-sm">
                    {formatDate(blog.publishedAt)}
                  </time>
                </div>

                <h1 className="text-section-title text-display text-black leading-tight mb-12 uppercase tracking-tight">
                  {blog.title}
                </h1>

                <div className="relative aspect-[16/9] rounded-lg overflow-hidden border border-gray-200">
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
                <CodeHighlight content={blog.content} />
              </div>

              {/* Article Footer */}
              <footer className="mt-20 pt-8 border-t border-gray-200">
                <div className="flex justify-center">
                  <Link
                    href="/article"
                    className="group relative inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-black border border-black hover:bg-black hover:text-white transition-all duration-300 ease-out overflow-hidden"
                  >
                    <svg
                      className="w-4 h-4 transition-transform group-hover:-translate-x-1"
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
                    <span className="uppercase tracking-wide">BACK TO ARTICLES</span>
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
