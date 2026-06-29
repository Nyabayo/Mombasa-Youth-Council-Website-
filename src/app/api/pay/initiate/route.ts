import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { phone, amount, reference } = await req.json()

    if (!phone || !amount) {
      return NextResponse.json({ error: 'Phone and amount are required.' }, { status: 400 })
    }

    // Normalise to 254XXXXXXXXX
    const msisdn = String(phone)
      .replace(/\s+/g, '')
      .replace(/^\+/, '')
      .replace(/^0/, '254')

    if (!/^254(7|1)\d{8}$/.test(msisdn)) {
      return NextResponse.json(
        { error: 'Enter a valid Kenyan M-Pesa number (07XX or 01XX).' },
        { status: 400 },
      )
    }

    const res = await fetch('https://megapay.co.ke/backend/v1/initiatestk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key:   process.env.MEGAPAY_API_KEY,
        email:     process.env.MEGAPAY_EMAIL,
        amount:    String(amount),
        msisdn,
        reference: reference ?? `MYC-${Date.now()}`,
      }),
    })

    const data = await res.json()

    const txId =
      data.transaction_request_id ??
      data.TransactionRequestID ??
      data.CheckoutRequestID ??
      null

    if (!txId) {
      return NextResponse.json(
        { error: data.message ?? data.ResponseDescription ?? 'Failed to initiate payment. Check your phone number.' },
        { status: 502 },
      )
    }

    return NextResponse.json({ transactionRequestId: txId })
  } catch {
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}
