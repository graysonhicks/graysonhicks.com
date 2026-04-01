import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const alt = 'Blog - Grayson Hicks'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 80px',
          background: '#0a0a0f',
          fontFamily: 'monospace',
        }}
      >
        {/* Top border glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #00ffff, #ff00ff, transparent)',
          }}
        />

        {/* Corner accents */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            width: '60px',
            height: '60px',
            borderTop: '2px solid rgba(0, 255, 255, 0.2)',
            borderLeft: '2px solid rgba(0, 255, 255, 0.2)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            width: '60px',
            height: '60px',
            borderBottom: '2px solid rgba(255, 0, 255, 0.2)',
            borderRight: '2px solid rgba(255, 0, 255, 0.2)',
          }}
        />

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', zIndex: 1 }}>
          <div
            style={{
              fontSize: '16px',
              letterSpacing: '6px',
              color: '#00ffff',
              textTransform: 'uppercase' as const,
              opacity: 0.7,
            }}
          >
            GRAYSON HICKS // BLOG
          </div>

          <div
            style={{
              fontSize: '56px',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.2,
              textShadow: '0 0 30px rgba(0, 255, 255, 0.3)',
            }}
          >
            Technical Writing
          </div>

          <div
            style={{
              fontSize: '22px',
              color: '#999',
              lineHeight: 1.5,
              maxWidth: '700px',
            }}
          >
            Articles on web development, React, TypeScript, AI, and modern software engineering
          </div>
        </div>

        {/* Bottom section */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: '14px',
              letterSpacing: '4px',
              color: '#555',
            }}
          >
            graysonhicks.com/blog
          </div>
        </div>

        {/* Bottom border glow */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #ff00ff, #00ffff, transparent)',
          }}
        />
      </div>
    ),
    { ...size }
  )
}
