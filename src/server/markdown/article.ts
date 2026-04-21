import { useCases } from '@/infrastructure/di'

const MARKDOWN_HEADING_PATTERN = /^<p>(#{1,6}\s)/

function isMarkdownRichEditor(content: string): boolean {
  if (!content.startsWith('<p>')) return false
  const inner = content.replace(/^<p>/, '').replace(/<\/p>$/, '')
  const decoded = inner.replace(/<br>/g, '\n').replace(/&gt;/g, '>').replace(/&lt;/g, '<')
  return MARKDOWN_HEADING_PATTERN.test(content) || /\n#{1,6}\s/.test(decoded)
}

function toMarkdownSource(content: string): string {
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

export async function getArticleMarkdown(slug: string): Promise<string | null> {
  const blog = await useCases.getBlogDetail.execute(slug).catch(() => null)
  if (!blog) return null
  if (!isMarkdownRichEditor(blog.content)) return null
  const body = toMarkdownSource(blog.content)
  return `# ${blog.title}\n\npublished: ${blog.publishedAt}\n\n${body}\n`
}
