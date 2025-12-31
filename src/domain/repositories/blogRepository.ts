/**
 * Blog Repository Port (Interface)
 *
 * 最内側のレイヤー: 外部依存なし
 * UseCaseが依存するインターフェース定義
 * 具体的な実装（microCMS等）は知らない
 */

import type { Blog, BlogResponse } from '../entities/blog'

export interface BlogQueries {
  readonly offset?: number
  readonly limit?: number
  readonly orders?: string
  readonly fields?: string
  readonly [key: string]: string | number | undefined
}

/**
 * Blog Repository Port
 * 内側で定義され、外側で実装される
 */
export interface BlogRepository {
  /**
   * ブログ記事一覧を取得
   */
  findAll(queries?: BlogQueries): Promise<BlogResponse>

  /**
   * IDでブログ記事を取得
   */
  findById(id: string, queries?: BlogQueries): Promise<Blog>

  /**
   * 全てのブログIDを取得（静的生成用）
   */
  getAllIds(): Promise<readonly string[]>
}
