/**
 * Database access layer — wraps Supabase so the rest of the app
 * never imports @supabase/supabase-js directly.
 *
 * All functions are async. Column mapping: DB uses snake_case,
 * TypeScript uses camelCase.
 */

import { adminDb } from './supabase-admin'
import type { Post, User, Comment } from './types'

// ─────────────────────────────────────────────────────────────────
// POSTS
// ─────────────────────────────────────────────────────────────────

export async function getPublishedPosts(): Promise<Post[]> {
  const { data, error } = await adminDb
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
  if (error) { console.error('getPublishedPosts:', error.message); return [] }
  return (data ?? []).map(rowToPost)
}

export async function getAllPosts(): Promise<Post[]> {
  const { data, error } = await adminDb
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) { console.error('getAllPosts:', error.message); return [] }
  return (data ?? []).map(rowToPost)
}

export async function findPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await adminDb
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error || !data) return null
  return rowToPost(data)
}

export async function findPostById(id: string): Promise<Post | null> {
  const { data, error } = await adminDb
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()
  if (error || !data) return null
  return rowToPost(data)
}

export async function addPost(post: Post): Promise<Post> {
  const { data, error } = await adminDb
    .from('posts')
    .insert(postToRow(post))
    .select()
    .single()
  if (error) throw new Error(error.message)
  return rowToPost(data)
}

export async function updatePost(id: string, updates: Partial<Post>): Promise<Post | null> {
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (updates.title     !== undefined) row.title      = updates.title
  if (updates.excerpt   !== undefined) row.excerpt     = updates.excerpt
  if (updates.content   !== undefined) row.content     = updates.content
  if (updates.category  !== undefined) row.category    = updates.category
  if (updates.image     !== undefined) row.image       = updates.image ?? null
  if (updates.published !== undefined) row.published   = updates.published

  const { data, error } = await adminDb
    .from('posts')
    .update(row)
    .eq('id', id)
    .select()
    .single()
  if (error) { console.error('updatePost:', error.message); return null }
  return rowToPost(data)
}

export async function deletePost(id: string): Promise<boolean> {
  const { error } = await adminDb.from('posts').delete().eq('id', id)
  return !error
}

export async function slugExists(slug: string): Promise<boolean> {
  const { count } = await adminDb
    .from('posts')
    .select('id', { count: 'exact', head: true })
    .eq('slug', slug)
  return (count ?? 0) > 0
}

// ─────────────────────────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────────────────────────

export async function findUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await adminDb
    .from('users')
    .select('id, name, email, password, role, created_at')
    .eq('email', email)
    .single()
  if (error || !data) return null
  return rowToUser(data)
}

export async function findUserById(id: string): Promise<User | null> {
  const { data, error } = await adminDb
    .from('users')
    .select('id, name, email, role, created_at')
    .eq('id', id)
    .single()
  if (error || !data) return null
  return { ...rowToUser(data), password: '' }
}

export async function addUser(user: User): Promise<User> {
  const { data, error } = await adminDb
    .from('users')
    .insert({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      created_at: user.createdAt,
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return rowToUser(data)
}

// ─────────────────────────────────────────────────────────────────
// COMMENTS
// ─────────────────────────────────────────────────────────────────

export async function getCommentsByPost(postId: string): Promise<Comment[]> {
  const { data, error } = await adminDb
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })
  if (error) return []
  return (data ?? []).map(rowToComment)
}

export async function addComment(comment: Comment): Promise<Comment> {
  const { data, error } = await adminDb
    .from('comments')
    .insert({
      id: comment.id,
      post_id: comment.postId,
      author_id: comment.authorId,
      author_name: comment.authorName,
      content: comment.content,
      created_at: comment.createdAt,
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return rowToComment(data)
}

export async function deleteComment(id: string): Promise<boolean> {
  const { error } = await adminDb.from('comments').delete().eq('id', id)
  return !error
}

export async function findCommentById(id: string): Promise<Comment | null> {
  const { data, error } = await adminDb
    .from('comments')
    .select('*')
    .eq('id', id)
    .single()
  if (error || !data) return null
  return rowToComment(data)
}

// ─────────────────────────────────────────────────────────────────
// Row mappers
// ─────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToPost(r: any): Post {
  return {
    id:         r.id,
    title:      r.title,
    slug:       r.slug,
    excerpt:    r.excerpt,
    content:    r.content,
    category:   r.category,
    image:      r.image ?? undefined,
    authorId:   r.author_id,
    authorName: r.author_name,
    published:  r.published,
    createdAt:  r.created_at,
    updatedAt:  r.updated_at,
  }
}

function postToRow(p: Post) {
  return {
    id:          p.id,
    title:       p.title,
    slug:        p.slug,
    excerpt:     p.excerpt,
    content:     p.content,
    category:    p.category,
    image:       p.image ?? null,
    author_id:   p.authorId,
    author_name: p.authorName,
    published:   p.published,
    created_at:  p.createdAt,
    updated_at:  p.updatedAt,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToUser(r: any): User {
  return {
    id:        r.id,
    name:      r.name,
    email:     r.email,
    password:  r.password,
    role:      r.role,
    createdAt: r.created_at,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToComment(r: any): Comment {
  return {
    id:         r.id,
    postId:     r.post_id,
    authorId:   r.author_id,
    authorName: r.author_name,
    content:    r.content,
    createdAt:  r.created_at,
  }
}
