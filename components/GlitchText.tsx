'use client'

interface GlitchTextProps {
  children: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'p'
}

export default function GlitchText({
  children,
  className = '',
  as: Tag = 'h1',
}: GlitchTextProps) {
  return (
    <Tag className={`glitch ${className}`} data-text={children}>
      {children}
    </Tag>
  )
}
