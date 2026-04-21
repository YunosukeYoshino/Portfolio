import { useEffect } from 'react'

declare global {
  interface Navigator {
    modelContext?: {
      provideContext?(options: {
        tools: Array<{
          name: string
          description: string
          inputSchema: Record<string, unknown>
          execute: (args: Record<string, unknown>) => Promise<unknown>
        }>
      }): void
    }
  }
}

export function WebMCPProvider() {
  useEffect(() => {
    if (typeof navigator.modelContext?.provideContext !== 'function') return

    try {
      navigator.modelContext.provideContext({
        tools: [
          {
            name: 'getAbout',
            description:
              "Get a Markdown overview of Yunosuke Yoshino's portfolio: skills, selected works, background, and links.",
            inputSchema: { type: 'object', properties: {} },
            execute: async () => {
              const res = await fetch('/', { headers: { Accept: 'text/markdown' } })
              return { content: await res.text() }
            },
          },
          {
            name: 'getArticle',
            description:
              'Get the Markdown content of a specific blog article by its slug (the last path segment of the article URL).',
            inputSchema: {
              type: 'object',
              properties: {
                slug: {
                  type: 'string',
                  description: 'Article slug, e.g. "my-article" from /article/my-article',
                },
              },
              required: ['slug'],
            },
            execute: async (args) => {
              const slug = args.slug as string
              const res = await fetch(`/article/${slug}`, { headers: { Accept: 'text/markdown' } })
              if (!res.ok) return { error: 'Article not found' }
              return { content: await res.text() }
            },
          },
          {
            name: 'sendContactMessage',
            description:
              'Send a contact message to Yunosuke Yoshino via the portfolio contact form.',
            inputSchema: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Sender full name (1–100 chars)' },
                email: { type: 'string', description: 'Sender email address' },
                subject: { type: 'string', description: 'Message subject (1–200 chars)' },
                message: { type: 'string', description: 'Message body (1–1000 chars)' },
                company: { type: 'string', description: 'Organisation name (optional)' },
              },
              required: ['name', 'email', 'subject', 'message'],
            },
            execute: async (args) => {
              const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(args),
              })
              return res.json()
            },
          },
        ],
      })
    } catch {
      // WebMCP is experimental; silently ignore if the API shape differs
    }
  }, [])

  return null
}
