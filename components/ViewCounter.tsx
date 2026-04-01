'use client'

import { useEffect, useState } from 'react'

interface ViewCounterProps {
  slug: string
  accentColor?: 'cyan' | 'magenta' | 'green' | 'yellow'
  increment?: boolean
}

const colors = {
  cyan: { text: '#00ffff', glow: 'rgba(0,255,255,0.4)', border: 'rgba(0,255,255,0.15)', bg: 'rgba(0,255,255,0.04)' },
  magenta: { text: '#ff00ff', glow: 'rgba(255,0,255,0.4)', border: 'rgba(255,0,255,0.15)', bg: 'rgba(255,0,255,0.04)' },
  green: { text: '#00ff41', glow: 'rgba(0,255,65,0.4)', border: 'rgba(0,255,65,0.15)', bg: 'rgba(0,255,65,0.04)' },
  yellow: { text: '#ffff00', glow: 'rgba(255,255,0,0.4)', border: 'rgba(255,255,0,0.15)', bg: 'rgba(255,255,0,0.04)' },
}

export default function ViewCounter({ slug, accentColor = 'cyan', increment = true }: ViewCounterProps) {
  const [count, setCount] = useState<number | null>(null)
  const c = colors[accentColor]

  useEffect(() => {
    if (increment) {
      fetch('/api/views', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
        .then((r) => r.json())
        .then((data) => setCount(data.count))
        .catch(() => {})
    } else {
      fetch(`/api/views?slug=${encodeURIComponent(slug)}`)
        .then((r) => r.json())
        .then((data) => setCount(data.count))
        .catch(() => {})
    }
  }, [slug, increment])

  const digits = count !== null ? String(count).padStart(6, '0') : '------'

  return (
    <div className="inline-flex items-center gap-2 font-mono">
      <span className="text-[9px] tracking-[0.2em] text-gray-600 uppercase">Views</span>
      <div
        className="inline-flex gap-[2px] px-1.5 py-0.5"
        style={{
          border: `1px solid ${c.border}`,
          background: c.bg,
        }}
      >
        {digits.split('').map((d, i) => (
          <span
            key={i}
            className="w-[10px] text-center text-[11px] tabular-nums tracking-tight"
            style={{
              color: c.text,
              textShadow: `0 0 6px ${c.glow}`,
              opacity: count !== null ? 1 : 0.3,
            }}
          >
            {d}
          </span>
        ))}
      </div>
    </div>
  )
}
