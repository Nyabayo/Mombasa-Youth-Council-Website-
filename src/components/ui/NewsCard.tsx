import Link from 'next/link'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  image?: string
  authorName: string
  createdAt: string
}

interface NewsCardProps {
  post: Post
  featured?: boolean
}

const categoryColors: Record<string, string> = {
  News: '#003087',
  Advocacy: '#005588',
  Programmes: '#005588',
  Governance: '#002673',
  Leadership: '#001a52',
}

export default function NewsCard({ post, featured = false }: NewsCardProps) {
  const color = categoryColors[post.category] ?? '#003087'
  const date = new Date(post.createdAt).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  if (featured) {
    return (
      <Link
        href={`/posts/${post.slug}`}
        className="group block bg-white border border-gray-200 hover:shadow-xl transition-shadow overflow-hidden"
      >
        {/* Cover image */}
        <div className="h-52 relative overflow-hidden" style={{ backgroundColor: color }}>
          {post.image ? (
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          ) : (
            <>
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />
              <span className="absolute inset-0 flex items-center justify-center text-sm tracking-widest uppercase opacity-90 text-white font-bold">{post.category}</span>
            </>
          )}
        </div>
        <div className="p-5">
          <span
            className="inline-block text-xs font-semibold px-2 py-0.5 mb-3 uppercase tracking-wide"
            style={{ backgroundColor: color, color: 'white' }}
          >
            {post.category}
          </span>
          <h3 className="text-gray-900 font-bold text-lg leading-snug group-hover:text-blue-700 transition-colors mb-2 line-clamp-2">
            {post.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">{post.excerpt}</p>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{post.authorName}</span>
            <span>{date}</span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group flex gap-4 py-4 border-b border-gray-100 hover:bg-gray-50 px-2 transition-colors"
    >
      <div
        className="w-14 h-14 flex-shrink-0 flex items-center justify-center rounded text-xs font-bold"
        style={{ backgroundColor: color, color: 'white' }}
      >
        {post.category.slice(0, 3).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-gray-900 font-semibold text-sm leading-snug group-hover:text-blue-700 transition-colors line-clamp-2 mb-1">
          {post.title}
        </h4>
        <p className="text-xs text-gray-400">{date}</p>
      </div>
    </Link>
  )
}
