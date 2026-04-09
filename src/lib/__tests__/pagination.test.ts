import { describe, expect, it } from 'bun:test'
import { buildPaginationModel } from '../pagination'

describe('buildPaginationModel', () => {
  it('中央付近では現在ページの前後を含むページ番号を返す', () => {
    const result = buildPaginationModel({
      currentPage: 5,
      totalPages: 10,
    })

    expect(result.pages).toEqual([3, 4, 5, 6, 7])
    expect(result.hasLeadingEllipsis).toBe(true)
    expect(result.hasTrailingEllipsis).toBe(true)
  })

  it('先頭付近では1ページ目から連続したページ番号を返す', () => {
    const result = buildPaginationModel({
      currentPage: 1,
      totalPages: 3,
    })

    expect(result.pages).toEqual([1, 2, 3])
    expect(result.hasLeadingEllipsis).toBe(false)
    expect(result.hasTrailingEllipsis).toBe(false)
  })
})
