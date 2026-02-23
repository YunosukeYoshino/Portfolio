import { createFileRoute } from '@tanstack/react-router'
import { useCases } from '@/infrastructure/di'
import { getRouter } from '@/router'

const SITE_URL = 'https://yunosukeyoshino.com'

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const ids = await useCases.getAllBlogIds.execute()
        const buildDate = new Date().toISOString().split('T')[0]

        const router = getRouter()

        // Define specific priorities and frequencies for static pages
        const routeConfigs: Record<string, { changefreq: string; priority: string }> = {
          '/': { changefreq: 'daily', priority: '1.0' },
          '/article/page/1/': { changefreq: 'weekly', priority: '0.8' },
          '/about/': { changefreq: 'monthly', priority: '0.8' },
          '/contact/': { changefreq: 'monthly', priority: '0.5' },
          '/privacy-policy/': { changefreq: 'monthly', priority: '0.3' },
        }

        const staticRoutes = Object.keys(router.routesById)
          .filter((path) => {
            // Exclude dynamic routes, root, and the sitemap itself
            return (
              !path.includes('$') &&
              path !== '__root__' &&
              path !== '/sitemap.xml' &&
              path !== '/article/'
            )
          })
          .map((basePath) => {
            // Ensure trailing slash logic
            const path = basePath === '/' ? '/' : `${basePath}/`

            // Apply custom config or fallback
            const config = routeConfigs[path] || { changefreq: 'monthly', priority: '0.5' }

            return {
              path,
              lastmod: buildDate,
              changefreq: config.changefreq,
              priority: config.priority,
            }
          })

        // Explicitly format /article/page/1/ since it contains a dynamic parameter in its raw route but needs a static link
        if (!staticRoutes.find((r) => r.path === '/article/page/1/')) {
          staticRoutes.push({
            path: '/article/page/1/',
            lastmod: buildDate,
            changefreq: 'weekly',
            priority: '0.8',
          })
        }

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
