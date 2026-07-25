import { isExternalUrl } from '@/lib/link'
import { highlightContentCore } from '@/lib/server/highlight'
import { parseContentMarkdownCore } from '@/lib/server/markdown'

/**
 * microCMS 記事本文をビルド時に HTML へ描画する。
 *
 * 1. Markdown（リッチエディタの # 見出し）を marked で HTML 化
 * 2. Shiki でコードブロックをハイライト
 * 3. TL;DR 段落と外部リンクの target/rel を付与
 *
 * 出力は Astro 側で set:html で注入する。元実装（TanStack loader + CodeHighlight
 * クライアント後処理）と等価な結果を作る。
 */
export async function renderArticleContent(content: string): Promise<string> {
  if (!content) return ''
  const { html: parsed } = await parseContentMarkdownCore(content)
  const highlighted = await highlightContentCore(parsed)
  return applyClientPostProcessing(highlighted)
}

/**
 * 元実装の CodeHighlight ref コールバック相当の HTML 後処理。
 * ビルド時（サーバー）に文字列置換で完結させることで React island を不要にする。
 */
function applyClientPostProcessing(html: string): string {
  return addTldrCallout(addExternalLinkAttrs(html))
}

/** TL;DR で始まる段落に .tldr-callout を付与する。 */
function addTldrCallout(html: string): string {
  return html.replace(/<p((?:\s[^>]*)?)>([\s\S]*?)<\/p>/g, (match, attrs: string, body: string) => {
    if (!body.trim().toUpperCase().startsWith('TL;DR')) return match
    const classMatch = attrs.match(/class="([^"]*)"/)
    if (classMatch) {
      return `<p${attrs.replace(/class="([^"]*)"/, 'class="$1 tldr-callout"')}>${body}</p>`
    }
    return `<p${attrs} class="tldr-callout">${body}</p>`
  })
}

/** 外部リンクに target="_blank" rel="noopener noreferrer" を付与する（既存指定は尊重）。 */
function addExternalLinkAttrs(html: string): string {
  return html.replace(/<a\s+([^>]*?)>/g, (match, attrs: string) => {
    const hrefMatch = attrs.match(/href="([^"]*)"/)
    if (!hrefMatch || !isExternalUrl(hrefMatch[1])) return match
    if (/target=/.test(attrs)) return match
    return `<a ${attrs} target="_blank" rel="noopener noreferrer">`
  })
}
