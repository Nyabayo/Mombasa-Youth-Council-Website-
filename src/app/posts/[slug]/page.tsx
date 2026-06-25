'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import type { Post, Comment } from '@/lib/types'

interface UserSession {
  id: string
  name: string
  email: string
  role: string
}

export default function ArticlePage() {
  const params = useParams()
  const slug = params.slug as string

  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [user, setUser] = useState<UserSession | null>(null)
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`/api/posts/${slug}`).then((r) => (r.ok ? r.json() : null)),
      fetch('/api/auth/me').then((r) => (r.ok ? r.json() : null)),
    ]).then(([postData, userData]) => {
      if (postData) {
        setPost(postData.post)
        setComments(postData.comments ?? [])
      }
      setUser(userData?.user ?? null)
      setLoading(false)
    })
  }, [slug])

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return
    setSubmitting(true)
    setError('')

    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId: post?.id, content: commentText }),
    })

    const data = await res.json()
    if (res.ok) {
      setComments((prev) => [...prev, data.comment])
      setCommentText('')
    } else {
      setError(data.error ?? 'Failed to post comment.')
    }
    setSubmitting(false)
  }

  const handleDeleteComment = async (id: string) => {
    const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' })
    if (res.ok) setComments((prev) => prev.filter((c) => c.id !== id))
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="inline-block w-8 h-8 border-4 border-blue-700 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h1>
        <Link href="/posts" className="text-blue-700 hover:underline">← Back to Posts</Link>
      </div>
    )
  }

  const date = new Date(post.createdAt).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <>
      <div style={{ backgroundColor: '#003087' }} className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/posts" className="text-blue-200 text-xs hover:underline mb-3 block">← Back to Posts</Link>
          <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest mb-3" style={{ backgroundColor: 'var(--bg-card)', color: '#003087' }}>
            {post.category}
          </span>
          <h1 className="text-white text-2xl sm:text-3xl font-black leading-tight">{post.title}</h1>
          <p className="text-blue-200 text-sm mt-3">By {post.authorName} · {date}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          <article className="flex-1">
            {post.image && (
              <div className="w-full aspect-video overflow-hidden mb-8">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              </div>
            )}
            <p className="text-gray-700 text-lg font-medium leading-relaxed border-l-4 border-blue-700 pl-4 mb-8 italic">
              {post.excerpt}
            </p>
            <div
              className="prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Share */}
            <div className="mt-10 pt-6 border-t border-gray-200 flex items-center gap-4">
              <span className="text-sm text-gray-500 font-medium">Share:</span>
              {['Facebook', 'Twitter', 'WhatsApp'].map((s) => (
                <button
                  key={s}
                  className="text-xs px-3 py-1.5 rounded font-semibold text-white transition-opacity hover:opacity-80"
                  style={{ backgroundColor: s === 'Facebook' ? '#1877F2' : s === 'Twitter' ? '#1DA1F2' : '#25D366' }}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Comments */}
            <div className="mt-10">
              <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <span>Comments</span>
                <span className="text-sm font-normal text-gray-400">({comments.length})</span>
              </h2>

              {user ? (
                <form onSubmit={handleComment} className="mb-8 p-5 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">Commenting as <strong>{user.name}</strong></p>
                  {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={4}
                    maxLength={1000}
                    required
                    className="w-full border border-gray-300 rounded p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-400">{commentText.length}/1000</span>
                    <button
                      type="submit"
                      disabled={submitting || !commentText.trim()}
                      style={{ backgroundColor: '#003087' }}
                      className="px-5 py-2 text-white text-sm font-semibold rounded disabled:opacity-50 hover:opacity-90 transition-opacity"
                    >
                      {submitting ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mb-8 p-5 bg-blue-50 border border-blue-200 rounded-lg text-center">
                  <p className="text-gray-800 font-semibold mb-1">Sign in to join the discussion</p>
                  <p className="text-gray-500 text-sm mb-4">Only registered MYC members can post and comment.</p>
                  <div className="flex justify-center gap-3">
                    <Link href="/login" style={{ backgroundColor: '#003087' }} className="px-4 py-2 text-white text-sm font-semibold rounded hover:opacity-90">
                      Sign In
                    </Link>
                    <Link href="/register" className="px-4 py-2 border border-blue-700 text-blue-700 text-sm font-semibold rounded hover:bg-blue-50">
                      Create an Account
                    </Link>
                  </div>
                </div>
              )}

              {comments.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-6">No comments yet. Be the first to comment!</p>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: '#003087' }}>
                            {comment.authorName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{comment.authorName}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(comment.createdAt).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        {user && (user.id === comment.authorId || user.role === 'admin') && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-xs text-red-500 hover:text-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </article>

          <aside className="lg:w-56">
            <div className="bg-white border border-gray-200 p-4">
              <h4 className="font-bold text-gray-900 mb-3 text-sm">Quick Links</h4>
              <div className="space-y-2">
                <Link href="/posts" className="block text-sm text-blue-700 hover:underline">All Posts →</Link>
                <Link href="/president" className="block text-sm text-blue-700 hover:underline">The President →</Link>
                <Link href="/programmes" className="block text-sm text-blue-700 hover:underline">Programmes →</Link>
                <Link href="/register" className="block text-sm text-blue-700 hover:underline">Join MYC Today →</Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
