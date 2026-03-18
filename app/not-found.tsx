import GlitchText from '@/components/GlitchText'
import PageWindow from '@/components/PageWindow'

export default function NotFound() {
  return (
    <PageWindow title="error://404" accentColor="magenta" backHref="/">
      <div className="py-12 text-center">
        <GlitchText className="font-display text-5xl md:text-7xl font-bold neon-text-magenta mb-4">
          404
        </GlitchText>
        <p className="font-mono text-[11px] tracking-[0.3em] text-gray-500">
          SIGNAL_LOST // PAGE_NOT_FOUND
        </p>
      </div>
    </PageWindow>
  )
}
