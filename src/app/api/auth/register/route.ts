import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { store } from '@/lib/store'
import { createSession } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
    }

    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one uppercase letter and one number.' },
        { status: 400 },
      )
    }

    if (store.findUserByEmail(email)) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 12)
    const user = store.addUser({
      id: uuidv4(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashed,
      role: 'user',
      createdAt: new Date().toISOString(),
    })

    await createSession({ userId: user.id, role: user.role, name: user.name, email: user.email })

    return NextResponse.json(
      { message: 'Account created successfully.', user: { id: user.id, name: user.name, email: user.email, role: user.role } },
      { status: 201 },
    )
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
