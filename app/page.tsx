'use client'

import Link from 'next/link'
import MacWindow from '@/components/MacWindow'
import DesktopIcon from '@/components/DesktopIcon'
import TerminalImage from '@/components/TerminalImage'
import GlitchText from '@/components/GlitchText'
import CyberSnake from '@/components/CyberSnake'
import CyberBowl from '@/components/CyberBowl'
import WinampPlayer from '@/components/WinampPlayer'
import ViewCounter from '@/components/ViewCounter'
import { projects } from '@/lib/projects'
import { useState, useRef, useCallback } from 'react'

const interests = [
  'TypeScript',
  'React',
  'Three.js',
  'AI',
  'JavaScript',
  'Arduino',
  'Acceleration',
]

export default function Home() {
  const work = projects.filter((p) => p.work)
  const personal = projects.filter((p) => !p.work)

  const [topZ, setTopZ] = useState(20)
  const [gameOpen, setGameOpen] = useState(false)
  const [bowlOpen, setBowlOpen] = useState(false)
  const [musicOpen, setMusicOpen] = useState(false)

  const [windowZ, setWindowZ] = useState<Record<string, number>>({
    about: 15,
    cam: 14,
    interests: 13,
    work: 12,
    projects: 11,
    contact: 10,
    game: 9,
    bowl: 8,
    music: 7,
  })

  const bringToFront = (id: string) => {
    const next = topZ + 1
    setTopZ(next)
    setWindowZ((prev) => ({ ...prev, [id]: next }))
  }

  // Music player drag state
  const [musicPos, setMusicPos] = useState({ x: 0, y: 0 })
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null)

  const onMusicDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    bringToFront('music')

    dragRef.current = { startX: e.clientX, startY: e.clientY, origX: musicPos.x, origY: musicPos.y }

    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return
      const dx = ev.clientX - dragRef.current.startX
      const dy = ev.clientY - dragRef.current.startY
      setMusicPos({ x: dragRef.current.origX + dx, y: dragRef.current.origY + dy })
    }
    const onUp = () => {
      dragRef.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicPos])

  return (
    <div className="relative min-h-[calc(100vh-25px)]">
      {/* Desktop wallpaper pattern */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(0,255,255,0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255,0,255,0.03) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(0,255,65,0.02) 0%, transparent 50%)
          `,
        }}
      />

      {/* Desktop icons — top-right */}
      <div className="absolute top-3 right-3 z-[5] hidden lg:flex flex-col gap-1">
        <DesktopIcon label="Blog" href="/blog" icon="📝" />
        <DesktopIcon label="Talks" href="/talks" icon="🎤" />
        <DesktopIcon label="GitHub" href="https://github.com/graysonhicks" icon="⌨" external />
        <DesktopIcon label="Resume" href="/GraysonHicksJuly2023Resume.pdf" icon="📄" external />
        <DesktopIcon label="Snake" icon="🐍" onClick={() => { setGameOpen(true); bringToFront('game') }} />
        <DesktopIcon label="Bowl" icon="🏈" onClick={() => { setBowlOpen(true); bringToFront('bowl') }} />
        <DesktopIcon label="Music" icon="🎵" onClick={() => { setMusicOpen(true); bringToFront('music') }} />
      </div>

      {/* Window grid layout */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-4 pb-10">
        {/* Row 1: About + Camera feed */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-4 mb-4">
          <MacWindow
            title="about://grayson.hicks"
            zIndex={windowZ.about}
            onFocus={() => bringToFront('about')}
            accentColor="cyan"
          >
            <div className="mb-4">
              <GlitchText className="font-display text-xl md:text-2xl font-bold tracking-wider neon-text mb-1">
                GRAYSON HICKS
              </GlitchText>
              <p className="font-mono text-[10px] text-cyber-magenta/60 tracking-[0.3em]">
                FULL-STACK DEVELOPER // NEW ORLEANS, LA
              </p>
            </div>
            <div className="h-[1px] bg-gradient-to-r from-cyber-cyan/40 via-cyber-magenta/20 to-transparent mb-4" />
            <div className="space-y-3 text-[12px] leading-relaxed text-gray-300">
              <p>
                No matter the platform or language, I like to build software (dreams of hardware, too).
                I am interested in and passionate about solving problems with all things technical.
                I enjoy{' '}
                <Link href="/blog" className="neon-text">writing</Link>{' '}
                about technology and giving{' '}
                <Link href="/talks" className="neon-text">talks</Link>.
              </p>
              <p>
                I am currently a customer engineer at{' '}
                <a href="https://mastra.ai" target="_blank" rel="noopener noreferrer" className="neon-text-magenta">
                  Mastra, Inc.
                </a>
                , helping businesses build with the Mastra AI agent framework.
                I live outside New Orleans, LA with my wife, four sons, and one daughter.
                We love gardening, hiking, lacrosse and catching salamanders.
              </p>
            </div>
          </MacWindow>

          <MacWindow
            title="cam://feed_01"
            zIndex={windowZ.cam}
            onFocus={() => bringToFront('cam')}
            accentColor="green"
          >
            <TerminalImage />
          </MacWindow>
        </div>

        {/* Row 2: Interests + Contact */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-4 mb-4">
          <MacWindow
            title="sys://interests.cfg"
            zIndex={windowZ.interests}
            onFocus={() => bringToFront('interests')}
            accentColor="green"
          >
            <p className="text-[11px] text-gray-500 mb-3 font-mono">
              {"// currently learning & building with:"}
            </p>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1 text-[10px] font-mono tracking-widest border border-cyber-green/25 text-cyber-green/70 bg-cyber-green/5 hover:bg-cyber-green/10 hover:border-cyber-green/40 transition-all cursor-default"
                >
                  {interest}
                </span>
              ))}
            </div>
          </MacWindow>

          <MacWindow
            title="contact.txt"
            zIndex={windowZ.contact}
            onFocus={() => bringToFront('contact')}
            accentColor="yellow"
          >
            <div className="space-y-2 text-[11px] font-mono">
              <a href="mailto:graysonhicks@gmail.com" className="block text-gray-400 hover:text-cyber-cyan transition-colors">
                graysonhicks@gmail.com
              </a>
              <a href="tel:8039171953" className="block text-gray-400 hover:text-cyber-cyan transition-colors">
                (803) 917-1953
              </a>
              <div className="h-[1px] bg-cyan-400/10 my-2" />
              <div className="flex gap-3">
                <a href="https://github.com/graysonhicks" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-cyber-cyan transition-colors text-[10px]">
                  github
                </a>
                <a href="https://twitter.com/graysonhicks" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-cyber-magenta transition-colors text-[10px]">
                  twitter
                </a>
                <a href="https://instagram.com/jgraysonhicks" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-cyber-magenta transition-colors text-[10px]">
                  instagram
                </a>
              </div>
            </div>
          </MacWindow>
        </div>

        {/* Row 3: Work + Projects side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MacWindow
            title="db://work_history"
            maxHeight="340px"
            zIndex={windowZ.work}
            onFocus={() => bringToFront('work')}
            accentColor="cyan"
          >
            <div className="space-y-2.5">
              {work.map((w) => (
                <a
                  key={w.title}
                  href={w.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-2.5 border border-cyan-400/10 hover:border-cyan-400/30 bg-cyan-400/[0.02] hover:bg-cyan-400/[0.05] transition-all group no-underline"
                >
                  <h3 className="font-mono text-[11px] tracking-wider text-cyber-cyan/80 group-hover:text-cyber-cyan transition-colors mb-1">
                    {w.title}
                  </h3>
                  <p className="text-[10px] text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors">
                    {w.description}
                  </p>
                </a>
              ))}
            </div>
          </MacWindow>

          <MacWindow
            title="~/projects"
            maxHeight="340px"
            zIndex={windowZ.projects}
            onFocus={() => bringToFront('projects')}
            accentColor="magenta"
          >
            <div className="space-y-2.5">
              {personal.map((p) => (
                <a
                  key={p.title}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-2.5 border border-fuchsia-400/10 hover:border-fuchsia-400/30 bg-fuchsia-400/[0.02] hover:bg-fuchsia-400/[0.05] transition-all group no-underline"
                >
                  <h3 className="font-mono text-[11px] tracking-wider text-cyber-magenta/80 group-hover:text-cyber-magenta transition-colors mb-1">
                    {p.title}
                  </h3>
                  <p className="text-[10px] text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors">
                    {p.description}
                  </p>
                </a>
              ))}
            </div>
          </MacWindow>
        </div>
      </div>

      {/* Game window — floating overlay */}
      {gameOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" onClick={() => setGameOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} onMouseDown={() => bringToFront('game')}>
            <div
              className="rounded-[5px] overflow-hidden"
              style={{
                border: '1px solid rgba(0,255,255,0.25)',
                background: '#0c0c1e',
                boxShadow: '0 12px 60px rgba(0,0,0,0.8), 0 0 30px rgba(0,255,255,0.15)',
                zIndex: windowZ.game,
              }}
            >
              {/* Title bar */}
              <div
                className="relative h-[22px] flex items-center px-2 gap-2 select-none"
                style={{ background: 'linear-gradient(180deg, #1a1a38 0%, #12122a 50%, #0e0e22 100%)' }}
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,255,255,0.08) 1px, rgba(0,255,255,0.08) 2px)',
                    opacity: 0.6,
                  }}
                />
                <div className="relative flex items-center gap-[5px] z-10">
                  <button
                    className="w-[11px] h-[11px] rounded-full border"
                    style={{ background: 'linear-gradient(180deg, #ff6058, #e33e32)', borderColor: '#c8302a' }}
                    onClick={() => setGameOpen(false)}
                    title="Close"
                  />
                  <span className="w-[11px] h-[11px] rounded-full border" style={{ background: 'linear-gradient(180deg, #ffc130, #e5a000)', borderColor: '#c8960a' }} />
                  <span className="w-[11px] h-[11px] rounded-full border" style={{ background: 'linear-gradient(180deg, #27ca40, #1aad2e)', borderColor: '#1a9028' }} />
                </div>
                <div className="relative flex-1 text-center z-10 pr-8">
                  <span className="text-[11px] tracking-[0.15em] font-mono text-cyber-cyan" style={{ textShadow: '0 0 6px rgba(0,255,255,0.15)' }}>
                    cyber_snake.exe
                  </span>
                </div>
              </div>
              <div className="h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,255,255,0.25), transparent)' }} />
              <div className="p-3" style={{ background: 'linear-gradient(180deg, #0c0c1e 0%, #0a0a18 100%)' }}>
                <CyberSnake />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cyber Bowl — floating overlay, resizable */}
      {bowlOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" onClick={() => setBowlOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} onMouseDown={() => bringToFront('bowl')}>
            <div
              className="rounded-[5px] overflow-hidden"
              style={{
                border: '1px solid rgba(0,255,255,0.25)',
                background: '#0c0c1e',
                boxShadow: '0 12px 60px rgba(0,0,0,0.8), 0 0 30px rgba(0,255,255,0.15)',
                zIndex: windowZ.bowl,
                width: 700,
                minWidth: 400,
                minHeight: 320,
                maxWidth: '95vw',
                maxHeight: '90vh',
                resize: 'both' as const,
                overflow: 'hidden',
              }}
            >
              {/* Title bar */}
              <div
                className="relative h-[22px] flex items-center px-2 gap-2 select-none"
                style={{ background: 'linear-gradient(180deg, #1a1a38 0%, #12122a 50%, #0e0e22 100%)' }}
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,255,255,0.08) 1px, rgba(0,255,255,0.08) 2px)',
                    opacity: 0.6,
                  }}
                />
                <div className="relative flex items-center gap-[5px] z-10">
                  <button
                    className="w-[11px] h-[11px] rounded-full border"
                    style={{ background: 'linear-gradient(180deg, #ff6058, #e33e32)', borderColor: '#c8302a' }}
                    onClick={() => setBowlOpen(false)}
                    title="Close"
                  />
                  <span className="w-[11px] h-[11px] rounded-full border" style={{ background: 'linear-gradient(180deg, #ffc130, #e5a000)', borderColor: '#c8960a' }} />
                  <span className="w-[11px] h-[11px] rounded-full border" style={{ background: 'linear-gradient(180deg, #27ca40, #1aad2e)', borderColor: '#1a9028' }} />
                </div>
                <div className="relative flex-1 text-center z-10 pr-8">
                  <span className="text-[11px] tracking-[0.15em] font-mono text-cyber-cyan" style={{ textShadow: '0 0 6px rgba(0,255,255,0.15)' }}>
                    cyber_bowl.exe
                  </span>
                </div>
              </div>
              <div className="h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,255,255,0.25), transparent)' }} />
              <div className="p-3 h-[calc(100%-23px)]" style={{ background: 'linear-gradient(180deg, #0c0c1e 0%, #0a0a18 100%)' }}>
                <CyberBowl />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Music player — draggable floating window */}
      {musicOpen && (
        <div
          onMouseDown={() => bringToFront('music')}
          style={{
            position: 'fixed',
            zIndex: windowZ.music,
            top: `calc(60px + ${musicPos.y}px)`,
            right: `calc(100px + ${-musicPos.x}px)`,
          }}
        >
          <div
            className="rounded-[5px] overflow-hidden"
            style={{
              border: '1px solid rgba(0,255,255,0.25)',
              background: '#0c0c1e',
              boxShadow: '0 12px 60px rgba(0,0,0,0.8), 0 0 30px rgba(0,255,255,0.15)',
            }}
          >
            {/* Draggable title bar */}
            <div
              className="relative h-[22px] flex items-center px-2 gap-2 select-none cursor-grab active:cursor-grabbing"
              style={{ background: 'linear-gradient(180deg, #1a1a38 0%, #12122a 50%, #0e0e22 100%)' }}
              onMouseDown={onMusicDragStart}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,255,255,0.08) 1px, rgba(0,255,255,0.08) 2px)',
                  opacity: 0.6,
                }}
              />
              <div className="relative flex items-center gap-[5px] z-10" onMouseDown={(e) => e.stopPropagation()}>
                <button
                  className="w-[11px] h-[11px] rounded-full border"
                  style={{ background: 'linear-gradient(180deg, #ff6058, #e33e32)', borderColor: '#c8302a' }}
                  onClick={() => setMusicOpen(false)}
                  title="Close"
                />
                <span className="w-[11px] h-[11px] rounded-full border" style={{ background: 'linear-gradient(180deg, #ffc130, #e5a000)', borderColor: '#c8960a' }} />
                <span className="w-[11px] h-[11px] rounded-full border" style={{ background: 'linear-gradient(180deg, #27ca40, #1aad2e)', borderColor: '#1a9028' }} />
              </div>
              <div className="relative flex-1 text-center z-10 pr-8">
                <span className="text-[11px] tracking-[0.15em] font-mono text-cyber-cyan" style={{ textShadow: '0 0 6px rgba(0,255,255,0.15)' }}>
                  cyber_amp.exe
                </span>
              </div>
            </div>
            <div className="h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,255,255,0.25), transparent)' }} />
            <WinampPlayer />
          </div>
        </div>
      )}

      {/* Bottom status bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[100] h-[22px] flex items-center px-3 justify-center sm:justify-between gap-2"
        style={{
          background: 'linear-gradient(180deg, #0d0d22 0%, #111128 50%, #1a1a38 100%)',
          borderTop: '1px solid rgba(0,255,255,0.12)',
        }}
      >
        <span className="hidden sm:block flex-1 text-[7px] sm:text-[9px] font-mono text-gray-600 tracking-widest whitespace-nowrap text-left">
          CyberOS 8.1
        </span>
        <ViewCounter slug="home" accentColor="green" />
        <span className="hidden sm:block flex-1 text-[7px] sm:text-[9px] font-mono text-gray-600 tracking-widest whitespace-nowrap text-right">
          &copy; {new Date().getFullYear()} GRAYSON HICKS // ALL SYSTEMS OPERATIONAL
        </span>
      </div>
    </div>
  )
}
