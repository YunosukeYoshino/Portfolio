import { describe, expect, it, mock } from 'bun:test'

// astro:middleware は Astro ランタイム専用の仮想モジュール。
// defineMiddleware は恒等関数なのでテスト側で差し替える。
mock.module('astro:middleware', () => ({
  defineMiddleware: (handler: unknown) => handler,
}))
// 記事 markdown は microCMS に到達するため、ヘッダ検証には不要な依存を切る。
const ARTICLE_MARKDOWN = '# サンプル記事 1\n\npublished: 2026-07-26\n\n本文\n'
mock.module('@/lib/server/markdown/article', () => ({
  getArticleMarkdown: async (slug: string) => (slug === 'sample-blog-1' ? ARTICLE_MARKDOWN : null),
}))

const { onRequest } = await import('@/middleware')

function contextFor(pathname: string, headers: Record<string, string> = {}) {
  const url = new URL(`https://yunosukeyoshino.com${pathname}`)
  return { request: new Request(url, { headers }), url }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Astro の MiddlewareHandler 引数を最小構成で模す
const invoke = (context: unknown, next: unknown) => (onRequest as any)(context, next)

describe('middleware の Vary / Cache-Control 付与', () => {
  it('Accept: text/markdown の / 応答に Vary: Accept を付ける', async () => {
    const response: Response = await invoke(
      contextFor('/', { accept: 'text/markdown' }),
      async () => new Response('unused')
    )

    expect(response.headers.get('content-type')).toContain('text/markdown')
    expect(response.headers.get('vary')).toBe('Accept')
  })

  it('Accept: text/markdown の記事詳細を markdown で返し Vary: Accept を付ける', async () => {
    const response: Response = await invoke(
      contextFor('/article/sample-blog-1', { accept: 'text/markdown' }),
      async () => new Response('unused')
    )

    expect(response.headers.get('content-type')).toContain('text/markdown')
    expect(response.headers.get('vary')).toBe('Accept')
    expect(await response.text()).toBe(ARTICLE_MARKDOWN)
  })

  it('markdown を持たない記事は HTML 応答にフォールバックする', async () => {
    const response: Response = await invoke(
      contextFor('/article/no-markdown', { accept: 'text/markdown' }),
      async () =>
        new Response('<!doctype html>', { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
    )

    expect(response.headers.get('content-type')).toContain('text/html')
  })

  it('HTML 応答に Vary: Accept と CDN 向け Cache-Control を付ける', async () => {
    const response: Response = await invoke(
      contextFor('/'),
      async () =>
        new Response('<!doctype html>', { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
    )

    expect(response.headers.get('vary')).toBe('Accept')
    expect(response.headers.get('cache-control')).toBe(
      'public, max-age=0, s-maxage=300, stale-while-revalidate=86400'
    )
  })

  it('上流の Vary を保ったまま Accept を追加する', async () => {
    const response: Response = await invoke(
      contextFor('/'),
      async () =>
        new Response('<!doctype html>', {
          headers: { 'Content-Type': 'text/html; charset=utf-8', Vary: 'Cookie' },
        })
    )

    expect(response.headers.get('vary')).toBe('Cookie, Accept')
  })

  it('Vary: * はそのまま残す', async () => {
    const response: Response = await invoke(
      contextFor('/'),
      async () =>
        new Response('<!doctype html>', {
          headers: { 'Content-Type': 'text/html; charset=utf-8', Vary: '*' },
        })
    )

    expect(response.headers.get('vary')).toBe('*')
  })

  it('既に Cache-Control を持つ HTML 応答は上書きしない', async () => {
    const response: Response = await invoke(
      contextFor('/'),
      async () =>
        new Response('<!doctype html>', {
          headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
        })
    )

    expect(response.headers.get('cache-control')).toBe('no-store')
  })

  it('HTML 以外の応答には Vary / Cache-Control を付けない', async () => {
    const response: Response = await invoke(
      contextFor('/api/contact'),
      async () => new Response('{}', { headers: { 'Content-Type': 'application/json' } })
    )

    expect(response.headers.get('vary')).toBeNull()
    expect(response.headers.get('cache-control')).toBeNull()
  })
})
