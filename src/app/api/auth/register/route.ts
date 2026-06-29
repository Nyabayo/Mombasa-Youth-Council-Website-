import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import * as db from '@/lib/db'
import { checkRateLimit } from '@/lib/rate-limit'
import { verifyMegaPayPayment } from '@/lib/ticket'
import { createSession } from '@/lib/session'

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
    const { name, email, password, transactionRequestId } = body

    if (!name || !email || !password || !transactionRequestId) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }
    if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
      return NextResponse.json({ error: 'Name must be between 2 and 100 characters.' }, { status: 400 })
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

    // Check email not already taken
    const existing = await db.findUserByEmail(email.toLowerCase().trim())
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
    }

    // Server-side payment verification with MegaPay
    const payment = await verifyMegaPayPayment(transactionRequestId)
    if (!payment.verified) {
      return NextResponse.json(
        { error: 'Payment could not be confirmed. Please contact mombasayouthcouncil@gmail.com' },
        { status: 402 },
      )
    }

    const hashed = await bcrypt.hash(password, 12)
    const userId = uuidv4()

    await db.addUser({
      id:        userId,
      name:      name.trim(),
      email:     email.toLowerCase().trim(),
      password:  hashed,
      role:      'user',
      status:    'approved',
      mpesaRef:  payment.receipt ?? transactionRequestId,
      createdAt: new Date().toISOString(),
    })

    // Create session immediately - user is a full member
    await createSession({ userId, email: email.toLowerCase().trim(), role: 'user', name: name.trim() })

    return NextResponse.json(
      { message: 'Account created successfully.', status: 'approved' },
      { status: 201 },
    )
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
