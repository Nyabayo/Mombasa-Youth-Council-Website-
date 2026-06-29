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
    .select('id, name, email, password, role, status, mpesa_ref, created_at')
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
      status: user.status,
      mpesa_ref: user.mpesaRef ?? null,
      created_at: user.createdAt,
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return rowToUser(data)
}

export async function getAllUsers(): Promise<Omit<User, 'password'>[]> {
  const { data, error } = await adminDb
    .from('users')
    .select('id, name, email, role, status, mpesa_ref, created_at')
    .order('created_at', { ascending: false })
  if (error) { console.error('getAllUsers:', error.message); return [] }
  return (data ?? []).map((r) => ({
    id: r.id, name: r.name, email: r.email,
    role: r.role, status: r.status,
    mpesaRef: r.mpesa_ref ?? undefined,
    createdAt: r.created_at,
    password: '',
  }))
}

export async function updateUser(
  id: string,
  updates: { role?: string; status?: string },
): Promise<boolean> {
  const { error } = await adminDb.from('users').update(updates).eq('id', id)
  if (error) { console.error('updateUser:', error.message); return false }
  return true
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
// TICKETS
// ─────────────────────────────────────────────────────────────────

export interface Ticket {
  id: string
  ticketCode: string
  holderName: string
  holderPhone: string
  holderEmail: string
  ticketType: string
  ticketPrice: number
  quantity: number
  totalPaid: number
  mpesaReceipt: string
  transactionRequestId: string
  status: string
  createdAt: string
  checkedInAt?: string
  checkedInBy?: string
}

export async function createTicket(t: Omit<Ticket, 'id' | 'createdAt' | 'status'>): Promise<Ticket> {
  const { data, error } = await adminDb
    .from('tickets')
    .insert({
      ticket_code:             t.ticketCode,
      holder_name:             t.holderName,
      holder_phone:            t.holderPhone,
      holder_email:            t.holderEmail,
      ticket_type:             t.ticketType,
      ticket_price:            t.ticketPrice,
      quantity:                t.quantity,
      total_paid:              t.totalPaid,
      mpesa_receipt:           t.mpesaReceipt,
      transaction_request_id:  t.transactionRequestId,
      status:                  'valid',
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return rowToTicket(data)
}

export async function findTicketByCode(code: string): Promise<Ticket | null> {
  const { data, error } = await adminDb
    .from('tickets').select('*').eq('ticket_code', code).single()
  if (error || !data) return null
  return rowToTicket(data)
}

export async function findTicketByTransactionId(txId: string): Promise<Ticket | null> {
  const { data, error } = await adminDb
    .from('tickets').select('*').eq('transaction_request_id', txId).limit(1).single()
  if (error || !data) return null
  return rowToTicket(data)
}

export async function findTicketsByTransactionId(txId: string): Promise<Ticket[]> {
  const { data, error } = await adminDb
    .from('tickets').select('*').eq('transaction_request_id', txId)
  if (error || !data) return []
  return data.map(rowToTicket)
}

export async function checkInTicket(code: string, staffName: string): Promise<boolean> {
  const { error } = await adminDb
    .from('tickets')
    .update({ status: 'used', checked_in_at: new Date().toISOString(), checked_in_by: staffName })
    .eq('ticket_code', code)
    .eq('status', 'valid')
  return !error
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
    password:  r.password ?? '',
    role:      r.role,
    status:    r.status ?? 'approved',
    mpesaRef:  r.mpesa_ref ?? undefined,
    createdAt: r.created_at,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToTicket(r: any): Ticket {
  return {
    id:                   r.id,
    ticketCode:           r.ticket_code,
    holderName:           r.holder_name,
    holderPhone:          r.holder_phone,
    holderEmail:          r.holder_email,
    ticketType:           r.ticket_type,
    ticketPrice:          r.ticket_price,
    quantity:             r.quantity,
    totalPaid:            r.total_paid,
    mpesaReceipt:         r.mpesa_receipt,
    transactionRequestId: r.transaction_request_id,
    status:               r.status,
    createdAt:            r.created_at,
    checkedInAt:          r.checked_in_at ?? undefined,
    checkedInBy:          r.checked_in_by ?? undefined,
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
