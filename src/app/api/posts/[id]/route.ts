import { NextRequest, NextResponse } from 'next/server'
import * as db from '@/lib/db'
import { getSession } from '@/lib/session'

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/posts/[id]'>) {
  const { id } = await ctx.params
  const post = (await db.findPostById(id)) ?? (await db.findPostBySlug(id))
  if (!post || !post.published) {
    return NextResponse.json({ error: 'Post not found.' }, { status: 404 })
  }
  const comments = await db.getCommentsByPost(post.id)
  return NextResponse.json({ post, comments })
}

export async function PUT(request: NextRequest, ctx: RouteContext<'/api/posts/[id]'>) {
  const session = await getSession()
  if (!session?.userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const { id } = await ctx.params
  const post = await db.findPostById(id)
  if (!post) return NextResponse.json({ error: 'Post not found.' }, { status: 404 })

  if (post.authorId !== session.userId && session.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const updated = await db.updatePost(id, {
      title:    body.title    ?? post.title,
      excerpt:  body.excerpt  ?? post.excerpt,
      content:  body.content  ?? post.content,
      category: body.category ?? post.category,
      image:    body.image    ?? post.image,
    })
    return NextResponse.json({ post: updated })
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<'/api/posts/[id]'>) {
  const session = await getSession()
  if (!session?.userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const { id } = await ctx.params
  const post = await db.findPostById(id)
  if (!post) return NextResponse.json({ error: 'Post not found.' }, { status: 404 })

  if (post.authorId !== session.userId && session.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
  }

  await db.deletePost(id)
  return NextResponse.json({ message: 'Post deleted.' })
}
