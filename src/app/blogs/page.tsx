import { client } from '@/sanity/lib/client'
import { BLOGS_QUERY } from '@/sanity/lib/queries'
import BlogsClientPage from './BlogsClientPage'

export const revalidate = 60

export default async function BlogsPage() {
  const posts = await client.fetch(
    BLOGS_QUERY,
    {},
    {
      next: { revalidate: 60 }
    }
  ) as any[]

  return <BlogsClientPage posts={posts || []} />
}
