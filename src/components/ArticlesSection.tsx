import { getBlogs } from '@/lib/microcms'
import ArticleItem from './ArticleItem'
import ArticlesHoverEffect from './ArticlesHoverEffect'

export default async function ArticlesSection() {
  // Fetch latest 3 articles from microCMS
  const { contents: articles } = await getBlogs({
    limit: 3,
    orders: '-publishedAt',
  })

  // If no articles, show a message
  if (articles.length === 0) {
    return (
      <section id="articles" className="py-32 px-6 md:px-12 bg-[#111] text-white relative z-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-gray-500">
              03 / Insights
            </span>
          </div>
          <p className="text-gray-400 text-center py-12">記事は現在準備中です。Coming soon...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="articles" className="py-32 px-6 md:px-12 bg-[#111] text-white relative z-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-gray-500">
            03 / Insights
          </span>
        </div>

        {/* Hover Image Container */}
        <ArticlesHoverEffect />

        <div className="space-y-px bg-gray-800">
          {articles.map((article) => {
            // Format date
            const date = new Date(article.publishedAt)
              .toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })
              .replace(/\//g, '.')

            return (
              <ArticleItem
                key={article.id}
                id={article.id}
                title={article.title}
                date={date}
                category={article.category.name}
                image={article.eyecatch.url}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
