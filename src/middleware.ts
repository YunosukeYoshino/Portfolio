import { defineMiddleware } from 'astro:middleware'

import { getArticleMarkdown } from '@/lib/server/markdown/article'
import { homeMarkdown } from '@/lib/server/markdown/home'

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

/**
 * LLM クライアント向けの markdown 配信と HTML Link ヘッダ注入。
 *
 * - Accept: text/markdown で / と /article/[slug] への GET を markdown で返す
 * - SSR ルートの HTML 応答に api-catalog / sitemap の Link ヘッダを付与
 *   （静的ルートは Layout.astro の <link> で代替）
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const { request, url } = context

  if (request.method === 'GET' && wantsMarkdown(request)) {
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

  const response = await next()

  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('text/html')) {
    const existing = response.headers.get('link')
    response.headers.set('link', existing ? `${existing}, ${LINK_HEADER}` : LINK_HEADER)
  }

  return response
})
