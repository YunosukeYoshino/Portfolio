/**
 * Blog Domain Entity
 *
 * 最内側のレイヤー: 外部依存なし
 * ビジネスルールとエンティティの定義
 */

export interface BlogCategory {
  readonly id: string
  readonly name: string
}

export interface BlogEyecatch {
  readonly url: string
  readonly width: number
  readonly height: number
  readonly alt: string
}

export interface Blog {
  readonly id: string
  readonly createdAt: string
  readonly updatedAt: string
  readonly publishedAt: string
  readonly revisedAt: string
  readonly title: string
  readonly content: string
  readonly category: BlogCategory
  readonly eyecatch: BlogEyecatch
}

export interface BlogResponse {
  readonly totalCount: number
  readonly offset: number
  readonly limit: number
  readonly contents: Blog[]
}
