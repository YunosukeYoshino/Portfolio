import { codeToHtml } from 'shiki'

interface CodeHighlightProps {
  content: string
}

function decodeHtmlEntities(str: string): string {
  const htmlEntities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#x27;': "'",
    '&#x2F;': '/',
    '&#x60;': '`',
    '&#x3D;': '=',
  }

  return str.replace(/&[a-zA-Z0-9#]+;/g, (entity) => {
    return htmlEntities[entity] || entity
  })
}

async function processCodeBlocks(html: string): Promise<string> {
  // マッチするパターン：<pre><code class="language-xxx">...</code></pre>
  const codeBlockRegex = /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g

  let result = html
  const matches = [...html.matchAll(codeBlockRegex)]

  for (const match of matches) {
    const [fullMatch, language, code] = match
    const decodedCode = decodeHtmlEntities(code.trim())

    try {
      const highlighted = await codeToHtml(decodedCode, {
        lang: language,
        themes: {
          light: 'github-light',
          dark: 'github-dark',
        },
        defaultColor: false,
        cssVariablePrefix: '--shiki-',
      })

      result = result.replace(fullMatch, highlighted)
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: Error logging is necessary for debugging
      console.error(`Error highlighting ${language} code:`, error)
      // エラーの場合は元のコードブロックを保持
    }
  }

  return result
}

export default async function CodeHighlight({ content }: CodeHighlightProps) {
  const highlightedContent = await processCodeBlocks(content)

  return (
    <div
      className="prose prose-lg max-w-none prose-gray prose-headings:font-bold prose-headings:text-black prose-a:text-black hover:prose-a:text-gray-700 prose-strong:text-black"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: HTML content from microCMS is sanitized and processed
      dangerouslySetInnerHTML={{ __html: highlightedContent }}
    />
  )
}
