import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { store } from '@/lib/store'
import { createSession } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }

    const user = store.findUserByEmail(email.toLowerCase().trim())
    if (!user) {
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
