import { describe, expect, it } from 'bun:test'
import { formatDate, formatDateCompact, getCurrentYear } from '@/lib/utils'

describe('date formatting', () => {
  it('formatDate は Asia/Tokyo 基準で安定した長い日付文字列を返す', () => {
    expect(formatDate('2024-12-31T16:30:00.000Z')).toBe('2025年1月1日')
  })

  it('formatDateCompact は Asia/Tokyo 基準で安定した短い日付文字列を返す', () => {
    expect(formatDateCompact('2024-12-31T16:30:00.000Z')).toBe('2025.01.01')
  })

  it('getCurrentYear は4桁の年文字列を返す', () => {
    expect(getCurrentYear()).toMatch(/^\d{4}$/)
  })
})
