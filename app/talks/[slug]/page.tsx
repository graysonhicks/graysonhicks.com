import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllTalkSlugs, getTalk } from '@/lib/mdx'
import { format } from 'date-fns'
import PageWindow from '@/components/PageWindow'

export async function generateStaticParams() {
  const slugs = getAllTalkSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const talk = getTalk(params.slug)
  if (!talk) return { title: 'Not Found' }
  return {
    title: `${talk.meta.title} // GRAYSON HICKS`,
    description: talk.meta.description,
  }
}

export default function TalkPost({ params }: { params: { slug: string } }) {
  const talk = getTalk(params.slug)
  if (!talk) notFound()

  return (
    <PageWindow title={talk.meta.title} accentColor="magenta" backHref="/talks">
      <article>
        <header className="mb-8">
          <h1 className="font-display text-lg md:text-xl tracking-wider neon-text-magenta mb-2">
            {talk.meta.title}
          </h1>
          <span className="font-mono text-[10px] tracking-widest text-gray-600">
            {format(new Date(talk.meta.date), 'yyyy.MM.dd')}
          </span>
          <div className="h-[1px] bg-gradient-to-r from-cyber-magenta/40 via-cyber-cyan/20 to-transparent mt-5" />
        </header>

        <div className="mdx-content">
          <MDXRemote source={talk.content} />
        </div>
      </article>
    </PageWindow>
  )
}
