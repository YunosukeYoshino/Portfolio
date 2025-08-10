/* eslint-disable react/jsx-key */
import { ImageResponse } from 'next/og'
import { getBlogDetail } from '@/lib/microcms'

export const runtime = 'edge'
export const dynamic = 'force-static'
export const revalidate = 86400 // 24 hours
export const alt = 'Article'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
  try {
    const blog = await getBlogDetail(params.slug)

    return new ImageResponse(
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
              fontSize: blog.title.length > 30 ? 48 : 60,
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
                backgroundColor: '#6b7280',
                marginRight: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 24,
                fontWeight: 600,
              }}
            >
              Y
            </div>

            <div
              style={{
                fontSize: 24,
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
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontSize: 48,
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
