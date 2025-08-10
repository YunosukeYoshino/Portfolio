/* eslint-disable react/jsx-key */
import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const dynamic = 'force-static'
export const revalidate = false
export const alt = 'Yunosuke Yoshino Portfolio'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
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
            fontSize: 64,
            fontWeight: 700,
            color: '#1a1a1a',
            lineHeight: 1.2,
            letterSpacing: '-0.025em',
            marginBottom: 20,
          }}
        >
          Yunosuke Yoshino
        </div>

        <div
          style={{
            fontSize: 36,
            fontWeight: 400,
            color: '#6b7280',
            lineHeight: 1.3,
            marginBottom: 40,
          }}
        >
          Frontend Engineer specializing in React, Next.js, TypeScript
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
              width: 80,
              height: 80,
              borderRadius: 40,
              marginRight: 24,
              overflow: 'hidden',
              border: '4px solid #e5e7eb',
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
            yunosukeyoshino.com
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
    }
  )
}
