import { NextRequest, NextResponse } from 'next/server'
import * as db from '@/lib/db'
import { getSession } from '@/lib/session'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession()
  if (!session?.userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const { id } = await params
  const comment = await db.findCommentById(id)
  if (!comment) {
    return NextResponse.json({ error: 'Comment not found.' }, { status: 404 })
  }

  if (comment.authorId !== session.userId && session.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
  }

  await db.deleteComment(id)
  return NextResponse.json({ message: 'Comment deleted.' })
}
