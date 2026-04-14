'use client'

import { usePathname } from 'next/navigation'
import MacWindow from '@/components/MacWindow'
import WinampPlayer from '@/components/WinampPlayer'

export default function PersistentMusicPlayer() {
  const pathname = usePathname()

  if (pathname === '/') return null

  return (
    <div className="fixed right-4 bottom-4 z-[90]">
      <MacWindow
        title="cyber_amp.exe"
        accentColor="magenta"
        noPadding
        className="w-[392px]"
      >
        <WinampPlayer compact />
      </MacWindow>
    </div>
  )
}
