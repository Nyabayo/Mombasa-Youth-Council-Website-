import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import * as db from '@/lib/db'
import { getSession } from '@/lib/session'
import { sanitizePostContent, isValidImageUrl, ALLOWED_CATEGORIES } from '@/lib/sanitize'
import { checkRateLimit } from '@/lib/rate-limit'

export async function GET() {
  const posts = await db.getPublishedPosts()
  return NextResponse.json({ posts: posts.map(({ content: _, ...p }) => p) })
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session?.userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }
  if (session.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const rl = checkRateLimit(`post:${ip}`, 20, 60_000)
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many requests.' }, {
      status: 429,
      headers: { 'Retry-After': String(rl.retryAfter) },
    })
  }

  try {
    const body = await request.json()
    const { title, excerpt, content, category, image } = body

    if (!title || !excerpt || !content || !category) {
      return NextResponse.json({ error: 'title, excerpt, content, and category are required.' }, { status: 400 })
    }

    if (typeof title !== 'string' || title.trim().length > 200) {
      return NextResponse.json({ error: 'Title must be under 200 characters.' }, { status: 400 })
    }
    if (typeof excerpt !== 'string' || excerpt.trim().length > 500) {
      return NextResponse.json({ error: 'Excerpt must be under 500 characters.' }, { status: 400 })
    }
    if (!ALLOWED_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: 'Invalid category.' }, { status: 400 })
    }
    if (image && !isValidImageUrl(image)) {
      return NextResponse.json({ error: 'Invalid image URL.' }, { status: 400 })
    }

    const safeContent = sanitizePostContent(content)

    let slug = slugify(title)
    let counter = 1
    while (await db.slugExists(slug)) {
      slug = `${slugify(title)}-${counter++}`
    }

    const post = await db.addPost({
      id: uuidv4(),
      title: title.trim(),
      slug,
      excerpt: excerpt.trim(),
      content: safeContent,
      category: category.trim(),
      image: image ?? undefined,
      authorId: session.userId,
      authorName: session.name,
      published: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    return NextResponse.json({ post }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
