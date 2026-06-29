import { NextRequest, NextResponse } from 'next/server'
import * as db from '@/lib/db'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  if (!code) return NextResponse.json({ error: 'Ticket code required.' }, { status: 400 })

  const ticket = await db.findTicketByCode(code.toUpperCase())
  if (!ticket) return NextResponse.json({ error: 'Ticket not found.' }, { status: 404 })

  return NextResponse.json({
    ticketCode:   ticket.ticketCode,
    holderName:   ticket.holderName,
    ticketType:   ticket.ticketType,
    quantity:     ticket.quantity,
    totalPaid:    ticket.totalPaid,
    status:       ticket.status,
    createdAt:    ticket.createdAt,
    checkedInAt:  ticket.checkedInAt,
    checkedInBy:  ticket.checkedInBy,
  })
}

export async function PATCH(request: NextRequest) {
  const { code, staffCode } = await request.json()

  if (!code || !staffCode) {
    return NextResponse.json({ error: 'Code and staff code required.' }, { status: 400 })
  }
  if (staffCode !== process.env.EVENT_STAFF_CODE) {
    return NextResponse.json({ error: 'Invalid staff code.' }, { status: 403 })
  }

  const ticket = await db.findTicketByCode(code.toUpperCase())
  if (!ticket) return NextResponse.json({ error: 'Ticket not found.' }, { status: 404 })
  if (ticket.status === 'used') {
    return NextResponse.json(
      { error: `Already checked in at ${ticket.checkedInAt}.` },
      { status: 409 },
    )
  }

  await db.checkInTicket(code.toUpperCase(), 'Staff')
  return NextResponse.json({ success: true })
}
