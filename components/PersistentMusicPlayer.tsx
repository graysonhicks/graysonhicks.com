'use client'

import { usePathname } from 'next/navigation'
import MacWindow from '@/components/MacWindow'
import WinampPlayer from '@/components/WinampPlayer'
import { useMusicPlayer } from '@/components/MusicPlayerProvider'

export default function PersistentMusicPlayer() {
  const pathname = usePathname()
  const { track, playing, togglePlay, prevTrack, nextTrack, stop } = useMusicPlayer()

  if (pathname === '/') return null

  const displayTitle = track?.title ?? 'No track'

  return (
    <>
      {/* Desktop: floating window */}
      <div className="hidden sm:block fixed right-4 bottom-4 z-[90]">
        <MacWindow
          title="cyber_amp.exe"
          accentColor="magenta"
          noPadding
          className="w-[392px]"
        >
          <WinampPlayer compact />
        </MacWindow>
      </div>

      {/* Mobile: fixed bottom bar */}
      <div
        className="sm:hidden fixed bottom-0 left-0 right-0 z-[90] select-none"
        style={{
          fontFamily: "'VT323', monospace",
          background: 'linear-gradient(180deg, #17172d 0%, #0c0c18 100%)',
          borderTop: '1px solid rgba(0,255,255,0.16)',
          boxShadow: '0 -2px 16px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px' }}>
          <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: 13, lineHeight: 1.2, color: '#00ff41', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {displayTitle}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            {[
              { label: '⏮', action: prevTrack, title: 'Previous' },
              { label: playing ? '⏸' : '▶', action: togglePlay, title: playing ? 'Pause' : 'Play' },
              { label: '⏹', action: stop, title: 'Stop' },
              { label: '⏭', action: nextTrack, title: 'Next' },
            ].map((btn) => (
              <button
                key={btn.title}
                onClick={btn.action}
                title={btn.title}
                style={{
                  border: '1px solid rgba(0,255,255,0.2)',
                  borderRadius: 2,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 26,
                  background: btn.title === 'Play' || btn.title === 'Pause'
                    ? 'linear-gradient(180deg, rgba(0,255,255,0.12), rgba(0,255,255,0.04))'
                    : 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0.2))',
                  color: btn.title === 'Play' || btn.title === 'Pause' ? '#00ffff' : 'rgba(0,255,255,0.7)',
                  fontSize: 13,
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
