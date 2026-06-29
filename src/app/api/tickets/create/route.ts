import { NextRequest, NextResponse } from 'next/server'
import { generateTicketCode, verifyMegaPayPayment } from '@/lib/ticket'
import * as db from '@/lib/db'
import { checkRateLimit } from '@/lib/rate-limit'

const PRICES: Record<string, number> = { regular: 500, vip: 1000, vvip: 2000 }

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const rl = checkRateLimit(`ticket-create:${ip}`, 5, 60 * 60_000)
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })
  }

  try {
    const { name, phone, email, ticketType, qty, transactionRequestId } = await request.json()

    if (!name || !phone || !email || !ticketType || !qty || !transactionRequestId) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    // Idempotent: return existing ticket for the same payment
    const existing = await db.findTicketByTransactionId(transactionRequestId)
    if (existing) {
      return NextResponse.json({ ticket: existing })
    }

    // Server independently verifies payment with MegaPay
    const payment = await verifyMegaPayPayment(transactionRequestId)
    if (!payment.verified) {
      return NextResponse.json(
        { error: 'Payment could not be confirmed. Contact mombasayouthcouncil@gmail.com' },
        { status: 402 },
      )
    }

    const price = PRICES[ticketType]
    if (!price) return NextResponse.json({ error: 'Invalid ticket type.' }, { status: 400 })

    // Collision-safe unique code
    let ticketCode = generateTicketCode()
    for (let i = 0; i < 5; i++) {
      if (!(await db.findTicketByCode(ticketCode))) break
      ticketCode = generateTicketCode()
    }

    const ticket = await db.createTicket({
      ticketCode,
      holderName:           name.trim(),
      holderPhone:          phone.trim(),
      holderEmail:          email.trim().toLowerCase(),
      ticketType,
      ticketPrice:          price,
      quantity:             Number(qty),
      totalPaid:            price * Number(qty),
      mpesaReceipt:         payment.receipt ?? 'N/A',
      transactionRequestId,
    })

    return NextResponse.json({ ticket }, { status: 201 })
  } catch (err) {
    console.error('ticket:create', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
