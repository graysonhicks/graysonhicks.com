import { getAllBlogPosts } from '@/lib/mdx'
import HomeContent from '@/components/HomeContent'

export default function Home() {
  const posts = getAllBlogPosts()
  const latestPost = posts.length > 0 ? posts[0] : null

  return <HomeContent latestPost={latestPost} />
}
