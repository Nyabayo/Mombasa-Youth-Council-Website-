import { NextRequest, NextResponse } from 'next/server'
import * as db from '@/lib/db'
import { getSession } from '@/lib/session'
import { sanitizePostContent, isValidImageUrl, ALLOWED_CATEGORIES } from '@/lib/sanitize'

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/posts/[id]'>) {
  const { id } = await ctx.params
  if (!id || id.length > 200) {
    return NextResponse.json({ error: 'Invalid id.' }, { status: 400 })
  }
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

    if (body.category !== undefined && !ALLOWED_CATEGORIES.includes(body.category)) {
      return NextResponse.json({ error: 'Invalid category.' }, { status: 400 })
    }
    if (body.image !== undefined && !isValidImageUrl(body.image)) {
      return NextResponse.json({ error: 'Invalid image URL.' }, { status: 400 })
    }
    if (body.title !== undefined && (typeof body.title !== 'string' || body.title.trim().length > 200)) {
      return NextResponse.json({ error: 'Title must be under 200 characters.' }, { status: 400 })
    }
    if (body.excerpt !== undefined && (typeof body.excerpt !== 'string' || body.excerpt.trim().length > 500)) {
      return NextResponse.json({ error: 'Excerpt must be under 500 characters.' }, { status: 400 })
    }

    const updated = await db.updatePost(id, {
      title:    body.title    !== undefined ? body.title.trim()              : post.title,
      excerpt:  body.excerpt  !== undefined ? body.excerpt.trim()            : post.excerpt,
      content:  body.content  !== undefined ? sanitizePostContent(body.content) : post.content,
      category: body.category !== undefined ? body.category                 : post.category,
      image:    body.image    !== undefined ? body.image                    : post.image,
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
