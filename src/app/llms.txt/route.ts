import { getBlogs } from '@/lib/microcms'

export const dynamic = 'force-static'
export const revalidate = 86400 // 24 hours

export async function GET() {
  const baseUrl = 'https://yunosukeyoshino.com'

  try {
    // Get all blog posts for dynamic content
    const blogsResponse = await getBlogs({
      fields: 'id,title,publishedAt',
      limit: 1000,
      orders: '-publishedAt',
    })

    // Build the llms.txt content
    const content = `# Yunosuke Yoshino Portfolio

This is the portfolio website of Yunosuke Yoshino, a frontend developer specializing in React, Next.js, and modern web technologies.

## Navigation

### Main Pages
- Home: ${baseUrl}/
  Overview of Yunosuke Yoshino's skills, experience, and portfolio

- Articles: ${baseUrl}/article
  Technical blog posts about frontend development, UI/UX design, and web technologies

### Blog Articles
${blogsResponse.contents
  .map(
    blog => `- ${blog.title}: ${baseUrl}/article/${blog.id}
  Published: ${new Date(blog.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}`
  )
  .join('\n')}

## About the Site

This portfolio website showcases:
- Professional frontend development projects
- Technical articles and tutorials
- Modern web development practices using Next.js 15
- Integration with microCMS for content management

## Technologies Used

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS + SCSS modules
- **Content**: microCMS headless CMS
- **Deployment**: Vercel/Cloudflare Pages
- **Performance**: Server Components, Static Generation

## Contact

For professional inquiries or collaboration opportunities, please visit the main website.
`

    return new Response(content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    })
  } catch {
    // Fallback content if blog fetching fails
    const fallbackContent = `# Yunosuke Yoshino Portfolio

This is the portfolio website of Yunosuke Yoshino, a frontend developer specializing in React, Next.js, and modern web technologies.

## Navigation

### Main Pages
- Home: ${baseUrl}/
  Overview of Yunosuke Yoshino's skills, experience, and portfolio

- Articles: ${baseUrl}/article
  Technical blog posts about frontend development, UI/UX design, and web technologies

## About the Site

This portfolio website showcases professional frontend development projects and technical articles.

## Technologies Used

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS + SCSS modules
- **Content**: microCMS headless CMS
- **Deployment**: Vercel/Cloudflare Pages

## Contact

For professional inquiries or collaboration opportunities, please visit the main website.
`

    return new Response(fallbackContent, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    })
  }
}
