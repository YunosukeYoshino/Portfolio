import { describe, expect, it } from 'bun:test'
import type { ArticleFeedItem } from '@/types'
import {
  calculateTotalPages,
  extractCategories,
  filterArticles,
  paginateArticles,
} from '../articleFilterLogic'

const createArticle = (
  overrides: Partial<ArticleFeedItem> & { id: string; title: string }
): ArticleFeedItem => ({
  publishedAt: '2025-01-01T00:00:00Z',
  category: { id: 'cat1', name: 'Frontend' },
  eyecatch: { url: 'https://example.com/img.png', width: 800, height: 450, alt: '' },
  source: 'microcms',
  ...overrides,
})

const sampleArticles: readonly ArticleFeedItem[] = [
  createArticle({ id: '1', title: 'React入門' }),
  createArticle({ id: '2', title: 'Next.jsガイド', category: { id: 'cat2', name: 'Backend' } }),
  createArticle({ id: '3', title: 'TypeScript Tips' }),
  createArticle({ id: '4', title: 'CSS Grid Layout', category: { id: 'cat2', name: 'Backend' } }),
  createArticle({ id: '5', title: 'React Hooks詳解' }),
]

describe('extractCategories', () => {
  it('空の記事リストを渡すと空のカテゴリ配列を返す', () => {
    // Arrange & Act
    const result = extractCategories([])

    // Assert
    expect(result).toEqual([])
  })

  it('カテゴリ一覧を記事数降順でソートして返す', () => {
    // Arrange & Act
    const result = extractCategories(sampleArticles)

    // Assert
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({ id: 'cat1', name: 'Frontend', count: 3 })
    expect(result[1]).toEqual({ id: 'cat2', name: 'Backend', count: 2 })
  })

  it('全記事が同じカテゴリの場合、1つのカテゴリを返す', () => {
    // Arrange
    const articles = [
      createArticle({ id: '1', title: 'A' }),
      createArticle({ id: '2', title: 'B' }),
    ]

    // Act
    const result = extractCategories(articles)

    // Assert
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({ id: 'cat1', name: 'Frontend', count: 2 })
  })
})

describe('filterArticles', () => {
  it('検索クエリもカテゴリも未指定の場合、全記事を返す', () => {
    // Arrange & Act
    const result = filterArticles(sampleArticles, '', null)

    // Assert
    expect(result).toHaveLength(5)
  })

  it('テキスト検索でタイトルに一致する記事のみ返す', () => {
    // Arrange & Act
    const result = filterArticles(sampleArticles, 'React', null)

    // Assert
    expect(result).toHaveLength(2)
    expect(result.every((a) => a.title.includes('React'))).toBe(true)
  })

  it('テキスト検索は大文字小文字を区別しない', () => {
    // Arrange & Act
    const result = filterArticles(sampleArticles, 'react', null)

    // Assert
    expect(result).toHaveLength(2)
    expect(result[0]?.title).toBe('React入門')
    expect(result[1]?.title).toBe('React Hooks詳解')
  })

  it('カテゴリフィルターで該当カテゴリの記事のみ返す', () => {
    // Arrange & Act
    const result = filterArticles(sampleArticles, '', 'cat2')

    // Assert
    expect(result).toHaveLength(2)
    expect(result.every((a) => a.category.id === 'cat2')).toBe(true)
  })

  it('検索 + カテゴリのANDフィルターが機能する', () => {
    // Arrange & Act
    const result = filterArticles(sampleArticles, 'React', 'cat1')

    // Assert
    expect(result).toHaveLength(2)
    expect(result.every((a) => a.category.id === 'cat1')).toBe(true)
    expect(result.every((a) => a.title.includes('React'))).toBe(true)
  })

  it('一致する記事がない場合、空の配列を返す', () => {
    // Arrange & Act
    const result = filterArticles(sampleArticles, '存在しないキーワード', null)

    // Assert
    expect(result).toHaveLength(0)
  })

  it('検索 + カテゴリの組み合わせで一致しない場合、空の配列を返す', () => {
    // Arrange & Act
    const result = filterArticles(sampleArticles, 'React', 'cat2')

    // Assert
    expect(result).toHaveLength(0)
  })

  it('空の記事リストに対してフィルタリングしても空を返す', () => {
    // Arrange & Act
    const result = filterArticles([], 'React', 'cat1')

    // Assert
    expect(result).toHaveLength(0)
  })
})

describe('paginateArticles', () => {
  it('1ページ目の記事を返す', () => {
    // Arrange & Act
    const result = paginateArticles(sampleArticles, 1, 2)

    // Assert
    expect(result).toHaveLength(2)
    expect(result[0]?.id).toBe('1')
    expect(result[1]?.id).toBe('2')
  })

  it('2ページ目の記事を返す', () => {
    // Arrange & Act
    const result = paginateArticles(sampleArticles, 2, 2)

    // Assert
    expect(result).toHaveLength(2)
    expect(result[0]?.id).toBe('3')
    expect(result[1]?.id).toBe('4')
  })

  it('最終ページで残りの記事を返す', () => {
    // Arrange & Act
    const result = paginateArticles(sampleArticles, 3, 2)

    // Assert
    expect(result).toHaveLength(1)
    expect(result[0]?.id).toBe('5')
  })

  it('空の配列を渡すと空を返す', () => {
    // Arrange & Act
    const result = paginateArticles([], 1, 2)

    // Assert
    expect(result).toHaveLength(0)
  })
})

describe('calculateTotalPages', () => {
  it('0件の場合、最低1ページを返す', () => {
    expect(calculateTotalPages(0, 10)).toBe(1)
  })

  it('perPageちょうどの場合、1ページを返す', () => {
    expect(calculateTotalPages(10, 10)).toBe(1)
  })

  it('perPage超えの場合、切り上げでページ数を返す', () => {
    expect(calculateTotalPages(11, 10)).toBe(2)
  })

  it('5件でperPage2の場合、3ページを返す', () => {
    expect(calculateTotalPages(5, 2)).toBe(3)
  })
})
