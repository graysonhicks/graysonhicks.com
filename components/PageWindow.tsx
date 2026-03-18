import { ReactNode } from 'react'
import Link from 'next/link'

interface PageWindowProps {
  title: string
  children: ReactNode
  accentColor?: 'cyan' | 'magenta' | 'green' | 'yellow'
  backHref?: string
}

const accents = {
  cyan: { glow: 'rgba(0,255,255,0.12)', text: '#00ffff', border: 'rgba(0,255,255,0.2)', stripe: 'rgba(0,255,255,0.06)' },
  magenta: { glow: 'rgba(255,0,255,0.12)', text: '#ff00ff', border: 'rgba(255,0,255,0.2)', stripe: 'rgba(255,0,255,0.06)' },
  green: { glow: 'rgba(0,255,65,0.12)', text: '#00ff41', border: 'rgba(0,255,65,0.2)', stripe: 'rgba(0,255,65,0.06)' },
  yellow: { glow: 'rgba(255,255,0,0.12)', text: '#ffff00', border: 'rgba(255,255,0,0.2)', stripe: 'rgba(255,255,0,0.06)' },
}

export default function PageWindow({ title, children, accentColor = 'cyan', backHref }: PageWindowProps) {
  const accent = accents[accentColor]

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 md:py-10">
      <div
        className="rounded-[5px] overflow-hidden"
        style={{
          border: `1px solid ${accent.border}`,
          background: '#0c0c1e',
          boxShadow: `0 8px 40px rgba(0,0,0,0.6), 0 0 20px ${accent.glow}`,
        }}
      >
        {/* Title bar */}
        <div
          className="relative h-[28px] flex items-center px-2.5 gap-2 select-none"
          style={{
            background: 'linear-gradient(180deg, #1a1a38 0%, #12122a 50%, #0e0e22 100%)',
          }}
        >
          {/* Pinstripes */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `repeating-linear-gradient(0deg, transparent, transparent 1px, ${accent.stripe} 1px, ${accent.stripe} 2px)`,
              opacity: 0.6,
            }}
          />

          {/* Traffic lights */}
          <div className="relative flex items-center gap-[6px] z-10">
            {backHref ? (
              <Link
                href={backHref}
                className="w-3 h-3 rounded-full border block"
                style={{ background: 'linear-gradient(180deg, #ff6058, #e33e32)', borderColor: '#c8302a' }}
                title="Close"
              />
            ) : (
              <Link
                href="/"
                className="w-3 h-3 rounded-full border block"
                style={{ background: 'linear-gradient(180deg, #ff6058, #e33e32)', borderColor: '#c8302a' }}
                title="Close"
              />
            )}
            <span
              className="w-3 h-3 rounded-full border block"
              style={{ background: 'linear-gradient(180deg, #ffc130, #e5a000)', borderColor: '#c8960a' }}
            />
            <span
              className="w-3 h-3 rounded-full border block"
              style={{ background: 'linear-gradient(180deg, #27ca40, #1aad2e)', borderColor: '#1a9028' }}
            />
          </div>

          {/* Title */}
          <div className="relative flex-1 text-center z-10 pr-10">
            <span
              className="text-[11px] tracking-[0.15em] font-mono"
              style={{ color: accent.text, textShadow: `0 0 6px ${accent.glow}` }}
            >
              {title}
            </span>
          </div>
        </div>

        {/* Ridge */}
        <div className="h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${accent.border}, transparent)` }} />

        {/* Content */}
        <div
          className="p-5 sm:p-8"
          style={{ background: 'linear-gradient(180deg, #0c0c1e 0%, #0a0a18 100%)' }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
