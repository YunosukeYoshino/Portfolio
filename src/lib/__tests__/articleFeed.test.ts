import { describe, expect, it } from 'bun:test'
import type { Blog } from '@/domain/entities/blog'
import { buildArticleFeed, getArticleFeedPage, microcmsArticleSourceAdapter } from '../articleFeed'

const createBlog = (overrides: Partial<Blog> & Pick<Blog, 'id' | 'title'>): Blog => ({
  id: overrides.id,
  title: overrides.title,
  content: '<p>content</p>',
  category: {
    id: 'frontend',
    name: 'Frontend',
    ...overrides.category,
  },
  eyecatch: {
    url: 'https://example.com/eyecatch.png',
    width: 1200,
    height: 630,
    alt: '',
    ...overrides.eyecatch,
  },
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
  publishedAt: '2025-01-01T00:00:00.000Z',
  revisedAt: '2025-01-01T00:00:00.000Z',
  ...overrides,
})

describe('microcmsArticleSourceAdapter', () => {
  it('microCMS記事をArticleFeedItemへ変換し、alt未設定時はタイトルを補完する', () => {
    const result = microcmsArticleSourceAdapter.toFeedItems([
      createBlog({
        id: 'react-start',
        title: 'React Start入門',
        eyecatch: {
          url: 'https://example.com/react.png',
          width: 800,
          height: 450,
          alt: '',
        },
      }),
    ])

    expect(result).toEqual([
      {
        id: 'react-start',
        title: 'React Start入門',
        publishedAt: '2025-01-01T00:00:00.000Z',
        category: {
          id: 'frontend',
          name: 'Frontend',
        },
        eyecatch: {
          url: 'https://example.com/react.png',
          width: 800,
          height: 450,
          alt: 'React Start入門',
        },
        source: 'microcms',
      },
    ])
  })
})

describe('buildArticleFeed', () => {
  it('公開日の降順でソートした一覧を返す', () => {
    const result = buildArticleFeed([
      {
        adapter: microcmsArticleSourceAdapter,
        items: [
          createBlog({
            id: 'older',
            title: '古い記事',
            publishedAt: '2024-01-01T00:00:00.000Z',
          }),
          createBlog({
            id: 'newer',
            title: '新しい記事',
            publishedAt: '2025-02-01T00:00:00.000Z',
          }),
        ],
      },
    ])

    expect(result.map((article) => article.id)).toEqual(['newer', 'older'])
  })
})

describe('getArticleFeedPage', () => {
  it('総件数・総ページ数・現在ページ分の記事を返す', () => {
    const articles = buildArticleFeed([
      {
        adapter: microcmsArticleSourceAdapter,
        items: [
          createBlog({ id: '1', title: '1', publishedAt: '2025-01-01T00:00:00.000Z' }),
          createBlog({ id: '2', title: '2', publishedAt: '2025-01-02T00:00:00.000Z' }),
          createBlog({ id: '3', title: '3', publishedAt: '2025-01-03T00:00:00.000Z' }),
        ],
      },
    ])

    const result = getArticleFeedPage(articles, 2, 2)

    expect(result.totalCount).toBe(3)
    expect(result.totalPages).toBe(2)
    expect(result.items.map((article) => article.id)).toEqual(['1'])
  })
})
