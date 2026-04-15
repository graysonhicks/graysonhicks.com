'use client'

import { useState, useRef, ReactNode, useEffect } from 'react'

interface MacWindowProps {
  title: string
  children: ReactNode
  maxHeight?: string
  zIndex?: number
  accentColor?: 'cyan' | 'magenta' | 'green' | 'yellow'
  onFocus?: () => void
  className?: string
  noPadding?: boolean
}

const accents = {
  cyan: { glow: 'rgba(0,255,255,0.15)', stripe: 'rgba(0,255,255,0.08)', text: '#00ffff', border: 'rgba(0,255,255,0.25)' },
  magenta: { glow: 'rgba(255,0,255,0.15)', stripe: 'rgba(255,0,255,0.08)', text: '#ff00ff', border: 'rgba(255,0,255,0.25)' },
  green: { glow: 'rgba(0,255,65,0.15)', stripe: 'rgba(0,255,65,0.08)', text: '#00ff41', border: 'rgba(0,255,65,0.25)' },
  yellow: { glow: 'rgba(255,255,0,0.15)', stripe: 'rgba(255,255,0,0.08)', text: '#ffff00', border: 'rgba(255,255,0,0.25)' },
}

export default function MacWindow({
  title,
  children,
  maxHeight,
  zIndex = 10,
  accentColor = 'cyan',
  onFocus,
  className = '',
  noPadding = false,
}: MacWindowProps) {
  const accent = accents[accentColor]
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const offsetStart = useRef({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent) => {
    onFocus?.()
    setIsDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY }
    offsetStart.current = { ...offset }
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      setOffset({
        x: offsetStart.current.x + (e.clientX - dragStart.current.x),
        y: offsetStart.current.y + (e.clientY - dragStart.current.y),
      })
    }

    const handleMouseUp = () => setIsDragging(false)

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  return (
    <div
      className={`mac-window relative ${className}`}
      style={{
        transform: offset.x || offset.y ? `translate(${offset.x}px, ${offset.y}px)` : undefined,
        zIndex,
        willChange: isDragging ? 'transform' : 'auto',
      }}
      onMouseDown={onFocus}
    >
      {/* Window shadow */}
      <div
        className="absolute -inset-[1px] rounded-[5px] pointer-events-none"
        style={{
          boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 1px ${accent.border}, 0 0 20px ${accent.glow}`,
        }}
      />

      {/* Window frame */}
      <div
        className="relative rounded-[5px] overflow-hidden h-full"
        style={{
          border: `1px solid ${accent.border}`,
          background: '#0c0c1e',
        }}
      >
        {/* Title bar */}
        <div
          className="relative h-[22px] flex items-center px-2 gap-2 select-none"
          style={{
            cursor: isDragging ? 'grabbing' : 'grab',
            background: `linear-gradient(180deg, #1a1a38 0%, #12122a 50%, #0e0e22 100%)`,
          }}
          onMouseDown={handleMouseDown}
        >
          {/* Horizontal pinstripes */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `repeating-linear-gradient(0deg, transparent, transparent 1px, ${accent.stripe} 1px, ${accent.stripe} 2px)`,
              opacity: 0.6,
            }}
          />

          {/* Traffic lights */}
          <div className="relative flex items-center gap-[5px] z-10">
            <button
              className="w-[11px] h-[11px] rounded-full border"
              style={{
                background: 'linear-gradient(180deg, #ff6058 0%, #e33e32 100%)',
                borderColor: '#c8302a',
              }}
              onClick={(e) => e.stopPropagation()}
              title="Close"
            />
            <button
              className="w-[11px] h-[11px] rounded-full border"
              style={{
                background: 'linear-gradient(180deg, #ffc130 0%, #e5a000 100%)',
                borderColor: '#c8960a',
              }}
              onClick={(e) => {
                e.stopPropagation()
                setIsCollapsed(!isCollapsed)
              }}
              title="Minimize"
            />
            <button
              className="w-[11px] h-[11px] rounded-full border"
              style={{
                background: 'linear-gradient(180deg, #27ca40 0%, #1aad2e 100%)',
                borderColor: '#1a9028',
              }}
              onClick={(e) => e.stopPropagation()}
              title="Zoom"
            />
          </div>

          {/* Title */}
          <div className="relative flex-1 text-center z-10 pr-8">
            <span
              className="text-[11px] tracking-[0.15em] font-mono"
              style={{ color: accent.text, textShadow: `0 0 6px ${accent.glow}` }}
            >
              {title}
            </span>
          </div>
        </div>

        {/* Title bar ridge */}
        <div className="h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${accent.border}, transparent)` }} />

        {/* Content */}
        {!isCollapsed && (
          <div
            className={`${noPadding ? '' : 'p-4'} overflow-y-auto overflow-x-hidden`}
            style={{
              maxHeight: maxHeight || 'none',
              background: 'linear-gradient(180deg, #0c0c1e 0%, #0a0a18 100%)',
            }}
          >
            {children}
          </div>
        )}
      </div>
    </div>
  )
}
