import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { store } from '@/lib/store'
import { getSession } from '@/lib/session'

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session?.userId) {
    return NextResponse.json({ error: 'You must be logged in to comment.' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { postId, content } = body

    if (!postId || !content?.trim()) {
      return NextResponse.json({ error: 'postId and content are required.' }, { status: 400 })
    }

    if (content.trim().length > 1000) {
      return NextResponse.json({ error: 'Comment must be under 1000 characters.' }, { status: 400 })
    }

    const post = store.findPostById(postId)
    if (!post || !post.published) {
      return NextResponse.json({ error: 'Post not found.' }, { status: 404 })
    }

    const comment = store.addComment({
      id: uuidv4(),
      postId,
      authorId: session.userId,
      authorName: session.name,
      content: content.trim(),
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ comment }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
