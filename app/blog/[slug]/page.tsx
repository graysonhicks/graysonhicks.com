import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllBlogSlugs, getBlogPost } from '@/lib/mdx'
import { format } from 'date-fns'
import PageWindow from '@/components/PageWindow'
import ViewCounter from '@/components/ViewCounter'

export async function generateStaticParams() {
  const slugs = getAllBlogSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug)
  if (!post) return { title: 'Not Found' }

  const url = `https://graysonhicks.com/blog${post.meta.slug}`

  return {
    title: post.meta.title,
    description: post.meta.description,
    keywords: post.meta.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      type: 'article',
      url,
      publishedTime: post.meta.date,
      authors: ['Grayson Hicks'],
      tags: post.meta.categories,
      ...(post.meta.image && {
        images: [{ url: post.meta.image, width: 1200, height: 630, alt: post.meta.title }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta.title,
      description: post.meta.description,
      ...(post.meta.image && { images: [post.meta.image] }),
    },
  }
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug)
  if (!post) notFound()

  return (
    <PageWindow title={post.meta.title} accentColor="cyan" backHref="/blog">
      <article>
        <header className="mb-8">
          <h1 className="font-display text-lg md:text-xl tracking-wider neon-text mb-2">
            {post.meta.title}
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono text-[10px] tracking-widest text-gray-600">
              {format(new Date(post.meta.date), 'yyyy.MM.dd')}
            </span>
            <ViewCounter slug={`blog${post.meta.slug}`} accentColor="cyan" />
            {post.meta.categories && post.meta.categories.length > 0 &&
              post.meta.categories.map((cat: string) => (
                <span
                  key={cat}
                  className="px-2 py-0.5 text-[9px] font-mono tracking-wider border border-cyber-magenta/25 text-cyber-magenta/60"
                >
                  {cat}
                </span>
              ))}
          </div>
          <div className="h-[1px] bg-gradient-to-r from-cyber-cyan/40 via-cyber-magenta/20 to-transparent mt-5" />
        </header>

        <div className="mdx-content">
          <MDXRemote source={post.content} />
        </div>
      </article>
    </PageWindow>
  )
}
