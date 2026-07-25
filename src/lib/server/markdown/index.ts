const MARKDOWN_HEADING_PATTERN = /^<p>(#{1,6}\s)/

export function isMarkdownContent(content: string): boolean {
  if (!content.startsWith('<p>')) return false
  const inner = content.replace(/^<p>/, '').replace(/<\/p>$/, '')
  const decoded = inner.replace(/<br>/g, '\n').replace(/&gt;/g, '>').replace(/&lt;/g, '<')
  return MARKDOWN_HEADING_PATTERN.test(content) || /\n#{1,6}\s/.test(decoded)
}

export function extractMarkdownFromRichEditor(content: string): string {
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

/**
 * Framework-agnostic core.
 * microCMS のリッチエディタ本文が Markdown を含む場合は marked で HTML へ変換する。
 * ビルド時描画（articleRender）と LLM 向け markdown 配信（article）の双方から呼ばれる。
 */
export async function parseContentMarkdownCore(content: string): Promise<{
  html: string
  isMarkdown: boolean
}> {
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
}
