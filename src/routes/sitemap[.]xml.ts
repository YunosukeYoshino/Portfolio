import { createFileRoute } from '@tanstack/react-router'
import { useCases } from '@/infrastructure/di'

const SITE_URL = 'https://yunosukeyoshino.com'

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const ids = await useCases.getAllBlogIds.execute()
        const buildDate = new Date().toISOString().split('T')[0]

        const staticRoutes = [
          { path: '/', lastmod: buildDate, changefreq: 'daily', priority: '1.0' },
          { path: '/about/', lastmod: buildDate, changefreq: 'monthly', priority: '0.8' },
          { path: '/article/page/1/', lastmod: buildDate, changefreq: 'weekly', priority: '0.8' },
          { path: '/contact/', lastmod: buildDate, changefreq: 'monthly', priority: '0.5' },
          { path: '/privacy-policy/', lastmod: buildDate, changefreq: 'monthly', priority: '0.3' },
        ]

        const dynamicRoutes = ids.map((id) => ({
          path: `/article/${id}/`,
          lastmod: buildDate,
          changefreq: 'weekly',
          priority: '0.8',
        }))

        const allRoutes = [...staticRoutes, ...dynamicRoutes]

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map((route) => {
    return `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
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
