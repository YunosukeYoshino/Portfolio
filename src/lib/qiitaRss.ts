import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

export interface QiitaFeedItem {
  readonly id: string
  readonly title: string
  readonly url: string
  readonly publishedAt: string
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

const parseQiitaFeed = (xml: string): QiitaFeedItem[] => {
  if (!xml.includes('<feed')) {
    throw new Error('Invalid Qiita Atom feed response')
  }

  const entries = xml.match(/<entry>([\s\S]*?)<\/entry>/gi) || []

  return entries
    .map((entryXml): QiitaFeedItem | null => {
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
    .filter((item): item is QiitaFeedItem => item !== null)
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
    const items = parseQiitaFeed(xml)

    if (!data.limit) {
      return items
    }

    return items.slice(0, data.limit)
  })
