'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const menuItems = [
  { name: 'Home', href: '/' },
  { name: 'Blog', href: '/blog' },
  { name: 'Talks', href: '/talks' },
]

const rightItems = [
  { name: 'Resume', href: '/GraysonHicksJuly2023Resume.pdf', external: true },
  { name: 'GitHub', href: 'https://github.com/graysonhicks', external: true },
]

export default function MenuBar() {
  const pathname = usePathname()
  const [time, setTime] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
      )
    }
    tick()
    const interval = setInterval(tick, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[100]">
      {/* Menu bar */}
      <div
        className="h-[25px] flex items-center px-3 gap-0 select-none"
        style={{
          background: 'linear-gradient(180deg, #1a1a38 0%, #111128 50%, #0d0d22 100%)',
          borderBottom: '1px solid rgba(0,255,255,0.15)',
          boxShadow: '0 1px 8px rgba(0,0,0,0.5)',
        }}
      >
        {/* "Apple" logo — cyberpunk skull icon */}
        <div className="px-2 mr-1">
          <span className="text-cyber-cyan text-[13px]" style={{ textShadow: '0 0 6px rgba(0,255,255,0.4)' }}>
            ⌬
          </span>
        </div>

        {/* Divider */}
        <div className="w-[1px] h-3 bg-cyan-400/15 mr-1" />

        {/* Main nav items — desktop */}
        <div className="hidden md:flex items-center gap-0">
          {menuItems.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`px-2.5 h-[25px] flex items-center text-[11px] font-mono tracking-wider transition-all ${
                  isActive
                    ? 'text-cyber-cyan bg-cyan-400/10'
                    : 'text-gray-400 hover:text-cyber-cyan hover:bg-cyan-400/5'
                }`}
                style={isActive ? { textShadow: '0 0 6px rgba(0,255,255,0.3)' } : undefined}
              >
                {item.name}
              </Link>
            )
          })}

          <div className="w-[1px] h-3 bg-cyan-400/10 mx-1" />

          {rightItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 h-[25px] flex items-center text-[11px] font-mono tracking-wider text-gray-500 hover:text-cyber-cyan hover:bg-cyan-400/5 transition-all"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden px-2 h-[25px] flex items-center text-[11px] font-mono text-cyber-cyan"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? '✕ Close' : '☰ Menu'}
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right side — clock + status */}
        <div className="hidden md:flex items-center gap-3">
          <span className="text-[10px] font-mono text-gray-500 tracking-wider">
            <span className="text-cyber-green/50">●</span> CONNECTED
          </span>
          <div className="w-[1px] h-3 bg-cyan-400/10" />
          <span
            className="text-[11px] font-mono text-gray-400 tracking-wider tabular-nums"
            style={{ textShadow: '0 0 4px rgba(0,255,255,0.2)' }}
          >
            {time}
          </span>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          className="md:hidden"
          style={{
            background: 'linear-gradient(180deg, #111128 0%, #0d0d22 100%)',
            borderBottom: '1px solid rgba(0,255,255,0.15)',
          }}
        >
          {[...menuItems, ...rightItems].map((item) => {
            const isExternal = 'external' in item && item.external
            const Component = isExternal ? 'a' : Link
            const extraProps = isExternal
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {}
            return (
              <Component
                key={item.name}
                href={item.href}
                {...(extraProps as any)}
                className="block px-5 py-2 text-[11px] font-mono tracking-wider text-gray-400 hover:text-cyber-cyan hover:bg-cyan-400/5 transition-all"
                onClick={() => setMobileOpen(false)}
              >
                {item.name}
              </Component>
            )
          })}
        </div>
      )}
    </div>
  )
}
