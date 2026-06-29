const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function generateTicketCode(): string {
  const bytes = new Uint8Array(8)
  crypto.getRandomValues(bytes)
  const suffix = Array.from(bytes).map((b) => CHARS[b % CHARS.length]).join('')
  return `MYIF26-${suffix}`
}

export async function verifyMegaPayPayment(transactionRequestId: string): Promise<{
  verified: boolean
  receipt?: string
  amount?: string
}> {
  try {
    const res = await fetch('https://megapay.co.ke/backend/v1/transactionstatus', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key:                process.env.MEGAPAY_API_KEY,
        email:                  process.env.MEGAPAY_EMAIL,
        transaction_request_id: transactionRequestId,
      }),
    })
    const data = await res.json()
    const code   = String(data.ResultCode        ?? data.result_code          ?? '')
    const status = String(data.TransactionStatus ?? data.transaction_status   ?? '').toLowerCase()

    if (code === '0' || status === 'completed') {
      return {
        verified: true,
        receipt:  data.TransactionReceipt ?? data.receipt,
        amount:   data.TransactionAmount  ?? data.amount,
      }
    }
    return { verified: false }
  } catch {
    return { verified: false }
  }
}
