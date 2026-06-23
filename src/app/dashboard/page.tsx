'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Post } from '@/lib/types'
import dynamic from 'next/dynamic'

const RichTextEditor = dynamic(() => import('@/components/ui/RichTextEditor'), { ssr: false })

interface UserSession {
  id: string
  name: string
  email: string
  role: string
}

interface MemberRecord {
  id: string
  name: string
  email: string
  role: string
  status: 'pending' | 'approved' | 'rejected'
  mpesaRef?: string
  createdAt: string
}

function extractImages(html: string): string[] {
  const matches = [...html.matchAll(/src="([^"]+)"/g)]
  return matches.map((m) => m[1]).filter((src) => src.startsWith('http') || src.startsWith('data:'))
}

function StatusBadge({ status }: { status: MemberRecord['status'] }) {
  const map = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    approved: 'bg-green-100 text-green-800 border-green-300',
    rejected: 'bg-red-100 text-red-800 border-red-300',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${map[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserSession | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'posts' | 'users'>('posts')

  // Post form state
  const [showForm, setShowForm] = useState(false)
  const [previewing, setPreviewing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', category: 'News', image: '' })

  // Users management state
  const [members, setMembers] = useState<MemberRecord[]>([])
  const [membersLoading, setMembersLoading] = useState(false)
  const [memberActionId, setMemberActionId] = useState<string | null>(null)

  // Create admin account form
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createForm, setCreateForm] = useState({ name: '', email: '', password: '', role: 'user' })
  const [createError, setCreateError] = useState('')
  const [creating, setCreating] = useState(false)

  const router = useRouter()

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then((r) => (r.ok ? r.json() : null)),
      fetch('/api/posts').then((r) => (r.ok ? r.json() : null)),
    ]).then(([userData, postsData]) => {
      if (!userData?.user) { router.push('/login'); return }
      setUser(userData.user)
      setPosts(postsData?.posts ?? [])
      setLoading(false)
    })
  }, [router])

  const fetchMembers = async () => {
    setMembersLoading(true)
    const res = await fetch('/api/admin/users')
    if (res.ok) {
      const data = await res.json()
      setMembers(data.users ?? [])
    }
    setMembersLoading(false)
  }

  useEffect(() => {
    if (activeTab === 'users' && user?.role === 'admin') {
      fetchMembers()
    }
  }, [activeTab, user])

  const contentImages = useMemo(() => extractImages(form.content), [form.content])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.content.trim()) {
      setFormError('Title and content are required.')
      return
    }
    setFormError('')
    setSubmitting(true)

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    if (res.ok) {
      setPosts((prev) => [data.post, ...prev])
      setForm({ title: '', excerpt: '', content: '', category: 'News', image: '' })
      setShowForm(false)
      setPreviewing(false)
    } else {
      setFormError(data.error ?? 'Failed to publish post.')
    }
    setSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return
    const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' })
    if (res.ok) setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  const handleMemberAction = async (id: string, updates: { status?: string; role?: string }) => {
    setMemberActionId(id)
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    if (res.ok) {
      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...updates } as MemberRecord : m))
      )
    }
    setMemberActionId(null)
  }

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateError('')
    setCreating(true)
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createForm),
    })
    const data = await res.json()
    if (res.ok) {
      setCreateForm({ name: '', email: '', password: '', role: 'user' })
      setShowCreateForm(false)
      await fetchMembers()
    } else {
      setCreateError(data.error ?? 'Failed to create account.')
    }
    setCreating(false)
  }

  const myPosts = user ? posts.filter((p) => p.authorId === user.id || user.role === 'admin') : []

  const pendingCount = members.filter((m) => m.status === 'pending').length

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="inline-block w-8 h-8 border-4 border-teal-700 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <div style={{ backgroundColor: 'var(--primary)' }} className="py-8">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-[#00A8C8] text-xs font-bold tracking-widest uppercase mb-1">Member Portal</p>
            <h1 className="text-white text-2xl font-black">Welcome, {user?.name}</h1>
            <p className="text-[#00A8C8] text-sm">{user?.email} · {user?.role === 'admin' ? 'Administrator' : 'Member'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-white text-white font-semibold text-sm rounded hover:bg-white/10 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'My Posts', value: myPosts.length, icon: '📝' },
            { label: 'Total Published', value: posts.length, icon: '📰' },
            { label: 'Account Type', value: user?.role === 'admin' ? 'Admin' : 'Member', icon: '👤' },
            { label: 'Status', value: 'Active', icon: '✅' },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-2xl font-black text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tab nav — only show Users tab to admins */}
        {user?.role === 'admin' && (
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('posts')}
              className="px-6 py-3 text-sm font-bold border-b-2 transition-colors"
              style={{
                borderColor: activeTab === 'posts' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'posts' ? 'var(--primary)' : '#888',
              }}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className="px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2"
              style={{
                borderColor: activeTab === 'users' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'users' ? 'var(--primary)' : '#888',
              }}
            >
              Members
              {pendingCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 leading-none min-w-[18px] text-center">
                  {pendingCount}
                </span>
              )}
            </button>
          </div>
        )}

        {/* POSTS TAB */}
        {activeTab === 'posts' && (
          <>
            {/* Write a Post */}
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="w-full mb-8 group border-2 border-dashed border-blue-300 rounded-xl p-8 flex flex-col items-center gap-3 hover:border-blue-600 hover:bg-blue-50 transition-all"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl font-black group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  ✏
                </div>
                <p className="text-lg font-black text-gray-800 group-hover:text-teal-800">Write a New Post</p>
                <p className="text-sm text-gray-400">Share news, updates, or announcements with the MYC community</p>
                <span
                  className="mt-1 px-5 py-2 text-sm font-bold rounded text-white"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  Start Writing
                </span>
              </button>
            )}

            {/* Post creation form */}
            {showForm && (
              <div className="bg-white border border-gray-200 rounded-xl shadow-md mb-8 overflow-hidden">
                <div style={{ backgroundColor: 'var(--primary)' }} className="px-6 py-4 flex items-center justify-between">
                  <h2 className="text-white font-black text-lg">New Post</h2>
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setPreviewing(false); setForm({ title: '', excerpt: '', content: '', category: 'News', image: '' }) }}
                    className="text-[#00A8C8] hover:text-white text-sm transition-colors"
                  >
                    ✕ Discard
                  </button>
                </div>

                <div className="flex border-b border-gray-200">
                  <button
                    type="button"
                    onClick={() => setPreviewing(false)}
                    className="px-5 py-2.5 text-sm font-bold border-b-2 transition-colors"
                    style={{ borderColor: !previewing ? 'var(--primary)' : 'transparent', color: !previewing ? 'var(--primary)' : '#888' }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewing(true)}
                    className="px-5 py-2.5 text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5"
                    style={{ borderColor: previewing ? 'var(--gold)' : 'transparent', color: previewing ? 'var(--primary)' : '#888' }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    Preview
                  </button>
                </div>

                {previewing && (
                  <div className="p-6 border-b border-gray-100">
                    <div className="max-w-3xl mx-auto">
                      <div style={{ backgroundColor: 'var(--primary)' }} className="py-8 px-6 mb-6 rounded-t-lg">
                        <span className="text-xs font-black tracking-widest uppercase px-2 py-1 rounded mb-3 inline-block" style={{ backgroundColor: 'var(--gold)', color: 'var(--primary-dark)' }}>
                          {form.category || 'News'}
                        </span>
                        <h1 className="text-white text-2xl sm:text-3xl font-black leading-tight mt-2">
                          {form.title || <span className="opacity-40 italic">Post title will appear here…</span>}
                        </h1>
                        {form.excerpt && <p className="text-[#00A8C8] text-sm mt-2">{form.excerpt}</p>}
                        <p className="text-white/50 text-xs mt-3">{user?.name} · {new Date().toLocaleDateString('en-KE', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                      {form.image && (
                        <div className="mb-6 rounded overflow-hidden aspect-video">
                          <img src={form.image} alt="Cover" className="w-full h-full object-cover" />
                        </div>
                      )}
                      {form.content
                        ? <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: form.content }} />
                        : <p className="text-gray-400 italic text-center py-12">Your post content will appear here…</p>}
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmitPost} className={`p-6 space-y-5 ${previewing ? 'hidden' : ''}`}>
                  {formError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded">
                      {formError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Post title"
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        {['News', 'Advocacy', 'Programmes', 'Governance', 'Leadership', 'Press Release'].map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Summary <span className="text-gray-400 font-normal text-xs">(optional, shown in post listings)</span>
                      </label>
                      <textarea
                        name="excerpt"
                        value={form.excerpt}
                        onChange={handleChange}
                        placeholder="Brief description of the post…"
                        rows={2}
                        className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Content <span className="text-red-500">*</span>
                      <span className="ml-2 font-normal text-gray-400 text-xs">You can paste images directly into the editor</span>
                    </label>
                    <RichTextEditor
                      value={form.content}
                      onChange={(html) => setForm((f) => ({ ...f, content: html }))}
                      placeholder="Write your post here… paste images, add links, format text."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Cover Image
                      <span className="ml-2 font-normal text-gray-400 text-xs">
                        {contentImages.length > 0 ? 'Select one of the images you added above' : 'Add images to your content to choose a cover'}
                      </span>
                    </label>
                    {contentImages.length > 0 ? (
                      <div className="flex flex-wrap gap-3">
                        {contentImages.map((src, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setForm((f) => ({ ...f, image: f.image === src ? '' : src }))}
                            className={`relative w-28 h-20 overflow-hidden rounded border-2 transition-all ${
                              form.image === src ? 'border-blue-600 ring-2 ring-blue-400' : 'border-gray-200 hover:border-blue-400'
                            }`}
                          >
                            <img src={src} alt="" className="w-full h-full object-cover" />
                            {form.image === src && (
                              <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center">
                                <span className="text-white text-lg font-black">✓</span>
                              </div>
                            )}
                          </button>
                        ))}
                        {form.image && (
                          <button
                            type="button"
                            onClick={() => setForm((f) => ({ ...f, image: '' }))}
                            className="text-xs text-red-500 hover:text-red-700 self-end pb-1"
                          >
                            Clear cover
                          </button>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">
                        Insert images into your post content. They will appear here for you to select as the cover.
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                    <button
                      type="submit"
                      disabled={submitting}
                      style={{ backgroundColor: 'var(--primary)' }}
                      className="px-8 py-2.5 text-white font-bold text-sm rounded disabled:opacity-50 hover:opacity-90 transition-opacity"
                    >
                      {submitting ? 'Publishing…' : 'Publish Post'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowForm(false); setPreviewing(false); setForm({ title: '', excerpt: '', content: '', category: 'News', image: '' }) }}
                      className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold text-sm rounded hover:bg-gray-50 transition-colors"
                    >
                      Discard
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Posts table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div style={{ backgroundColor: 'var(--primary)' }} className="px-6 py-4 flex items-center justify-between">
                <h2 className="text-white font-bold">{user?.role === 'admin' ? 'All Posts' : 'My Posts'}</h2>
                <span className="text-[#00A8C8] text-sm">{myPosts.length} post{myPosts.length !== 1 ? 's' : ''}</span>
              </div>

              {myPosts.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <p className="text-gray-400 mb-4">You haven&apos;t published any posts yet.</p>
                  <button
                    onClick={() => setShowForm(true)}
                    style={{ backgroundColor: 'var(--primary)' }}
                    className="px-5 py-2 text-white font-semibold text-sm rounded hover:opacity-90"
                  >
                    Write Your First Post
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Title</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Author</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myPosts.map((post) => (
                        <tr key={post.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {post.image && (
                                <img src={post.image} alt="" className="w-10 h-10 object-cover rounded flex-shrink-0" />
                              )}
                              <Link href={`/posts/${post.slug}`} className="font-medium text-gray-900 hover:text-teal-700 line-clamp-1">
                                {post.title}
                              </Link>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-xs px-2 py-1 rounded font-semibold text-white" style={{ backgroundColor: 'var(--primary)' }}>
                              {post.category}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-gray-500 hidden sm:table-cell">{post.authorName}</td>
                          <td className="px-4 py-4 text-gray-400 hidden md:table-cell">
                            {new Date(post.createdAt).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <Link href={`/posts/${post.slug}`} className="text-teal-700 hover:underline text-xs font-medium">View</Link>
                              {(post.authorId === user?.id || user?.role === 'admin') && (
                                <button
                                  onClick={() => handleDelete(post.id)}
                                  className="text-red-500 hover:text-red-700 text-xs font-medium transition-colors"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* USERS / MEMBERS TAB — admin only */}
        {activeTab === 'users' && user?.role === 'admin' && (
          <div className="space-y-6">

            {/* Create account form toggle */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div style={{ backgroundColor: 'var(--primary)' }} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-white font-black">Create Administration Account</h2>
                  <p className="text-[#00A8C8] text-xs mt-0.5">Bypass payment and create an approved account directly</p>
                </div>
                <button
                  onClick={() => { setShowCreateForm((v) => !v); setCreateError('') }}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded transition-colors"
                >
                  {showCreateForm ? 'Cancel' : '+ New Account'}
                </button>
              </div>

              {showCreateForm && (
                <form onSubmit={handleCreateMember} className="p-6 space-y-4">
                  {createError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">{createError}</div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={createForm.name}
                        onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="Full name"
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        value={createForm.email}
                        onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))}
                        placeholder="email@example.com"
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Password *</label>
                      <input
                        type="password"
                        value={createForm.password}
                        onChange={(e) => setCreateForm((f) => ({ ...f, password: e.target.value }))}
                        placeholder="Min 8 chars"
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Role *</label>
                      <select
                        value={createForm.role}
                        onChange={(e) => setCreateForm((f) => ({ ...f, role: e.target.value }))}
                        className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="user">Member</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={creating}
                      style={{ backgroundColor: 'var(--primary)' }}
                      className="px-6 py-2.5 text-white font-bold text-sm rounded disabled:opacity-50 hover:opacity-90 transition-opacity"
                    >
                      {creating ? 'Creating…' : 'Create Account'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowCreateForm(false); setCreateError('') }}
                      className="px-5 py-2.5 border border-gray-300 text-gray-700 text-sm font-semibold rounded hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Members table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div style={{ backgroundColor: 'var(--primary)' }} className="px-6 py-4 flex items-center justify-between">
                <h2 className="text-white font-black">All Members</h2>
                <div className="flex items-center gap-3">
                  {pendingCount > 0 && (
                    <span className="bg-yellow-400 text-yellow-900 text-xs font-black px-2 py-1 rounded">
                      {pendingCount} pending approval
                    </span>
                  )}
                  <span className="text-[#00A8C8] text-sm">{members.length} total</span>
                </div>
              </div>

              {membersLoading ? (
                <div className="p-12 text-center">
                  <div className="inline-block w-6 h-6 border-4 border-teal-700 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : members.length === 0 ? (
                <div className="px-6 py-12 text-center text-gray-400">No members yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Member</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">M-Pesa Ref</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Joined</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((m) => (
                        <tr key={m.id} className={`border-b border-gray-100 ${m.status === 'pending' ? 'bg-yellow-50' : 'hover:bg-gray-50'}`}>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-900">{m.name}</div>
                            <div className="text-xs text-gray-400">{m.email}</div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${
                              m.role === 'admin'
                                ? 'bg-purple-100 text-purple-800 border-purple-300'
                                : 'bg-gray-100 text-gray-700 border-gray-300'
                            }`}>
                              {m.role === 'admin' ? 'Admin' : 'Member'}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <StatusBadge status={m.status} />
                          </td>
                          <td className="px-4 py-4 hidden lg:table-cell">
                            {m.mpesaRef
                              ? <span className="font-mono text-xs font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded">{m.mpesaRef}</span>
                              : <span className="text-xs text-gray-300">—</span>
                            }
                          </td>
                          <td className="px-4 py-4 text-gray-400 text-xs hidden md:table-cell">
                            {new Date(m.createdAt).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="px-4 py-4">
                            {m.id === user?.id ? (
                              <span className="text-xs text-gray-400 italic">You</span>
                            ) : (
                              <div className="flex flex-wrap items-center gap-2">
                                {m.status === 'pending' && (
                                  <>
                                    <button
                                      disabled={memberActionId === m.id}
                                      onClick={() => handleMemberAction(m.id, { status: 'approved' })}
                                      className="text-xs px-2.5 py-1 bg-green-600 text-white font-semibold rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      disabled={memberActionId === m.id}
                                      onClick={() => handleMemberAction(m.id, { status: 'rejected' })}
                                      className="text-xs px-2.5 py-1 bg-red-500 text-white font-semibold rounded hover:bg-red-600 disabled:opacity-50 transition-colors"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}
                                {m.status === 'approved' && (
                                  <button
                                    disabled={memberActionId === m.id}
                                    onClick={() => handleMemberAction(m.id, { status: 'rejected' })}
                                    className="text-xs px-2.5 py-1 border border-red-300 text-red-600 font-semibold rounded hover:bg-red-50 disabled:opacity-50 transition-colors"
                                  >
                                    Suspend
                                  </button>
                                )}
                                {m.status === 'rejected' && (
                                  <button
                                    disabled={memberActionId === m.id}
                                    onClick={() => handleMemberAction(m.id, { status: 'approved' })}
                                    className="text-xs px-2.5 py-1 border border-green-300 text-green-700 font-semibold rounded hover:bg-green-50 disabled:opacity-50 transition-colors"
                                  >
                                    Reinstate
                                  </button>
                                )}
                                <button
                                  disabled={memberActionId === m.id}
                                  onClick={() => handleMemberAction(m.id, { role: m.role === 'admin' ? 'user' : 'admin' })}
                                  className="text-xs px-2.5 py-1 border border-purple-300 text-purple-700 font-semibold rounded hover:bg-purple-50 disabled:opacity-50 transition-colors"
                                >
                                  {m.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-6">
          <Link href="/" className="text-teal-700 hover:underline text-sm font-semibold">← Back to Homepage</Link>
        </div>
      </div>
    </>
  )
}
