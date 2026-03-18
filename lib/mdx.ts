import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const blogsDirectory = path.join(process.cwd(), 'content/blogs')
const talksDirectory = path.join(process.cwd(), 'content/talks')

export interface PostMeta {
  title: string
  description: string
  date: string
  slug: string
  categories?: string[]
  keywords?: string[]
}

function getPostsFromDirectory(directory: string): PostMeta[] {
  const files = fs.readdirSync(directory).filter((f) => f.endsWith('.mdx'))

  const posts = files.map((filename) => {
    const filePath = path.join(directory, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data } = matter(fileContents)

    return {
      title: data.title,
      description: data.description,
      date: data.date,
      slug: data.slug,
      categories: data.categories || [],
      keywords: data.keywords || [],
    } as PostMeta
  })

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export function getAllBlogPosts(): PostMeta[] {
  return getPostsFromDirectory(blogsDirectory)
}

export function getAllTalks(): PostMeta[] {
  return getPostsFromDirectory(talksDirectory)
}

function getPostBySlug(directory: string, slug: string) {
  const files = fs.readdirSync(directory).filter((f) => f.endsWith('.mdx'))

  for (const filename of files) {
    const filePath = path.join(directory, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    if (data.slug === slug || data.slug === `/${slug}`) {
      return { meta: data as PostMeta, content }
    }
  }

  return null
}

export function getBlogPost(slug: string) {
  return getPostBySlug(blogsDirectory, slug)
}

export function getTalk(slug: string) {
  return getPostBySlug(talksDirectory, slug)
}

export function getAllBlogSlugs(): string[] {
  return getAllBlogPosts().map((p) => p.slug.replace(/^\//, ''))
}

export function getAllTalkSlugs(): string[] {
  return getAllTalks().map((p) => p.slug.replace(/^\//, ''))
}
