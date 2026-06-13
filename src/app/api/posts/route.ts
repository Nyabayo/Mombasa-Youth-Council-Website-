import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { store } from '@/lib/store'
import { getSession } from '@/lib/session'

export async function GET() {
  const posts = store.getPublishedPosts().map(({ content: _, ...p }) => p)
  return NextResponse.json({ posts })
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

  try {
    const body = await request.json()
    const { title, excerpt, content, category, image } = body

    if (!title || !excerpt || !content || !category) {
      return NextResponse.json({ error: 'title, excerpt, content, and category are required.' }, { status: 400 })
    }

    let slug = slugify(title)
    let counter = 1
    while (store.slugExists(slug)) {
      slug = `${slugify(title)}-${counter++}`
    }

    const post = store.addPost({
      id: uuidv4(),
      title: title.trim(),
      slug,
      excerpt: excerpt.trim(),
      content: content.trim(),
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
