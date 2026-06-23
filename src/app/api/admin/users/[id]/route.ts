import { NextRequest, NextResponse } from 'next/server'
import * as db from '@/lib/db'
import { getSession } from '@/lib/session'

export async function PATCH(request: NextRequest, ctx: RouteContext<'/api/admin/users/[id]'>) {
  const session = await getSession()
  if (!session?.userId) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  if (session.role !== 'admin') return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })

  const { id } = await ctx.params

  try {
    const body = await request.json()
    const updates: { status?: string; role?: string } = {}

    if (body.status !== undefined) {
      if (!['pending', 'approved', 'rejected'].includes(body.status)) {
        return NextResponse.json({ error: 'Invalid status.' }, { status: 400 })
      }
      updates.status = body.status
    }

    if (body.role !== undefined) {
      if (!['admin', 'user'].includes(body.role)) {
        return NextResponse.json({ error: 'Invalid role.' }, { status: 400 })
      }
      // Prevent admin from revoking their own admin role
      if (id === session.userId && body.role !== 'admin') {
        return NextResponse.json({ error: 'You cannot demote yourself.' }, { status: 400 })
      }
      updates.role = body.role
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 })
    }

    const ok = await db.updateUser(id, updates)
    if (!ok) return NextResponse.json({ error: 'User not found or update failed.' }, { status: 404 })

    return NextResponse.json({ message: 'Updated successfully.' })
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
