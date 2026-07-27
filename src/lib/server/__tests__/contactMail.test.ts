import { afterEach, describe, expect, it } from 'bun:test'
import type { ContactPayload } from '@/lib/contactSchema'
import { sendResendEmail } from '@/lib/server/contactMail'

const validPayload: ContactPayload = {
  name: '山田 太郎',
  email: 'sender@example.com',
  company: '株式会社Example',
  subject: '問い合わせ',
  message: 'こんにちは',
  website: '',
}

function okResponse(): Response {
  return new Response(JSON.stringify({ id: 're_123' }), { status: 200 })
}

type EmailPayload = {
  from?: string
  to?: string[]
  reply_to?: string
  subject?: string
  html?: string
}

type FetchCall = { url: string; body: EmailPayload | null }

function buildFetchSequence(responses: Response[], throws?: (Error | undefined)[]) {
  const calls: FetchCall[] = []
  const throwQueue = throws ?? []
  const originalFetch = globalThis.fetch
  const fn = async (input: string | URL | Request, init?: RequestInit) => {
    const body: EmailPayload | null = init?.body
      ? (JSON.parse(init.body as string) as EmailPayload)
      : null
    calls.push({ url: input.toString(), body })
    const nextThrow = throwQueue.shift()
    if (nextThrow) throw nextThrow
    const next = responses.shift()
    if (!next) throw new Error('fetch called more times than expected')
    return next
  }
  return { fn, calls, restore: () => (globalThis.fetch = originalFetch) }
}

describe('sendResendEmail', () => {
  let restore: (() => void) | undefined

  afterEach(() => {
    restore?.()
    restore = undefined
  })

  it('escapes user-controlled HTML in both admin and confirmation bodies', async () => {
    const payload: ContactPayload = {
      ...validPayload,
      name: '<script>alert(1)</script> & Co.',
      subject: '<b>bold</b> "quoted" \'apos\'',
      message: '<img src=x onerror=alert(1)> & <iframe>',
      company: '<i>Tech</i> & "Sons"',
    }
    const { fn, calls, restore: r } = buildFetchSequence([okResponse(), okResponse()])
    restore = r
    globalThis.fetch = fn as typeof fetch

    await sendResendEmail('test-key', payload)

    expect(calls).toHaveLength(2)
    const adminHtml = String(calls[0]?.body?.html)
    const confirmHtml = String(calls[1]?.body?.html)

    for (const html of [adminHtml, confirmHtml]) {
      expect(html).not.toContain('<script>')
      expect(html).not.toContain('<img src=x')
      expect(html).not.toContain('<iframe>')
      expect(html).toContain('&lt;script&gt;')
    }
    expect(adminHtml).toContain('&amp;')
    expect(confirmHtml).toContain('&amp;')
    expect(adminHtml).toContain('&quot;')
    expect(adminHtml).toContain('&#39;')
  })

  it('throws when the admin (main) email fetch returns non-2xx', async () => {
    const { fn, restore: r } = buildFetchSequence([new Response('boom', { status: 422 })])
    restore = r
    globalThis.fetch = fn as typeof fetch

    await expect(sendResendEmail('test-key', validPayload)).rejects.toThrow(
      /Failed to send main email/
    )
  })

  it('resolves with id when confirmation fetch returns non-2xx', async () => {
    const {
      fn,
      calls,
      restore: r,
    } = buildFetchSequence([okResponse(), new Response('confirmation failed', { status: 500 })])
    restore = r
    globalThis.fetch = fn as typeof fetch

    const result = await sendResendEmail('test-key', validPayload)
    expect(result).toEqual({ id: 're_123' })
    expect(calls).toHaveLength(2)
  })

  it('resolves with id when confirmation fetch throws', async () => {
    const networkError = new Error('network')
    const { fn, calls, restore: r } = buildFetchSequence([okResponse()], [undefined, networkError])
    restore = r
    globalThis.fetch = fn as typeof fetch

    const result = await sendResendEmail('test-key', validPayload)
    expect(result).toEqual({ id: 're_123' })
    expect(calls).toHaveLength(2)
  })

  it('sends admin mail to info@ and confirmation mail to the sender', async () => {
    const { fn, calls, restore: r } = buildFetchSequence([okResponse(), okResponse()])
    restore = r
    globalThis.fetch = fn as typeof fetch

    await sendResendEmail('test-key', validPayload)

    expect(calls[0]?.body?.to).toEqual(['info@yunosukeyoshino.com'])
    expect(calls[1]?.body?.to).toEqual(['sender@example.com'])
  })
})
