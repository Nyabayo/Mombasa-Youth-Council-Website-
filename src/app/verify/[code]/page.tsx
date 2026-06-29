'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface TicketInfo {
  ticketCode: string
  holderName: string
  ticketType: string
  quantity: number
  totalPaid: number
  status: string
  createdAt: string
  checkedInAt?: string
  checkedInBy?: string
}

const TYPE_LABEL: Record<string, string> = { regular: 'Regular', vip: 'VIP', vvip: 'VVIP' }

export default function VerifyPage() {
  const { code } = useParams<{ code: string }>()
  const [ticket, setTicket]     = useState<TicketInfo | null>(null)
  const [loading, setLoading]   = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [staffCode, setStaffCode]   = useState('')
  const [checking, setChecking]     = useState(false)
  const [checkMsg, setCheckMsg]     = useState('')
  const [checkOk, setCheckOk]       = useState(false)

  useEffect(() => {
    if (!code) return
    fetch(`/api/tickets/verify?code=${encodeURIComponent(code.toUpperCase())}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setNotFound(true) } else { setTicket(data) }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [code])

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setChecking(true)
    setCheckMsg('')
    const res  = await fetch('/api/tickets/verify', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code.toUpperCase(), staffCode }),
    })
    const data = await res.json()
    if (res.ok) {
      setCheckOk(true)
      setCheckMsg('Checked in successfully.')
      setTicket((t) => t ? { ...t, status: 'used', checkedInAt: new Date().toISOString() } : t)
    } else {
      setCheckMsg(data.error ?? 'Check-in failed.')
    }
    setChecking(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 rounded-full border-t-transparent animate-spin mx-auto mb-4" style={{ borderColor: 'var(--primary)' }} />
          <p style={{ color: 'var(--text-muted)' }}>Verifying ticket...</p>
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-red-100 border-2 border-red-400 rounded-full flex items-center justify-center mx-auto mb-5 text-4xl">
            ✕
          </div>
          <h1 className="text-2xl font-black mb-2" style={{ color: 'var(--text)' }}>Ticket Not Found</h1>
          <p className="mb-6" style={{ color: 'var(--text-muted)' }}>
            No ticket with code <strong className="font-mono">{code?.toUpperCase()}</strong> exists in our system.
          </p>
          <Link href="/tickets" className="inline-block px-6 py-3 text-white font-bold rounded-lg" style={{ backgroundColor: 'var(--primary)' }}>
            Book a Ticket
          </Link>
        </div>
      </div>
    )
  }

  const isValid    = ticket?.status === 'valid'
  const isUsed     = ticket?.status === 'used'
  const typeLabel  = TYPE_LABEL[ticket?.ticketType ?? ''] ?? ticket?.ticketType ?? ''

  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-md mx-auto">

        {/* Status badge */}
        <div className={`rounded-2xl p-6 text-center mb-6 ${
          isValid ? 'bg-green-500' : isUsed ? 'bg-yellow-500' : 'bg-red-500'
        }`}>
          <div className="text-5xl mb-3">{isValid ? '✓' : isUsed ? '⚑' : '✕'}</div>
          <h1 className="text-2xl font-black text-white">
            {isValid ? 'VALID TICKET' : isUsed ? 'ALREADY CHECKED IN' : 'INVALID TICKET'}
          </h1>
          {isUsed && ticket?.checkedInAt && (
            <p className="text-white/80 text-sm mt-1">
              Checked in: {new Date(ticket.checkedInAt).toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          )}
        </div>

        {/* Ticket details */}
        <div className="rounded-2xl border overflow-hidden mb-6" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <div style={{ backgroundColor: 'var(--primary)' }} className="px-5 py-4">
            <p className="text-[#00A8C8] text-xs font-bold tracking-widest uppercase">Mombasa Youth Innovation Festival 2026</p>
            <h2 className="text-white text-xl font-black mt-0.5">Gala Dinner and Awards</h2>
          </div>
          <div className="p-5 space-y-3">
            {[
              { label: 'Ticket Code',   value: ticket?.ticketCode,                mono: true },
              { label: 'Holder',        value: ticket?.holderName },
              { label: 'Ticket Type',   value: `${typeLabel} x${ticket?.quantity}`, highlight: true },
              { label: 'Amount Paid',   value: `KSH ${ticket?.totalPaid?.toLocaleString()}` },
              { label: 'Event Date',    value: '11th July 2026, 6:00 PM' },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center gap-4 text-sm">
                <span style={{ color: 'var(--text-light)' }}>{row.label}</span>
                <span className={`font-bold text-right ${row.mono ? 'font-mono tracking-widest' : ''} ${row.highlight ? 'text-[#c9a84c]' : ''}`} style={!row.highlight ? { color: 'var(--text)' } : {}}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Staff check-in */}
        {isValid && (
          <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--bg-alt)', borderColor: 'var(--border)' }}>
            <h3 className="font-black mb-3" style={{ color: 'var(--text)' }}>Event Staff Check-In</h3>
            {checkOk ? (
              <p className="text-green-600 font-bold">{checkMsg}</p>
            ) : (
              <form onSubmit={handleCheckIn} className="space-y-3">
                <input
                  type="password"
                  value={staffCode}
                  onChange={(e) => setStaffCode(e.target.value)}
                  placeholder="Staff code"
                  className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-card)', color: 'var(--text)' }}
                />
                {checkMsg && <p className="text-red-600 text-sm">{checkMsg}</p>}
                <button
                  type="submit"
                  disabled={checking || !staffCode}
                  className="w-full py-2.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {checking ? 'Checking in...' : 'Mark as Checked In'}
                </button>
              </form>
            )}
          </div>
        )}

        <div className="text-center mt-8">
          <Link href="/" className="text-sm hover:underline" style={{ color: 'var(--text-light)' }}>
            Back to MYC Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
