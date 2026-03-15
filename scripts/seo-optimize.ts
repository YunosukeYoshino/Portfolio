/**
 * SEO Metadata Optimization Pipeline
 *
 * microCMS記事のbodyからClaude CLIを使用して
 * SEO最適化されたtitle/descriptionを自動生成する
 *
 * Usage:
 *   bun run scripts/seo-optimize.ts [options]
 *
 * Options:
 *   --force     既存キャッシュを無視して全記事を再生成
 *   --dry-run   生成結果を表示するが保存しない
 *   --slug=xxx  特定の記事のみ処理
 */

import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

// --- Types ---

interface BlogFromApi {
  readonly id: string
  readonly title: string
  readonly content: string
  readonly category: { readonly name: string }
  readonly publishedAt: string
}

interface BlogListResponse {
  readonly contents: readonly BlogFromApi[]
  readonly totalCount: number
}

interface SeoEntry {
  readonly seoTitle: string
  readonly seoDescription: string
  readonly originalTitle: string
  readonly contentHash: string
  readonly generatedAt: string
}

interface SeoMetadataCache {
  readonly [articleId: string]: SeoEntry
}

// --- Config ---

const PROJECT_ROOT = join(import.meta.dir, '..')
const CACHE_PATH = join(PROJECT_ROOT, 'src', 'data', 'seo-metadata.json')
const DELAY_MS = 1000

// --- CLI Args ---

function parseArgs(): {
  readonly force: boolean
  readonly dryRun: boolean
  readonly slug: string | null
} {
  const args = process.argv.slice(2)
  return {
    force: args.includes('--force'),
    dryRun: args.includes('--dry-run'),
    slug: args.find((a) => a.startsWith('--slug='))?.split('=')[1] ?? null,
  }
}

// --- microCMS API ---

function getMicroCMSConfig(): { readonly baseUrl: string; readonly apiKey: string } {
  const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN
  const apiKey = process.env.MICROCMS_API_KEY

  if (!serviceDomain || !apiKey) {
    throw new Error('MICROCMS_SERVICE_DOMAIN and MICROCMS_API_KEY must be set in .env')
  }

  return {
    baseUrl: `https://${serviceDomain}/api/v1`,
    apiKey,
  }
}

async function fetchAllArticles(config: {
  readonly baseUrl: string
  readonly apiKey: string
}): Promise<readonly BlogFromApi[]> {
  const allArticles: BlogFromApi[] = []
  let offset = 0
  const limit = 100

  while (true) {
    const url = `${config.baseUrl}/blogs?offset=${offset}&limit=${limit}`
    const response = await fetch(url, {
      headers: { 'X-MICROCMS-API-KEY': config.apiKey },
    })

    if (!response.ok) {
      throw new Error(`microCMS API error: ${response.status} ${response.statusText}`)
    }

    const data = (await response.json()) as BlogListResponse
    allArticles.push(...data.contents)

    if (allArticles.length >= data.totalCount) break
    offset += limit
  }

  return allArticles
}

// --- Content Processing ---

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function hashContent(content: string): string {
  const hasher = new Bun.CryptoHasher('sha256')
  hasher.update(content)
  return hasher.digest('hex').slice(0, 16)
}

// --- Claude CLI ---

async function generateSeoMetadata(article: BlogFromApi): Promise<{
  readonly seoTitle: string
  readonly seoDescription: string
} | null> {
  const plainText = stripHtml(article.content).slice(0, 3000)

  const prompt = `You are an SEO specialist for a Japanese tech blog. Given the article below, generate an SEO-optimized title and meta description in Japanese.

Requirements:
- seoTitle: 30-60 characters in Japanese, include primary keyword near the beginning, compelling and click-worthy. Improve upon the original title for better search ranking.
- seoDescription: 100-160 characters in Japanese, include primary keyword, clear value proposition, encourage clicks.
- Both MUST be in Japanese.
- Output ONLY valid JSON, no markdown fences, no explanation.

Original title: ${article.title}
Category: ${article.category.name}
Content (first 3000 chars):
${plainText}

Output format:
{"seoTitle": "...", "seoDescription": "..."}`

  try {
    const proc = Bun.spawn(['claude', '-p', '--output-format', 'text'], {
      stdin: new TextEncoder().encode(prompt),
      stdout: 'pipe',
      stderr: 'pipe',
    })

    const stdout = await new Response(proc.stdout).text()
    const _stderr = await new Response(proc.stderr).text()

    const exitCode = await proc.exited

    if (exitCode !== 0) {
      return null
    }

    const jsonStr = stdout
      .trim()
      .replace(/^```json?\n?/, '')
      .replace(/\n?```$/, '')
    const parsed = JSON.parse(jsonStr) as { seoTitle: string; seoDescription: string }

    if (!parsed.seoTitle || !parsed.seoDescription) {
      return null
    }

    return { seoTitle: parsed.seoTitle, seoDescription: parsed.seoDescription }
  } catch (_error) {
    return null
  }
}

// --- Cache ---

async function loadCache(): Promise<SeoMetadataCache> {
  if (!existsSync(CACHE_PATH)) return {}

  try {
    const raw = await readFile(CACHE_PATH, 'utf-8')
    return JSON.parse(raw) as SeoMetadataCache
  } catch {
    return {}
  }
}

async function saveCache(cache: SeoMetadataCache): Promise<void> {
  const dir = join(PROJECT_ROOT, 'src', 'data')
  if (!existsSync(dir)) {
    await Bun.write(join(dir, '.gitkeep'), '')
  }

  const sorted = Object.keys(cache)
    .sort()
    .reduce<Record<string, SeoEntry>>((acc, key) => {
      acc[key] = cache[key]
      return acc
    }, {})

  await writeFile(CACHE_PATH, `${JSON.stringify(sorted, null, 2)}\n`, 'utf-8')
}

// --- Diff Report ---

function printDiff(_articleId: string, _original: string, _entry: SeoEntry): void {}

// --- Main ---

async function main(): Promise<void> {
  const args = parseArgs()

  if (args.slug) {
  }

  const config = getMicroCMSConfig()

  const articles = await fetchAllArticles(config)

  const cache = await loadCache()
  const updatedCache: Record<string, SeoEntry> = { ...cache }

  let processed = 0
  let _skipped = 0
  let _failed = 0

  const targetArticles = args.slug ? articles.filter((a) => a.id === args.slug) : articles

  if (targetArticles.length === 0) {
    return
  }

  for (const article of targetArticles) {
    const contentHash = hashContent(article.content)
    const cached = cache[article.id]

    if (!args.force && cached && cached.contentHash === contentHash) {
      _skipped++
      continue
    }

    const result = await generateSeoMetadata(article)

    if (!result) {
      _failed++
      continue
    }

    const entry: SeoEntry = {
      seoTitle: result.seoTitle,
      seoDescription: result.seoDescription,
      originalTitle: article.title,
      contentHash,
      generatedAt: new Date().toISOString(),
    }

    updatedCache[article.id] = entry
    processed++

    printDiff(article.id, article.title, entry)

    if (targetArticles.indexOf(article) < targetArticles.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, DELAY_MS))
    }
  }

  if (!args.dryRun && processed > 0) {
    await saveCache(updatedCache)
  } else if (args.dryRun) {
  }
}

main().catch((_error) => {
  process.exit(1)
})
