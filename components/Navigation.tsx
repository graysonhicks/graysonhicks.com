'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const links = [
  { name: 'HOME', href: '/' },
  { name: 'BLOG', href: '/blog' },
  { name: 'TALKS', href: '/talks' },
  { name: 'RESUME', href: '/GraysonHicksJuly2023Resume.pdf', external: true },
  { name: 'GITHUB', href: 'https://github.com/graysonhicks', external: true },
]

export default function Navigation() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cyber-black/80 backdrop-blur-md border-b border-cyber-cyan/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="font-display text-sm tracking-[0.3em] neon-text hover:text-cyber-cyan">
            GRAYSON//HICKS
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
              return link.external ? (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs font-mono tracking-widest text-gray-400 hover:text-cyber-cyan transition-all hover:bg-cyber-cyan/5 border border-transparent hover:border-cyber-cyan/20"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-1.5 text-xs font-mono tracking-widest transition-all border ${
                    isActive
                      ? 'text-cyber-cyan border-cyber-cyan/30 bg-cyber-cyan/5 shadow-[0_0_10px_rgba(0,255,255,0.1)]'
                      : 'text-gray-400 border-transparent hover:text-cyber-cyan hover:bg-cyber-cyan/5 hover:border-cyber-cyan/20'
                  }`}
                >
                  {link.name}
                </Link>
              )
            })}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-cyber-cyan font-mono text-sm border border-cyber-cyan/30 px-2 py-1"
          >
            {mobileOpen ? '[X]' : '[=]'}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-cyber-cyan/20 py-2">
            {links.map((link) =>
              link.external ? (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-xs font-mono tracking-widest text-gray-400 hover:text-cyber-cyan hover:bg-cyber-cyan/5"
                  onClick={() => setMobileOpen(false)}
                >
                  {'>'} {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block px-4 py-2 text-xs font-mono tracking-widest text-gray-400 hover:text-cyber-cyan hover:bg-cyber-cyan/5"
                  onClick={() => setMobileOpen(false)}
                >
                  {'>'} {link.name}
                </Link>
              )
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
