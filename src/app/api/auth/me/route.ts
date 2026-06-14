import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import * as db from '@/lib/db'

export async function GET() {
  const session = await getSession()
  if (!session?.userId) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  const user = await db.findUserById(session.userId)
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  return NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  })
}
