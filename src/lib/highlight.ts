import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

const highlightInputSchema = z.object({
  html: z.string(),
})

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

// Null ref at module level - harmless on the client.
// The actual import('shiki') lives INSIDE the handler body which
// TanStack Start strips from the client bundle entirely.
// biome-ignore lint/suspicious/noExplicitAny: Shiki type only available server-side
let cachedHighlighterPromise: Promise<any> | null = null

// Highlight payloads can be large on client-side navigations, so send them in the request body.
export const highlightContent = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => highlightInputSchema.parse(data))
  .handler(async ({ data: { html } }): Promise<string> => {
    if (!html) return ''

    // Singleton: reuse the highlighter across prerender calls in the same process
    if (!cachedHighlighterPromise) {
      cachedHighlighterPromise = import('shiki').then(({ createHighlighter }) =>
        createHighlighter({
          themes: ['github-dark-default'],
          langs: [...SUPPORTED_LANGS],
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
  })

function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
    '&copy;': '\u00A9',
    '&reg;': '\u00AE',
    '&trade;': '\u2122',
    '&euro;': '\u20AC',
    '&pound;': '\u00A3',
    '&yen;': '\u00A5',
    '&hellip;': '\u2026',
    '&mdash;': '\u2014',
    '&ndash;': '\u2013',
    '&laquo;': '\u00AB',
    '&raquo;': '\u00BB',
    '&ldquo;': '\u201C',
    '&rdquo;': '\u201D',
    '&lsquo;': '\u2018',
    '&rsquo;': '\u2019',
  }

  return text.replace(/&(?:#x([0-9a-fA-F]+)|#(\d+)|(\w+));/g, (entity, hex, dec, named) => {
    if (hex) return String.fromCharCode(Number.parseInt(hex, 16))
    if (dec) return String.fromCharCode(Number.parseInt(dec, 10))
    if (named) return entities[`&${named};`] || entity
    return entity
  })
}
