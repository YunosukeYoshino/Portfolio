import { defineCollection, z } from 'astro:content'

import { fetchAllArticles } from './lib/articles'

/**
 * microCMS ブログ記事コレクション
 *
 * ビルド時に fetchAllArticles() を介して microCMS から全記事を取得し、
 * Content Layer へ { id, data: Blog } 形式で格納する。
 * 各ページでは getCollection / getEntry でこのコレクションを読み出す。
 */
const articles = defineCollection({
  loader: async () => {
    const blogs = await fetchAllArticles()
    return blogs.map((blog) => ({
      id: blog.id,
      data: blog,
    }))
  },
  schema: z.object({
    id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    publishedAt: z.string(),
    revisedAt: z.string(),
    title: z.string(),
    content: z.string(),
    category: z.object({
      id: z.string(),
      name: z.string(),
    }),
    eyecatch: z.object({
      url: z.string(),
      width: z.number(),
      height: z.number(),
      alt: z.string(),
    }),
  }),
})

export const collections = { articles }
