/* eslint-disable react/jsx-key */
import { ImageResponse } from 'next/og'
import { getAllBlogIds, getBlogDetail } from '@/lib/microcms'

export const runtime = 'nodejs'
export const dynamic = 'force-static'
export const revalidate = 86400 // 24 hours
export const alt = 'Article'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

// Generate static params for pre-rendering OG images
export async function generateStaticParams() {
  try {
    const blogIds = await getAllBlogIds()
    return blogIds.map((id) => ({
      slug: id,
    }))
  } catch (_error) {
    return []
  }
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const blog = await getBlogDetail(slug)

    return new ImageResponse(
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundImage: 'linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)',
          padding: 60,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            width: '100%',
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 60,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            flex: 1,
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              fontSize: blog.title.length > 48 ? 64 : 80,
              fontWeight: 700,
              color: '#1a1a1a',
              lineHeight: 1.2,
              letterSpacing: '-0.025em',
              marginBottom: 40,
              maxWidth: '100%',
              wordWrap: 'break-word',
            }}
          >
            {blog.title}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              width: '100%',
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                marginRight: 20,
                overflow: 'hidden',
                border: '3px solid #e5e7eb',
                backgroundImage: `url(https://yunosukeyoshino.com/assets/images/my-image.jpg)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />

            <div
              style={{
                fontSize: 40,
                fontWeight: 500,
                color: '#374151',
              }}
            >
              Yunosuke Yoshino
            </div>
          </div>
        </div>
      </div>,
      {
        ...size,
      }
    )
  } catch (_error) {
    return new ImageResponse(
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: 'linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)',
          color: 'white',
          fontSize: 64,
          fontWeight: 600,
        }}
      >
        Yunosuke Yoshino Portfolio
      </div>,
      {
        ...size,
      }
    )
  }
}
