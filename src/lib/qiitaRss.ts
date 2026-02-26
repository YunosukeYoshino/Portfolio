import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

export interface QiitaFeedItem {
  readonly id: string
  readonly title: string
  readonly url: string
  readonly publishedAt: string
  readonly thumbnailUrl: string | null
}

const QIITA_FEED_URL = 'https://qiita.com/pomufgd/feed'

const getQiitaFeedInputSchema = z
  .object({
    limit: z.number().int().positive().max(100).optional(),
  })
  .default({})

const decodeXmlText = (value: string): string => {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

const extractTagText = (entryXml: string, tagName: string): string => {
  const tagRegex = new RegExp(`<${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)</${tagName}>`, 'i')
  const tagContent = entryXml.match(tagRegex)?.[1]?.trim()

  if (!tagContent) {
    return ''
  }

  const cdataMatch = tagContent.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/)
  const normalized = cdataMatch ? cdataMatch[1] : tagContent
  return decodeXmlText(normalized.trim())
}

const extractAtomLinkHref = (entryXml: string): string => {
  const linkMatch = entryXml.match(
    /<link\b[^>]*\brel=["']alternate["'][^>]*\bhref=["']([^"']+)["'][^>]*\/?>/i
  )
  if (linkMatch?.[1]) {
    return linkMatch[1]
  }

  const hrefFirstMatch = entryXml.match(
    /<link\b[^>]*\bhref=["']([^"']+)["'][^>]*\brel=["']alternate["'][^>]*\/?>/i
  )
  return hrefFirstMatch?.[1] || ''
}

const fetchOgImage = async (url: string): Promise<string | null> => {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; portfolio-bot/1.0; +https://yunosukeyoshino.com)',
      },
      signal: AbortSignal.timeout(5000),
    })
    if (!response.ok) {
      return null
    }
    const html = await response.text()

    const match =
      html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
      html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i)

    return match?.[1] ?? null
  } catch {
    return null
  }
}

const parseQiitaFeed = (xml: string): Omit<QiitaFeedItem, 'thumbnailUrl'>[] => {
  if (!xml.includes('<feed')) {
    throw new Error('Invalid Qiita Atom feed response')
  }

  const entries = xml.match(/<entry>([\s\S]*?)<\/entry>/gi) || []

  return entries
    .map((entryXml): Omit<QiitaFeedItem, 'thumbnailUrl'> | null => {
      const title = extractTagText(entryXml, 'title')
      const url = extractAtomLinkHref(entryXml)
      const id = extractTagText(entryXml, 'id') || url
      const published = extractTagText(entryXml, 'published')
      const timestamp = Date.parse(published)

      if (!title || !url || !id || Number.isNaN(timestamp)) {
        return null
      }

      return {
        id,
        title,
        url,
        publishedAt: new Date(timestamp).toISOString(),
      }
    })
    .filter((item): item is Omit<QiitaFeedItem, 'thumbnailUrl'> => item !== null)
}

export const getQiitaFeedItems = createServerFn({ method: 'GET' })
  .inputValidator((data: unknown) => getQiitaFeedInputSchema.parse(data))
  .handler(async ({ data }): Promise<QiitaFeedItem[]> => {
    const response = await fetch(QIITA_FEED_URL, {
      headers: {
        Accept: 'application/atom+xml, application/xml;q=0.9, text/xml;q=0.8, */*;q=0.7',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch Qiita Atom feed: ${response.status} ${response.statusText}`)
    }

    const xml = await response.text()
    const rawItems = parseQiitaFeed(xml)
    const limited = data.limit ? rawItems.slice(0, data.limit) : rawItems

    const items = await Promise.all(
      limited.map(async (item): Promise<QiitaFeedItem> => {
        const thumbnailUrl = await fetchOgImage(item.url)
        return { ...item, thumbnailUrl }
      })
    )

    return items
  })
