const SUPPORTED_LANGS = [
  'javascript',
  'typescript',
  'jsx',
  'tsx',
  'bash',
  'shell',
  'css',
  'json',
  'html',
  'markdown',
] as const

type SupportedLang = (typeof SUPPORTED_LANGS)[number]

// Workers cannot initialize the default WASM engine from binary data,
// so use Shiki's JavaScript regex engine instead.
// biome-ignore lint/suspicious/noExplicitAny: Shiki type only available server-side
let cachedHighlighterPromise: Promise<any> | null = null

/**
 * Framework-agnostic core.
 * HTML 中の <pre><code> ブロックを Shiki でハイライトする。
 * Astro のビルド時描画から呼ばれる。
 */
export async function highlightContentCore(html: string): Promise<string> {
  if (!html) return ''

  // Singleton: reuse the highlighter across prerender calls in the same process
  if (!cachedHighlighterPromise) {
    cachedHighlighterPromise = Promise.all([
      import('shiki'),
      import('shiki/engine/javascript'),
    ]).then(([{ createHighlighter }, { createJavaScriptRegexEngine }]) =>
      createHighlighter({
        themes: ['github-dark-default'],
        langs: [...SUPPORTED_LANGS],
        engine: createJavaScriptRegexEngine({ forgiving: true }),
      })
    )
  }
  const highlighter = await cachedHighlighterPromise

  const codeBlockRegex = /<pre><code(?:\s+class="language-(\w+)")?>([\s\S]*?)<\/code><\/pre>/g
  let result = html
  const matches = Array.from(html.matchAll(codeBlockRegex))

  for (const match of matches) {
    const [fullMatch, language = '', code] = match
    const decodedCode = decodeHtmlEntities(code)

    let detectedLang: SupportedLang = 'shell'
    if (language && SUPPORTED_LANGS.includes(language as SupportedLang)) {
      detectedLang = language as SupportedLang
    } else if (!language) {
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
        detectedLang = 'typescript'
      }
    }

    try {
      const highlighted = highlighter.codeToHtml(decodedCode, {
        lang: detectedLang,
        theme: 'github-dark-default',
      })
      result = result.replace(fullMatch, highlighted)
    } catch {
      // Fallback: keep original content if highlighting fails
    }
  }

  return result
}

function decodeHtmlEntities(text: string): string {
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
    '&ldquo;': '“',
    '&rdquo;': '”',
    '&lsquo;': '‘',
    '&rsquo;': '’',
  }

  return text.replace(/&(?:#x([0-9a-fA-F]+)|#(\d+)|(\w+));/g, (entity, hex, dec, named) => {
    if (hex) return String.fromCharCode(Number.parseInt(hex, 16))
    if (dec) return String.fromCharCode(Number.parseInt(dec, 10))
    if (named) return entities[`&${named};`] || entity
    return entity
  })
}
