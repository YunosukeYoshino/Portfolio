'use client'

import { Link } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import ArticleItem from '@/components/article/ArticleItem'
import ArticlesHoverEffect from '@/components/article/ArticlesHoverEffect'
import { formatDateCompact } from '@/lib/utils'
import type { Blog } from '@/types'

interface ArticlesSectionProps {
  articles: Blog[]
}

export default function ArticlesSection({ articles }: ArticlesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    let gsapContext: { revert: () => void } | undefined

    Promise.all([
      import('gsap').then((m) => m.default),
      import('gsap/ScrollTrigger').then((m) => m.default),
    ]).then(([gsap, ScrollTrigger]) => {
      gsap.registerPlugin(ScrollTrigger)

      const section = sectionRef.current
      if (!section) return

      gsapContext = gsap.context(() => {
        // Animate the section heading with a fade-in from below
        const heading = section.querySelector('.articles-heading')
        if (heading) {
          gsap.fromTo(
            heading,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: heading,
                start: 'top 85%',
              },
            }
          )
        }

        // Animate article cards in batches as they enter the viewport
        const articleItems = gsap.utils.toArray(
          section.querySelectorAll('.article-batch-item')
        ) as HTMLElement[]

        if (articleItems.length > 0) {
          // Set initial state for all article items
          gsap.set(articleItems, { opacity: 0, y: 40 })

          ScrollTrigger.batch(articleItems, {
            start: 'top 85%',
            onEnter: (batch) => {
              gsap.to(batch, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
                stagger: 0.1,
                overwrite: true,
              })
            },
          })
        }

        // Animate the "View All" link
        const viewAllLink = section.querySelector('.articles-view-all')
        if (viewAllLink) {
          gsap.fromTo(
            viewAllLink,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: viewAllLink,
                start: 'top 85%',
              },
            }
          )
        }
      }, section)
    })

    return () => {
      if (gsapContext) gsapContext.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="articles"
      className="py-32 px-6 md:px-12 bg-[#111] text-white relative z-20"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-16 articles-heading">
          <h2 className="text-xs font-mono uppercase tracking-widest text-gray-500">
            03 / Insights
          </h2>
        </div>

        {articles.length === 0 ? (
          <p className="text-gray-400 text-center py-12">記事は現在準備中です。Coming soon...</p>
        ) : (
          <>
            {/* Hover Image Container */}
            <ArticlesHoverEffect />

            <div className="space-y-px bg-gray-800 articles-container">
              {articles.map((article) => {
                const date = formatDateCompact(article.publishedAt)

                return (
                  <div key={article.id} className="article-batch-item">
                    <ArticleItem
                      id={article.id}
                      title={article.title}
                      date={date}
                      category={article.category.name}
                      image={article.eyecatch?.url}
                    />
                  </div>
                )
              })}
            </div>

            <div className="mt-16 text-center articles-view-all">
              <Link
                to="/article/page/$page/"
                params={{ page: '1' }}
                reloadDocument
                className="inline-block border-b border-gray-700 pb-1 text-sm font-mono uppercase tracking-widest text-gray-500 hover:text-white hover:border-white transition-colors"
              >
                View All Articles
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
