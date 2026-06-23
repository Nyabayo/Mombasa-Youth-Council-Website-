import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import * as db from '@/lib/db'
import { createSession } from '@/lib/session'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const rl = checkRateLimit(`login:${ip}`, 10, 15 * 60_000)
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many login attempts. Please try again later.' }, {
      status: 429,
      headers: { 'Retry-After': String(rl.retryAfter) },
    })
  }

  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }
    if (email.length > 254 || password.length > 128) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
    }

    const user = await db.findUserByEmail(email.toLowerCase().trim())
    if (!user) {
      await bcrypt.compare(password, '$2b$12$invalidhashfortimingprotection000000000000000')
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
    }

    await createSession({ userId: user.id, role: user.role, name: user.name, email: user.email })

    return NextResponse.json({
      message: 'Logged in successfully.',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
