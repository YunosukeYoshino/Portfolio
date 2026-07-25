/**
 * Article access helpers for Astro
 *
 * Clean Architecture の UseCase を呼び出して microCMS 記事を取得する。
 * Content Layer loader から利用される、フレームワークに依存しない純関数。
 */

import type { Blog } from '@/domain/entities/blog'
import { useCases } from '@/infrastructure/di'

/** microCMS の1ページあたり取得上限。安全のため 100 に抑える。 */
const PAGE_LIMIT = 100

/**
 * 公開日降順で全ブログ記事を取得する。
 * 記事数が PAGE_LIMIT を超える場合はページネーションで繰り返し取得する。
 */
export async function fetchAllArticles(): Promise<Blog[]> {
  const all: Blog[] = []
  let offset = 0
  let totalCount = Number.POSITIVE_INFINITY

  while (offset < totalCount) {
    const response = await useCases.getBlogs.execute({
      limit: PAGE_LIMIT,
      offset,
      orders: '-publishedAt',
    })
    all.push(...response.contents)
    totalCount = response.totalCount
    offset += response.limit || PAGE_LIMIT
  }

  return all
}
