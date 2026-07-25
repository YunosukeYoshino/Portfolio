import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

const markdownInputSchema = z.object({
  content: z.string(),
})

const MARKDOWN_HEADING_PATTERN = /^<p>(#{1,6}\s)/

function isMarkdownContent(content: string): boolean {
  if (!content.startsWith('<p>')) return false
  const inner = content.replace(/^<p>/, '').replace(/<\/p>$/, '')
  const decoded = inner.replace(/<br>/g, '\n').replace(/&gt;/g, '>').replace(/&lt;/g, '<')
  return MARKDOWN_HEADING_PATTERN.test(content) || /\n#{1,6}\s/.test(decoded)
}

function extractMarkdownFromRichEditor(content: string): string {
  return content
    .replace(/^<p>/, '')
    .replace(/<\/p>$/, '')
    .replace(/<br>/g, '\n')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
}

// Article bodies exceed URL limits when fetched during SPA navigations, so use POST here.
export const parseContentMarkdown = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => markdownInputSchema.parse(data))
  .handler(async ({ data: { content } }): Promise<{ html: string; isMarkdown: boolean }> => {
    if (!content) return { html: '', isMarkdown: false }

    if (!isMarkdownContent(content)) {
      return { html: content, isMarkdown: false }
    }

    const { marked } = await import('marked')

    marked.setOptions({
      gfm: true,
      breaks: false,
    })

    const markdown = extractMarkdownFromRichEditor(content)
    const html = await marked.parse(markdown)

    return { html, isMarkdown: true }
  })
