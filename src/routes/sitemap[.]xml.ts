import { createFileRoute } from '@tanstack/react-router'
import { useCases } from '@/infrastructure/di'

export const Route = createFileRoute('/sitemap.xml')({
  loader: () => null, // No client-side data needed
  server: {
    handlers: {
      GET: async () => {
        const ids = await useCases.getAllBlogIds.execute()
        const siteUrl = process.env.VITE_SITE_URL || 'https://yunosukeyoshino.com'

        const staticRoutes = ['/', '/contact', '/privacy-policy', '/article']

        const dynamicRoutes = ids.map((id) => `/article/${id}`)
        const allRoutes = [...staticRoutes, ...dynamicRoutes]

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map((route) => {
    return `  <url>
    <loc>${siteUrl}${route}</loc>
    <changefreq>${route === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`
  })
  .join('\n')}
</urlset>`

        return new Response(sitemap, {
          headers: {
            'Content-Type': 'application/xml',
          },
        })
      },
    },
  },
})
