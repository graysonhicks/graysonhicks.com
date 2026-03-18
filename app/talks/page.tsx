import Link from 'next/link'
import { getAllTalks } from '@/lib/mdx'
import PageWindow from '@/components/PageWindow'
import { format } from 'date-fns'

export const metadata = {
  title: 'TALKS // GRAYSON HICKS',
  description: 'Technical talks about web development, Gatsby, React, and more.',
}

export default function TalksPage() {
  const talks = getAllTalks()

  return (
    <PageWindow title="~/talks" accentColor="magenta" backHref="/">
      <div className="mb-6">
        <h1 className="font-display text-xl md:text-2xl tracking-[0.2em] neon-text-magenta mb-1">TALKS</h1>
        <p className="text-[10px] text-gray-500 font-mono tracking-widest">
          {talks.length} PRESENTATIONS // CONFERENCE &amp; MEETUP
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {talks.map((talk) => (
          <Link
            key={talk.slug}
            href={`/talks${talk.slug}`}
            className="block p-3 border border-fuchsia-400/10 hover:border-fuchsia-400/25 bg-fuchsia-400/[0.02] hover:bg-fuchsia-400/[0.04] transition-all group no-underline"
          >
            <span className="font-mono text-[9px] tracking-widest text-gray-600 block mb-1">
              {format(new Date(talk.date), 'yyyy.MM.dd')}
            </span>
            <h2 className="font-mono text-[12px] tracking-wider text-gray-300 group-hover:text-cyber-magenta transition-colors mb-1">
              {talk.title}
            </h2>
            {talk.description && (
              <p className="text-[10px] text-gray-600 leading-relaxed line-clamp-2">
                {talk.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </PageWindow>
  )
}
