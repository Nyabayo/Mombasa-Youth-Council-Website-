import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { transactionRequestId } = await req.json()

    if (!transactionRequestId) {
      return NextResponse.json({ error: 'transactionRequestId required.' }, { status: 400 })
    }

    const res = await fetch('https://megapay.co.ke/backend/v1/transactionstatus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key:                process.env.MEGAPAY_API_KEY,
        email:                  process.env.MEGAPAY_EMAIL,
        transaction_request_id: transactionRequestId,
      }),
    })

    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}
