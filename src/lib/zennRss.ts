import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

export interface ZennFeedItem {
  readonly id: string
  readonly title: string
  readonly url: string
  readonly publishedAt: string
  readonly thumbnailUrl: string | null
}

const ZENN_FEED_URL = 'https://zenn.dev/yuche/feed'

const getZennFeedInputSchema = z
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

const extractTagText = (itemXml: string, tagName: string): string => {
  const tagRegex = new RegExp(`<${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)</${tagName}>`, 'i')
  const tagContent = itemXml.match(tagRegex)?.[1]?.trim()

  if (!tagContent) {
    return ''
  }

  const cdataMatch = tagContent.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/)
  const normalized = cdataMatch ? cdataMatch[1] : tagContent
  return decodeXmlText(normalized.trim())
}

const extractEnclosureUrl = (itemXml: string): string | null => {
  const enclosureMatch = itemXml.match(/<enclosure\b[^>]*\burl=(?:"([^"]+)"|'([^']+)')[^>]*\/?>/i)
  return enclosureMatch?.[1] || enclosureMatch?.[2] || null
}

const parseZennFeed = (xml: string): ZennFeedItem[] => {
  if (!xml.includes('<rss')) {
    throw new Error('Invalid Zenn RSS response')
  }

  const items = xml.match(/<item>([\s\S]*?)<\/item>/gi) || []

  return items
    .map((itemXml): ZennFeedItem | null => {
      const title = extractTagText(itemXml, 'title')
      const url = extractTagText(itemXml, 'link')
      const id = extractTagText(itemXml, 'guid') || url
      const pubDate = extractTagText(itemXml, 'pubDate')
      const timestamp = Date.parse(pubDate)
      const thumbnailUrl = extractEnclosureUrl(itemXml)

      if (!title || !url || !id || Number.isNaN(timestamp)) {
        return null
      }

      return {
        id,
        title,
        url,
        publishedAt: new Date(timestamp).toISOString(),
        thumbnailUrl,
      }
    })
    .filter((item): item is ZennFeedItem => item !== null)
}

export const getZennFeedItems = createServerFn({ method: 'GET' })
  .inputValidator((data: unknown) => getZennFeedInputSchema.parse(data))
  .handler(async ({ data }): Promise<ZennFeedItem[]> => {
    const response = await fetch(ZENN_FEED_URL, {
      headers: {
        Accept: 'application/rss+xml, application/xml;q=0.9, text/xml;q=0.8, */*;q=0.7',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch Zenn RSS feed: ${response.status} ${response.statusText}`)
    }

    const xml = await response.text()
    const items = parseZennFeed(xml)

    if (!data.limit) {
      return items
    }

    return items.slice(0, data.limit)
  })
