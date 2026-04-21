import handler from '@tanstack/react-start/server-entry'
import { getArticleMarkdown } from './server/markdown/article'
import { homeMarkdown } from './server/markdown/home'

interface WorkerEnv {
  MICROCMS_API_KEY?: string
  MICROCMS_SERVICE_DOMAIN?: string
  RESEND_API_KEY?: string
  DISCORD_WEBHOOK_URL?: string
  [key: string]: unknown
}

interface ExecutionContext {
  waitUntil(p: Promise<unknown>): void
  passThroughOnException(): void
}

type FetchHandler = {
  fetch(request: Request, env: WorkerEnv, ctx: ExecutionContext): Promise<Response>
}

const LINK_HEADER = [
  '</.well-known/api-catalog>; rel="api-catalog"',
  '</sitemap.xml>; rel="describedby"; type="application/xml"',
].join(', ')

function wantsMarkdown(request: Request): boolean {
  const accept = request.headers.get('accept') ?? ''
  return /(^|,\s*)text\/markdown(\s*;|\s*,|\s*$)/.test(accept)
}

function approxTokens(text: string): string {
  return String(Math.ceil(text.length / 4))
}

async function withLinkHeader(response: Response): Promise<Response> {
  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('text/html')) return response
  const headers = new Headers(response.headers)
  const existing = headers.get('link')
  headers.set('link', existing ? `${existing}, ${LINK_HEADER}` : LINK_HEADER)
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

const startHandler = handler as unknown as FetchHandler

export default {
  async fetch(request: Request, env: WorkerEnv, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url)

    if (wantsMarkdown(request) && request.method === 'GET') {
      if (url.pathname === '/') {
        return new Response(homeMarkdown, {
          headers: {
            'Content-Type': 'text/markdown; charset=utf-8',
            'Cache-Control': 'public, max-age=0, must-revalidate',
            Link: LINK_HEADER,
            'x-markdown-tokens': approxTokens(homeMarkdown),
          },
        })
      }

      const articleMatch = url.pathname.match(/^\/article\/([^/]+)\/?$/)
      if (articleMatch) {
        const md = await getArticleMarkdown(articleMatch[1])
        if (md) {
          return new Response(md, {
            headers: {
              'Content-Type': 'text/markdown; charset=utf-8',
              'Cache-Control': 'public, max-age=0, must-revalidate',
              'x-markdown-tokens': approxTokens(md),
            },
          })
        }
      }
    }

    const response = await startHandler.fetch(request, env, ctx)

    // Inject Link header on HTML responses for the homepage.
    // _headers only applies to asset-served responses, not Worker-generated HTML.
    if (url.pathname === '/') {
      return withLinkHeader(response)
    }

    return response
  },
} satisfies FetchHandler
