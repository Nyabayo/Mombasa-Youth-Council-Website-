import Link from 'next/link'
import type { Metadata } from 'next'
import * as db from '@/lib/db'
import NewsCard from '@/components/ui/NewsCard'

export const metadata: Metadata = {
  title: 'News & Media | Mombasa Youth Council',
  description: 'Latest news and updates from the Mombasa Youth Council',
}

const categories = ['All', 'News', 'Advocacy', 'Programmes', 'Governance', 'Leadership']

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const activeCategory = category ?? 'All'
  const allPosts = await db.getPublishedPosts()
  const posts =
    activeCategory === 'All'
      ? allPosts
      : allPosts.filter((p) => p.category === activeCategory)

  return (
    <>
      <div style={{ backgroundColor: 'var(--primary)' }} className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-[#00A8C8] text-xs font-bold tracking-widest uppercase mb-2">Media Centre</p>
          <h1 className="text-white text-3xl sm:text-4xl font-black mb-1">News &amp; Media</h1>
          <p className="text-[#00A8C8] text-sm">Latest updates from the Mombasa Youth Council</p>
        </div>
      </div>
      <div style={{ backgroundColor: 'var(--bg-alt)' }} className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-teal-700">Home</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">News &amp; Media</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={cat === 'All' ? '/news' : `/news?category=${encodeURIComponent(cat)}`}
              className="px-4 py-2 text-sm font-semibold rounded transition-colors"
              style={
                activeCategory === cat
                  ? { backgroundColor: 'var(--primary)', color: 'white' }
                  : { backgroundColor: 'var(--bg-alt)', color: 'var(--primary)', border: '1px solid #bfdbfe' }
              }
            >
              {cat}
            </Link>
          ))}
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No articles found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <NewsCard key={post.id} post={post} featured />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
