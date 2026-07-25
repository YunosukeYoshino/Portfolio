import type { APIRoute } from 'astro'

import { useCases } from '@/infrastructure/di'
import { SITE_URL } from '@/lib/siteMetadata'

// ビルド時に静的生成（全記事 slug を取得して網羅）。
export const GET: APIRoute = async () => {
  const ids = await useCases.getAllBlogIds.execute()
  const buildDate = new Date().toISOString().split('T')[0]

  const routeConfigs: Record<string, { changefreq: string; priority: string }> = {
    '/': { changefreq: 'daily', priority: '1.0' },
    '/article/page/1/': { changefreq: 'weekly', priority: '0.8' },
    '/about/': { changefreq: 'monthly', priority: '0.8' },
    '/contact/': { changefreq: 'monthly', priority: '0.5' },
    '/privacy-policy/': { changefreq: 'monthly', priority: '0.3' },
  }

  const staticRoutes = Object.entries(routeConfigs).map(([path, config]) => ({
    path,
    lastmod: buildDate,
    changefreq: config.changefreq,
    priority: config.priority,
  }))

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
  .map(
    (route) => `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
