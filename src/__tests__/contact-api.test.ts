import { afterEach, describe, expect, it } from 'bun:test'

const { POST, OPTIONS } = await import('@/pages/api/contact')

const ALLOWED_ORIGIN = 'https://yunosukeyoshino.com'

// API route は process.env.RESEND_API_KEY を必須とするためテスト用に設定。
process.env.RESEND_API_KEY = 'test-key'

type FetchCall = { url: string; body: unknown }

function buildRequest(
  method: 'POST' | 'OPTIONS',
  body: unknown,
  headers: Record<string, string> = {}
): Request {
  return new Request('https://yunosukeyoshino.com/api/contact', {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: method === 'POST' ? JSON.stringify(body) : undefined,
  })
}

function validBody(overrides: Record<string, unknown> = {}) {
  return {
    name: '山田 太郎',
    email: 'sender@example.com',
    subject: '問い合わせ',
    message: 'こんにちは',
    website: '',
    ...overrides,
  }
}

function stubFetch(): { calls: FetchCall[]; restore: () => void } {
  const calls: FetchCall[] = []
  const original = globalThis.fetch
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const body = init?.body ? JSON.parse(init.body as string) : null
    calls.push({ url: input.toString(), body })
    return new Response(JSON.stringify({ id: 're_test' }), { status: 200 })
  }) as typeof fetch
  return { calls, restore: () => (globalThis.fetch = original) }
}

function stubCachesWith(store: Map<string, string>) {
  const previous = (globalThis as Record<string, unknown>).caches
  const fakeCache = {
    async match(req: Request) {
      return store.has(req.url) ? new Response(store.get(req.url), { status: 200 }) : undefined
    },
    async put(req: Request, res: Response) {
      store.set(req.url, await res.text())
    },
  }
  ;(globalThis as Record<string, unknown>).caches = { open: async () => fakeCache }
  return () => {
    if (previous) {
      ;(globalThis as Record<string, unknown>).caches = previous
    } else {
      delete (globalThis as Record<string, unknown>).caches
    }
  }
}

describe('POST /api/contact', () => {
  let restoreFetch: (() => void) | undefined
  let restoreCaches: (() => void) | undefined

  afterEach(() => {
    restoreFetch?.()
    restoreFetch = undefined
    restoreCaches?.()
    restoreCaches = undefined
  })

  it('returns 200 for an allowed origin + valid body and dispatches emails', async () => {
    const { calls, restore } = stubFetch()
    restoreFetch = restore

    const response = await POST({
      request: buildRequest('POST', validBody(), { origin: ALLOWED_ORIGIN }),
    } as unknown as Parameters<typeof POST>[0])

    expect(response.status).toBe(200)
    expect(response.headers.get('access-control-allow-origin')).toBe(ALLOWED_ORIGIN)
    // Resend への fetch が実行されたことで送信処理が走ったことを確認。
    expect(calls.length).toBeGreaterThan(0)
    expect(calls.every((c) => c.url === 'https://api.resend.com/emails')).toBe(true)
  })

  it('returns 403 for a disallowed origin and does not reach Resend', async () => {
    const { calls, restore } = stubFetch()
    restoreFetch = restore

    const response = await POST({
      request: buildRequest('POST', validBody(), { origin: 'https://evil.example' }),
    } as unknown as Parameters<typeof POST>[0])

    expect(response.status).toBe(403)
    expect(calls).toHaveLength(0)
  })

  it('returns 400 when the honeypot field is non-empty', async () => {
    const { calls, restore } = stubFetch()
    restoreFetch = restore

    const response = await POST({
      request: buildRequest('POST', validBody({ website: 'spam' }), { origin: ALLOWED_ORIGIN }),
    } as unknown as Parameters<typeof POST>[0])

    expect(response.status).toBe(400)
    expect(calls).toHaveLength(0)
  })

  it('returns 429 with Retry-After when rate limit is exceeded', async () => {
    const now = Date.now()
    const store = new Map<string, string>([
      ['https://rate-limit/portfolio-contact/203.0.113.9', JSON.stringify([now, now + 1, now + 2])],
    ])
    restoreCaches = stubCachesWith(store)
    const { calls, restore } = stubFetch()
    restoreFetch = restore

    const response = await POST({
      request: buildRequest('POST', validBody(), {
        origin: ALLOWED_ORIGIN,
        'cf-connecting-ip': '203.0.113.9',
      }),
    } as unknown as Parameters<typeof POST>[0])

    expect(response.status).toBe(429)
    expect(response.headers.get('retry-after')).toBe('60')
    expect(calls).toHaveLength(0)
  })
})

describe('OPTIONS /api/contact (preflight)', () => {
  it('reflects Access-Control-Allow-Origin for an allowed origin', async () => {
    const response = await OPTIONS({
      request: buildRequest('OPTIONS', null, { origin: ALLOWED_ORIGIN }),
    } as unknown as Parameters<typeof OPTIONS>[0])

    expect(response.status).toBe(200)
    expect(response.headers.get('access-control-allow-origin')).toBe(ALLOWED_ORIGIN)
  })

  it('returns 403 for a disallowed origin with no CORS headers', async () => {
    const response = await OPTIONS({
      request: buildRequest('OPTIONS', null, { origin: 'https://evil.example' }),
    } as unknown as Parameters<typeof OPTIONS>[0])

    expect(response.status).toBe(403)
    expect(response.headers.get('access-control-allow-origin')).toBeNull()
  })
})
