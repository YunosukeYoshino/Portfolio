import { useCases } from '@/infrastructure/di'

import { extractMarkdownFromRichEditor, isMarkdownContent } from './index'

/**
 * LLM クライアント向けに、記事本文を markdown ソースとして取り出す。
 * リッチエディタ本文が markdown を含まない場合は null を返す。
 * core の判定・展開処理は index.ts に依存し、二重実装しない。
 */
export async function getArticleMarkdown(slug: string): Promise<string | null> {
  const blog = await useCases.getBlogDetail.execute(slug).catch(() => null)
  if (!blog) return null
  if (!isMarkdownContent(blog.content)) return null
  const body = extractMarkdownFromRichEditor(blog.content)
  return `# ${blog.title}\n\npublished: ${blog.publishedAt}\n\n${body}\n`
}
