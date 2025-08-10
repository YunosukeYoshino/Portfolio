import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://yunosukeyoshino.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/assets/icons/', '/lib/'],
      },
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'OpenAI',
          'ClaudeBot',
          'Claude-Web',
          'PerplexityBot',
          'GoogleBot-AI',
          'Google-Extended',
          'Bard',
          'Gemini',
          'Meta-AI',
          'YouBot',
          'cohere-ai',
          'anthropic-ai',
        ],
        allow: ['/', '/article', '/article/*'],
        disallow: ['/api/', '/admin/', '/_next/', '/assets/icons/', '/lib/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
