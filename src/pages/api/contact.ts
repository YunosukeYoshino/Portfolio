import type { APIRoute } from 'astro'
import { z } from 'zod'
import { contactSchema, sendResendEmail } from '@/lib/server/contactMail'
import { SITE_URL } from '@/lib/siteMetadata.ts'

// on-demand SSR（Cloudflare Workers 上で動かす）
export const prerender = false

// 許可するリクエスト元 (Origin) のホワイトリスト。
const ALLOWED_ORIGINS = new Set([
  SITE_URL,
  'https://yunosukeyoshino.com',
  'https://yunosuke-portfolio-preview.workers.dev',
])

function originHeader(request: Request): string | null {
  const origin = request.headers.get('origin')
  return origin && ALLOWED_ORIGINS.has(origin) ? origin : null
}

// Cache API を用いた best-effort の per-IP レートリミット (1 分窓 / 3 回上限)。
// `caches` が存在しないローカル / テスト環境では制限をかけない。
async function isRateLimited(request: Request): Promise<boolean> {
  if (typeof caches === 'undefined') return false
  const ip = request.headers.get('cf-connecting-ip') ?? 'unknown'
  if (ip === 'unknown') return false // ローカル / dev では緩める
  const key = `https://rate-limit/portfolio-contact/${ip}`
  const cache = await caches.open('contact-rate-limit')
  const now = Date.now()
  const WINDOW_MS = 60_000
  const MAX = 3
  const cached = await cache.match(new Request(key))
  const timestamps: number[] = cached ? JSON.parse(await cached.text()) : []
  const recent = timestamps.filter((t) => now - t < WINDOW_MS)
  if (recent.length >= MAX) return true
  recent.push(now)
  await cache.put(
    new Request(key),
    new Response(JSON.stringify(recent), {
      headers: { 'Cache-Control': 'max-age=60' },
    })
  )
  return false
}

function corsHeadersFor(origin: string | null): Record<string, string> {
  return origin
    ? {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    : {
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
}

// フォーム送信の応答は CDN / ブラウザのどちらにもキャッシュさせない。
function jsonHeadersFor(origin: string | null): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
    ...corsHeadersFor(origin),
  }
}

export const POST: APIRoute = async ({ request }) => {
  const allowedOrigin = originHeader(request)
  // Origin ヘッダが存在するがホワイトリスト外のときのみ拒否。
  // Origin が欠損するリクエスト (curl 等の非ブラウザ) は許可する。
  if (request.headers.get('origin') && allowedOrigin === null) {
    return new Response(JSON.stringify({ error: '許可されていない送信元です' }), {
      status: 403,
      headers: jsonHeadersFor(null),
    })
  }

  if (await isRateLimited(request)) {
    return new Response(
      JSON.stringify({ error: 'リクエストが多すぎます。しばらくしてから再試行してください。' }),
      {
        status: 429,
        headers: { ...jsonHeadersFor(allowedOrigin), 'Retry-After': '60' },
      }
    )
  }

  try {
    const body = await request.json()
    const validatedData = contactSchema.parse(body)

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not configured')
    }

    const emailResult = await sendResendEmail(apiKey, validatedData)

    return new Response(JSON.stringify({ message: 'メールを送信しました', id: emailResult.id }), {
      status: 200,
      headers: jsonHeadersFor(allowedOrigin),
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: '入力データが無効です', details: error.issues }),
        {
          status: 400,
          headers: jsonHeadersFor(allowedOrigin),
        }
      )
    }

    return new Response(JSON.stringify({ error: 'サーバーエラーが発生しました' }), {
      status: 500,
      headers: jsonHeadersFor(allowedOrigin),
    })
  }
}

export const OPTIONS: APIRoute = async ({ request }) => {
  const allowedOrigin = originHeader(request)
  if (request.headers.get('origin') && allowedOrigin === null) {
    return new Response(null, { status: 403 })
  }
  return new Response(null, {
    status: 200,
    headers: corsHeadersFor(allowedOrigin),
  })
}
