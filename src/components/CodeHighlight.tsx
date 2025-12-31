import { type BundledLanguage, codeToHtml } from 'shiki'

interface CodeHighlightProps {
  content: string
}

// Synchronous component - content should be pre-processed by highlightCodeBlocks in the loader
export default function CodeHighlight({ content }: CodeHighlightProps) {
  return (
    <div
      className="prose prose-lg prose-gray prose-headings:font-bold prose-headings:text-black prose-headings:tracking-tight prose-headings:scroll-m-20 prose-h1:text-3xl prose-h1:mb-8 prose-h1:mt-12 prose-h1:leading-tight prose-h2:text-2xl prose-h2:mb-6 prose-h2:mt-10 prose-h2:leading-tight prose-h2:border-b prose-h2:border-gray-100 prose-h2:pb-2 prose-h3:text-xl prose-h3:mb-4 prose-h3:mt-8 prose-h3:leading-tight prose-h4:text-lg prose-h4:mb-3 prose-h4:mt-6 prose-h4:leading-tight prose-h5:text-base prose-h5:mb-2 prose-h5:mt-4 prose-h5:leading-tight prose-h6:text-sm prose-h6:mb-2 prose-h6:mt-3 prose-h6:leading-tight prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-base prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-a:underline-offset-4 prose-a:decoration-1 prose-a:transition-colors prose-a:duration-200 prose-strong:text-black prose-strong:font-semibold prose-em:text-gray-700 prose-em:italic prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-600 prose-blockquote:bg-blue-50 prose-blockquote:py-4 prose-blockquote:rounded-r-lg prose-blockquote:my-8 prose-blockquote:font-medium prose-ul:my-6 prose-ol:my-6 prose-li:my-2 prose-li:text-gray-700 prose-li:leading-relaxed prose-ul:ml-6 prose-ol:ml-6 prose-li:marker:text-gray-400 prose-hr:border-gray-200 prose-hr:my-12 prose-table:text-sm prose-th:font-semibold prose-th:text-black prose-th:bg-gray-50 prose-th:py-3 prose-th:px-4 prose-th:border prose-th:border-gray-200 prose-th:text-left prose-td:py-3 prose-td:px-4 prose-td:border prose-td:border-gray-200 prose-td:text-gray-700 prose-code:text-sm prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-gray-800 prose-code:before:content-none prose-code:after:content-none prose-code:tracking-wide prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-6 prose-pre:overflow-x-auto prose-pre:shadow-lg prose-pre:border prose-pre:border-gray-200 prose-pre:relative prose-pre:before:content-['Code'] prose-pre:before:absolute prose-pre:before:top-3 prose-pre:before:right-3 prose-pre:before:text-xs prose-pre:before:text-gray-400 prose-pre:before:font-mono prose-pre:before:bg-gray-800 prose-pre:before:px-2 prose-pre:before:py-1 prose-pre:before:rounded prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8 prose-img:border prose-img:border-gray-200 prose-figcaption:text-sm prose-figcaption:text-gray-500 prose-figcaption:text-center prose-figcaption:mt-2 md:prose-lg lg:prose-xl max-w-none [&_blockquote]:first:mt-0 [&_h1]:first:mt-0 [&_h2]:first:mt-0 [&_h3]:first:mt-0 [&_ol]:first:mt-0 [&_p]:first:mt-0 [&_table]:first:mt-0 [&_ul]:first:mt-0"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: HTML content from microCMS
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

// Export the highlight function to be used in loaders
export async function highlightCodeBlocks(html: string): Promise<string> {
  // Guard against undefined/null input
  if (!html) {
    return ''
  }

  // Match all <pre><code> blocks
  const codeBlockRegex = /<pre><code(?:\s+class="language-(\w+)")?>([\s\S]*?)<\/code><\/pre>/g

  let result = html
  const matches = Array.from(html.matchAll(codeBlockRegex))

  for (const match of matches) {
    const [fullMatch, language = '', code] = match

    // Decode HTML entities
    const decodedCode = decodeHtmlEntities(code)

    // Auto-detect language if not specified (default to shell for plain text)
    let detectedLang: BundledLanguage = 'shell'
    if (language) {
      detectedLang = language as BundledLanguage
    } else {
      // Robust language detection using regex
      if (/import|export|const|let|var|class|function|=>|React\.|\(props\)/.test(decodedCode)) {
        detectedLang = 'javascript'
      } else if (
        /\b(npm|npx|yarn|bun|pnpm|cd|ls|git|docker)\b/.test(decodedCode) ||
        decodedCode.startsWith('$ ')
      ) {
        detectedLang = 'bash'
      } else if (
        /\btype\s+\w+\s*=/.test(decodedCode) ||
        /\binterface\s+\w+\s*\{/.test(decodedCode) ||
        /\bclass\s+\w+\s+(extends|implements)\b/.test(decodedCode) ||
        /\benum\s+\w+\s*\{/.test(decodedCode)
      ) {
        // TypeScript-specific detection (avoid Python "class Foo:" false positives)
        detectedLang = 'typescript'
      }
    }

    try {
      // Use Shiki to highlight with inline styles
      const highlighted = await codeToHtml(decodedCode, {
        lang: detectedLang,
        theme: 'github-dark',
      })

      result = result.replace(fullMatch, highlighted)
      // biome-ignore lint/suspicious/noExplicitAny: Error object type is dynamic
    } catch (_error: any) {
      // Fallback to original content if highlighting fails
      result = result.replace(fullMatch, fullMatch)
    }
  }

  return result
}

function decodeHtmlEntities(text: string): string {
  // Common named HTML entities
  const entities: Record<string, string> = {
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™',
    '&euro;': '€',
    '&pound;': '£',
    '&yen;': '¥',
    '&hellip;': '…',
    '&mdash;': '—',
    '&ndash;': '–',
    '&laquo;': '«',
    '&raquo;': '»',
    '&ldquo;': '"',
    '&rdquo;': '"',
    '&lsquo;': '\u2018',
    '&rsquo;': '\u2019',
  }

  return text.replace(/&(?:#x([0-9a-fA-F]+)|#(\d+)|(\w+));/g, (entity, hex, dec, named) => {
    // Numeric entity (hex): &#x27; -> '
    if (hex) {
      return String.fromCharCode(Number.parseInt(hex, 16))
    }
    // Numeric entity (decimal): &#39; -> '
    if (dec) {
      return String.fromCharCode(Number.parseInt(dec, 10))
    }
    // Named entity: &apos; -> '
    if (named) {
      return entities[`&${named};`] || entity
    }
    return entity
  })
}
