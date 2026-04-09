const DEFAULT_TARGET_URL = 'https://yunosukeyoshino.com/'
const DEFAULT_RETRY_COUNT = 12
const DEFAULT_RETRY_DELAY_MS = 5_000

type AssetExpectation = {
  readonly url: string
  readonly kind: 'script' | 'style'
}

function log(message: string) {
  process.stdout.write(`${message}\n`)
}

function logError(message: string) {
  process.stderr.write(`${message}\n`)
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function normalizeTargetUrl(value: string) {
  const url = new URL(value)

  if (!url.pathname) {
    url.pathname = '/'
  }

  return url.toString()
}

function extractAssets(html: string, baseUrl: string): AssetExpectation[] {
  const assetRegex =
    /<link[^>]+href="([^"]*\/assets\/[^"]+\.(?:js|css))"[^>]*>|<script[^>]+src="([^"]*\/assets\/[^"]+\.js)"/g
  const assets = new Map<string, AssetExpectation['kind']>()

  for (const match of html.matchAll(assetRegex)) {
    const rawUrl = match[1] || match[2]

    if (!rawUrl) continue

    const absoluteUrl = new URL(rawUrl, baseUrl).toString()
    const kind: AssetExpectation['kind'] = absoluteUrl.endsWith('.css') ? 'style' : 'script'

    assets.set(absoluteUrl, kind)
  }

  return Array.from(assets.entries()).map(([url, kind]) => ({ url, kind }))
}

async function fetchText(url: string) {
  const response = await fetch(url, {
    headers: {
      'cache-control': 'no-cache',
      pragma: 'no-cache',
    },
  })

  const body = await response.text()

  return {
    response,
    body,
    contentType: response.headers.get('content-type')?.toLowerCase() ?? '',
  }
}

async function verifyAssets(targetUrl: string) {
  const page = await fetchText(targetUrl)

  if (!page.response.ok) {
    throw new Error(`HTML request failed with ${page.response.status} ${page.response.statusText}`)
  }

  const assets = extractAssets(page.body, targetUrl)

  if (assets.length === 0) {
    throw new Error('No /assets/* references found in HTML')
  }

  const failures: string[] = []

  for (const asset of assets) {
    const result = await fetchText(asset.url)
    const expectedContentType =
      asset.kind === 'style'
        ? result.contentType.includes('text/css')
        : result.contentType.includes('javascript')

    const looksLikeHtml = /^\s*<!doctype html/i.test(result.body) || /^\s*<html/i.test(result.body)

    if (!result.response.ok) {
      failures.push(`${asset.kind} ${asset.url} returned ${result.response.status}`)
      continue
    }

    if (!expectedContentType) {
      failures.push(
        `${asset.kind} ${asset.url} returned unexpected content-type: ${result.contentType || 'missing'}`
      )
    }

    if (looksLikeHtml) {
      failures.push(`${asset.kind} ${asset.url} returned HTML fallback content`)
    }
  }

  if (failures.length > 0) {
    throw new Error(failures.join('\n'))
  }

  return assets
}

async function main() {
  const targetUrl = normalizeTargetUrl(
    process.argv[2] ||
      process.env.VERIFY_DEPLOYMENT_URL ||
      process.env.SITE_URL ||
      DEFAULT_TARGET_URL
  )
  const retryCount = Number(process.env.VERIFY_DEPLOYMENT_RETRY_COUNT || DEFAULT_RETRY_COUNT)
  const retryDelayMs = Number(
    process.env.VERIFY_DEPLOYMENT_RETRY_DELAY_MS || DEFAULT_RETRY_DELAY_MS
  )

  let lastError: Error | undefined

  for (let attempt = 1; attempt <= retryCount; attempt += 1) {
    try {
      const assets = await verifyAssets(targetUrl)
      log(`Verified ${assets.length} assets for ${targetUrl}`)
      return
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      logError(`Attempt ${attempt}/${retryCount} failed for ${targetUrl}`)
      logError(lastError.message)

      if (attempt < retryCount) {
        await sleep(retryDelayMs)
      }
    }
  }

  throw lastError ?? new Error(`Asset verification failed for ${targetUrl}`)
}

await main()
