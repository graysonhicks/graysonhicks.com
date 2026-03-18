'use client'

import { useState, ReactNode } from 'react'

interface CyberCardProps {
  children: ReactNode
  href?: string
  accentColor?: 'cyan' | 'magenta' | 'green'
  className?: string
}

const accentMap = {
  cyan: {
    border: 'border-cyber-cyan/20 hover:border-cyber-cyan/50',
    shadow: 'hover:shadow-[0_0_20px_rgba(0,255,255,0.15)]',
    corner: 'bg-cyber-cyan',
  },
  magenta: {
    border: 'border-cyber-magenta/20 hover:border-cyber-magenta/50',
    shadow: 'hover:shadow-[0_0_20px_rgba(255,0,255,0.15)]',
    corner: 'bg-cyber-magenta',
  },
  green: {
    border: 'border-cyber-green/20 hover:border-cyber-green/50',
    shadow: 'hover:shadow-[0_0_20px_rgba(0,255,65,0.15)]',
    corner: 'bg-cyber-green',
  },
}

export default function CyberCard({
  children,
  href,
  accentColor = 'cyan',
  className = '',
}: CyberCardProps) {
  const [hovered, setHovered] = useState(false)
  const accent = accentMap[accentColor]

  const content = (
    <div
      className={`relative bg-cyber-panel/60 backdrop-blur-sm border ${accent.border} ${accent.shadow} transition-all duration-300 p-5 ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Corner accents */}
      <span className={`absolute top-0 left-0 w-2 h-[1px] ${accent.corner} transition-all duration-300 ${hovered ? 'w-4' : ''}`} />
      <span className={`absolute top-0 left-0 w-[1px] h-2 ${accent.corner} transition-all duration-300 ${hovered ? 'h-4' : ''}`} />
      <span className={`absolute bottom-0 right-0 w-2 h-[1px] ${accent.corner} transition-all duration-300 ${hovered ? 'w-4' : ''}`} />
      <span className={`absolute bottom-0 right-0 w-[1px] h-2 ${accent.corner} transition-all duration-300 ${hovered ? 'h-4' : ''}`} />

      {children}
    </div>
  )

  if (href) {
    const isExternal = href.startsWith('http')
    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="block no-underline">
          {content}
        </a>
      )
    }
    // For internal links, use next/link in the parent
    return content
  }

  return content
}
