import Link from 'next/link'
import { getAllBlogPosts } from '@/lib/mdx'
import PageWindow from '@/components/PageWindow'
import { format } from 'date-fns'

export const metadata = {
  title: 'Blog — Articles on Web Development, React, and AI',
  description: 'Technical writing about web development, React, TypeScript, AI, and modern software engineering by Grayson Hicks.',
  alternates: {
    canonical: 'https://graysonhicks.com/blog',
  },
  openGraph: {
    title: 'Blog — Articles on Web Development, React, and AI',
    description: 'Technical writing about web development, React, TypeScript, AI, and modern software engineering by Grayson Hicks.',
    url: 'https://graysonhicks.com/blog',
    type: 'website',
  },
}

export default function BlogPage() {
  const posts = getAllBlogPosts()

  return (
    <PageWindow title="~/blog" accentColor="cyan" backHref="/">
      <div className="mb-6">
        <h1 className="font-display text-xl md:text-2xl tracking-[0.2em] neon-text mb-1">BLOG</h1>
        <p className="text-[10px] text-gray-500 font-mono tracking-widest">
          {posts.length} ENTRIES // SORTED BY DATE DESC
        </p>
      </div>

      <div className="space-y-0">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog${post.slug}`}
            className="flex items-start gap-3 px-3 py-2.5 -mx-3 group hover:bg-cyan-400/[0.03] transition-all no-underline border-b border-cyan-400/5 last:border-0"
          >
            <span className="font-mono text-[10px] tracking-widest text-gray-600 pt-0.5 shrink-0 tabular-nums">
              {format(new Date(post.date), 'yyyy.MM.dd')}
            </span>
            <div className="flex-1 min-w-0">
              <h2 className="font-mono text-[12px] tracking-wider text-gray-300 group-hover:text-cyber-cyan transition-colors truncate">
                {post.title}
              </h2>
              {post.description && (
                <p className="text-[10px] text-gray-600 leading-relaxed mt-0.5 line-clamp-1">
                  {post.description}
                </p>
              )}
            </div>
            <span className="font-mono text-[10px] text-cyan-400/0 group-hover:text-cyan-400/50 transition-colors pt-0.5">
              {'→'}
            </span>
          </Link>
        ))}
      </div>
    </PageWindow>
  )
}
