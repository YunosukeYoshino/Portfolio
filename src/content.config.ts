import { defineCollection, z } from 'astro:content'

import { createMockBlog } from '@/infrastructure/microcms/mock'
import { fetchAllArticles } from './lib/articles'

/** ローカル開発用のサンプル記事 ID。プレースホルダー credentials のときだけ使う。 */
const DEV_SAMPLE_IDS = Array.from({ length: 15 }, (_, i) => `sample-blog-${i + 1}`)

const sampleContent = (index: number): string =>
  `<h2>サンプル見出し ${index}</h2><p>これはプレースホルダー credentials で表示されるサンプル記事です。実際の microCMS 認証情報を設定すると本物の記事に入れ替わります。</p><p>以下はコードブロックの例（Shiki のハイライトを確認用）:</p><pre><code class="language-typescript">interface Greeting {\n  message: string\n}\n\nconst greet = ({ message }: Greeting): string => \`hello, \${message}\`\nconsole.log(greet({ message: "world" }))</code></pre><p>外部リンクは新しいタブで開きます: <a href="https://astro.build">Astro 公式</a>。</p>`

/**
 * microCMS ブログ記事コレクション
 *
 * ビルド時に fetchAllArticles() を介して microCMS から全記事を取得し、
 * Content Layer へ { id, data: Blog } 形式で格納する。
 * 各ページでは getCollection / getEntry でこのコレクションを読み出す。
 */
const articles = defineCollection({
  loader: async () => {
    let blogs = await fetchAllArticles()

    // プレースホルダー credentials では実データが取れないため、
    // 開発時のみサンプル記事を表示して UI（リスト・ページネーション・詳細）を確認できるようにする。
    if (blogs.length === 0 && import.meta.env.DEV) {
      const now = Date.now()
      blogs = DEV_SAMPLE_IDS.map((id, index) => ({
        ...createMockBlog(id),
        title: `サンプル記事 ${index + 1}`,
        content: sampleContent(index + 1),
        publishedAt: new Date(now - index * 86_400_000).toISOString(),
      }))
    }

    return blogs.map((blog) => ({
      ...blog,
      id: blog.id,
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
      alt: z.string().optional(),
    }),
  }),
})

export const collections = { articles }
