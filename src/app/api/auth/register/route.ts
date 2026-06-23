import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import * as db from '@/lib/db'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const rl = checkRateLimit(`register:${ip}`, 5, 60 * 60_000)
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many registration attempts. Please try again later.' }, {
      status: 429,
      headers: { 'Retry-After': String(rl.retryAfter) },
    })
  }

  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }
    if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
      return NextResponse.json({ error: 'Name must be between 2 and 100 characters.' }, { status: 400 })
    }
    if (typeof email !== 'string' || email.length > 254) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }
    if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
      return NextResponse.json({ error: 'Password must be between 8 and 128 characters.' }, { status: 400 })
    }
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one uppercase letter and one number.' },
        { status: 400 },
      )
    }

    const existing = await db.findUserByEmail(email.toLowerCase().trim())
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 12)
    await db.addUser({
      id: uuidv4(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashed,
      role: 'user',
      status: 'pending',
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json(
      { message: 'Application submitted successfully.', status: 'pending' },
      { status: 201 },
    )
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
