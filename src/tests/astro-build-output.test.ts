import { describe, expect, it } from 'bun:test'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const repoRoot = resolve(import.meta.dir, '../..')
const distDir = resolve(repoRoot, 'dist')

const astroConfigSource = readFileSync(resolve(repoRoot, 'astro.config.mjs'), 'utf8')
const middlewareSource = readFileSync(resolve(repoRoot, 'src/middleware.ts'), 'utf8')
const wranglerSource = readFileSync(resolve(repoRoot, 'wrangler.toml'), 'utf8')
const contactApiSource = readFileSync(resolve(repoRoot, 'src/pages/api/contact.ts'), 'utf8')

const SKIP_BUILD = process.env.SKIP_BUILD_TESTS === '1'
// ビルド成果物が無いと検証できないので、`bun run build` 済みの場合のみ回す。
// CI のテスト段階でも build step の後に実行される前提。
const hasBuild = existsSync(resolve(distDir, '_worker.js', 'index.js'))

describe('Astro Cloudflare adapter / output configuration', () => {
  it('output: static でルート単位の prerender=false に opt-in する', () => {
    expect(astroConfigSource).toContain("output: 'static'")
  })

  it('Cloudflare アダプタと React 統合を組み合わせる', () => {
    expect(astroConfigSource).toMatch(/adapter:\s*cloudflare\(/)
    expect(astroConfigSource).toMatch(/integrations:\s*\[react\(\)\]/)
  })

  it('Wrangler は nodejs_compat 互換フラグを維持する', () => {
    expect(wranglerSource).toContain('nodejs_compat')
  })
})

describe('LLM 向け markdown 配信と Link ヘッダー注入（middleware）', () => {
  it('Accept: text/markdown で markdown 配信するルーティングを持つ', () => {
    expect(middlewareSource).toMatch(/text\/markdown/)
    expect(middlewareSource).toMatch(/['"]Content-Type['"]:\s*['"]text\/markdown/)
  })

  it('api-catalog と sitemap の Link ヘッダーを HTML 応答に付与する', () => {
    expect(middlewareSource).toContain('api-catalog')
    expect(middlewareSource).toContain('sitemap.xml')
  })
})

describe('contact / markdown サーバーエンドポイント', () => {
  it('contact API は Astro APIRoute として POST と OPTIONS を実装する', () => {
    expect(contactApiSource).toMatch(/export const prerender = false/)
    expect(contactApiSource).toMatch(/export const POST/)
    expect(contactApiSource).toMatch(/export const OPTIONS/)
  })
})

describe.skipIf(SKIP_BUILD || !hasBuild)('Astro ビルド成果物（dist/）', () => {
  it('Cloudflare Worker エントリを _worker.js/index.js に生成する', () => {
    expect(existsSync(resolve(distDir, '_worker.js', 'index.js'))).toBe(true)
  })

  it('クライアントアセットを _astro/ に出力する', () => {
    expect(existsSync(resolve(distDir, '_astro'))).toBe(true)
  })

  it('固定ページと記事一覧の静的 HTML を生成する', () => {
    const pages = ['about', 'contact', 'privacy-policy', 'article/page/1']
    for (const page of pages) {
      expect(existsSync(resolve(distDir, page, 'index.html'))).toBe(true)
    }
  })

  it('sitemap.xml を生成しサイト URL を含む', () => {
    const sitemap = readFileSync(resolve(distDir, 'sitemap.xml'), 'utf8')
    expect(sitemap).toContain('<urlset')
    expect(sitemap).toContain('yunosukeyoshino.com')
  })

  it('Cloudflare ルーティングマニフェスト（_routes.json）を生成する', () => {
    const routes = readFileSync(resolve(distDir, '_routes.json'), 'utf8')
    expect(routes).toContain('"exclude"')
    // 静的化されたルートは Worker を経由せず配信される
    expect(routes).toContain('/about')
    expect(routes).toContain('/sitemap.xml')
  })

  it('api-catalog well-known エンドポイントを静的配置する', () => {
    expect(existsSync(resolve(distDir, '.well-known', 'api-catalog'))).toBe(true)
  })

  it('contact / 記事詳細の SSR ページを Worker にバンドルする', () => {
    expect(existsSync(resolve(distDir, '_worker.js', 'pages', 'api'))).toBe(true)
    expect(existsSync(resolve(distDir, '_worker.js', 'pages', 'article'))).toBe(true)
  })

  it('/article → /article/page/1 のリダイレクトを _redirects に出力する', () => {
    const redirects = readFileSync(resolve(distDir, '_redirects'), 'utf8')
    expect(redirects).toContain('/article')
    expect(redirects).toContain('/article/page/1')
  })
})
