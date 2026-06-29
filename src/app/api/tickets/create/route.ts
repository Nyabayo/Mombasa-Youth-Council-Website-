import { NextRequest, NextResponse } from 'next/server'
import { generateTicketCode, verifyMegaPayPayment } from '@/lib/ticket'
import * as db from '@/lib/db'
import { checkRateLimit } from '@/lib/rate-limit'

const PRICES: Record<string, number> = { regular: 500, vip: 1000, vvip: 2000 }

interface HolderInput {
  holderName: string
  holderPhone: string
  holderEmail: string
  ticketType: string
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const rl = checkRateLimit(`ticket-create:${ip}`, 5, 60 * 60_000)
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })
  }

  try {
    const { transactionRequestId, tickets: holders } = await request.json()

    if (!transactionRequestId || !Array.isArray(holders) || holders.length === 0) {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
    }

    // Idempotent: return all existing tickets for this payment
    const existing = await db.findTicketsByTransactionId(transactionRequestId)
    if (existing.length > 0) {
      return NextResponse.json({ tickets: existing })
    }

    // Server independently verifies payment with MegaPay
    const payment = await verifyMegaPayPayment(transactionRequestId)
    if (!payment.verified) {
      return NextResponse.json(
        { error: 'Payment could not be confirmed. Contact mombasayouthcouncil@gmail.com' },
        { status: 402 },
      )
    }

    const created = []
    for (const holder of holders as HolderInput[]) {
      const price = PRICES[holder.ticketType]
      if (!price) continue

      let ticketCode = generateTicketCode()
      for (let i = 0; i < 5; i++) {
        if (!(await db.findTicketByCode(ticketCode))) break
        ticketCode = generateTicketCode()
      }

      const ticket = await db.createTicket({
        ticketCode,
        holderName:           holder.holderName.trim(),
        holderPhone:          holder.holderPhone.trim(),
        holderEmail:          holder.holderEmail.trim().toLowerCase(),
        ticketType:           holder.ticketType,
        ticketPrice:          price,
        quantity:             1,
        totalPaid:            price,
        mpesaReceipt:         payment.receipt ?? 'N/A',
        transactionRequestId,
      })
      created.push(ticket)
    }

    return NextResponse.json({ tickets: created }, { status: 201 })
  } catch (err) {
    console.error('ticket:create', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
