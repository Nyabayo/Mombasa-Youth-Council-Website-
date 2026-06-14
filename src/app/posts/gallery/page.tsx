import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Gallery | Posts & Media | MYC' }

export default function GalleryPage() {
  return (
    <>
      <div style={{ backgroundColor: 'var(--primary)' }} className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-[#00A8C8] text-xs font-bold tracking-widest uppercase mb-2">Media Centre</p>
          <h1 className="text-white text-3xl font-black">Gallery</h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-8">
          <Link href="/" className="hover:text-teal-700">Home</Link><span>/</span>
          <Link href="/posts" className="hover:text-teal-700">Posts</Link><span>/</span>
          <span className="text-gray-700">Gallery</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: i % 2 === 0 ? 'var(--primary)' : 'var(--primary-dark)' }}>
              {i % 2 === 0 ? 'MYC Event' : 'Innovation Festival'}
            </div>
          ))}
        </div>
        <p className="text-gray-400 text-sm text-center mt-8">Gallery content will be updated with real images of MYC events and activities.</p>
        <div className="mt-6 text-center">
          <Link href="/posts" className="text-teal-700 hover:underline text-sm font-semibold">← Back to Posts</Link>
        </div>
      </div>
    </>
  )
}
