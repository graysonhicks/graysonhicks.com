'use client'

import Link from 'next/link'

interface DesktopIconProps {
  label: string
  href: string
  icon: string
  external?: boolean
}

export default function DesktopIcon({ label, href, icon, external }: DesktopIconProps) {
  const inner = (
    <div className="flex flex-col items-center gap-1 p-2 rounded group cursor-pointer hover:bg-cyber-cyan/5 transition-all w-20">
      <div
        className="w-10 h-10 rounded flex items-center justify-center text-lg border border-cyan-400/10 group-hover:border-cyan-400/30 transition-all"
        style={{
          background: 'linear-gradient(135deg, #141430 0%, #0c0c22 100%)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
        }}
      >
        <span className="group-hover:scale-110 transition-transform inline-block">{icon}</span>
      </div>
      <span
        className="text-[9px] font-mono tracking-wider text-gray-400 group-hover:text-cyber-cyan transition-colors text-center leading-tight"
        style={{ textShadow: 'none' }}
      >
        {label}
      </span>
    </div>
  )

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="no-underline">
        {inner}
      </a>
    )
  }

  return <Link href={href} className="no-underline">{inner}</Link>
}
