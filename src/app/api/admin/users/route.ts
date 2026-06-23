import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import * as db from '@/lib/db'
import { getSession } from '@/lib/session'

async function requireAdmin() {
  const session = await getSession()
  if (!session?.userId) return { error: 'Authentication required.', status: 401 }
  if (session.role !== 'admin') return { error: 'Forbidden.', status: 403 }
  return { session }
}

export async function GET() {
  const check = await requireAdmin()
  if ('error' in check) return NextResponse.json({ error: check.error }, { status: check.status })

  const users = await db.getAllUsers()
  return NextResponse.json({ users })
}

export async function POST(request: NextRequest) {
  const check = await requireAdmin()
  if ('error' in check) return NextResponse.json({ error: check.error }, { status: check.status })

  try {
    const body = await request.json()
    const { name, email, password, role } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 })
    }
    if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
      return NextResponse.json({ error: 'Name must be 2–100 characters.' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }
    if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
      return NextResponse.json({ error: 'Password must be 8–128 characters.' }, { status: 400 })
    }
    const assignedRole = role === 'admin' ? 'admin' : 'user'

    const existing = await db.findUserByEmail(email.toLowerCase().trim())
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 12)
    const user = await db.addUser({
      id: uuidv4(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashed,
      role: assignedRole,
      status: 'approved',
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status },
    }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
