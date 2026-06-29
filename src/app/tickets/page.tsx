'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import QRCode from 'qrcode'
import type { Ticket } from '@/lib/db'

const TIERS = [
  { id: 'regular', name: 'Regular', price: 500,  desc: 'Full festival access · Networking sessions · Gala dinner entry' },
  { id: 'vip',     name: 'VIP',     price: 1000, desc: 'Priority seating · VIP lounge access · Front-row awards ceremony' },
  { id: 'vvip',    name: 'VVIP',    price: 2000, desc: 'Premium table placement · Meet & greet with speakers · Exclusive gift pack' },
]

type PayState = 'form' | 'initiating' | 'waiting' | 'creating' | 'done' | 'timeout' | 'cancelled' | 'error'
type HolderForm = { firstName: string; lastName: string; email: string; phone: string }

const emptyHolder = (): HolderForm => ({ firstName: '', lastName: '', email: '', phone: '' })

const TIER_BADGE: Record<string, { bg: string; color: string }> = {
  regular: { bg: '#e2e8f0', color: '#1a1a1a' },
  vip:     { bg: '#4ade80', color: '#064e3b' },
  vvip:    { bg: '#c9a84c', color: '#0f2419' },
}

export default function TicketsPage() {
  const [quantities,    setQuantities]    = useState<Record<string, number>>({ regular: 0, vip: 0, vvip: 0 })
  const [holders,       setHolders]       = useState<Record<string, HolderForm[]>>({ regular: [], vip: [], vvip: [] })
  const [payerPhone,    setPayerPhone]    = useState('')
  const [customAmount,  setCustomAmount]  = useState('')
  const [payState,      setPayState]      = useState<PayState>('form')
  const [error,         setError]         = useState('')
  const [tickets,       setTickets]       = useState<Ticket[]>([])
  const [countdown,     setCountdown]     = useState(60)
  const [qrDataUrls,    setQrDataUrls]    = useState<Record<string, string>>({})
  const [downloading,   setDownloading]   = useState(false)

  const pollRef       = useRef<ReturnType<typeof setInterval> | null>(null)
  const timerRef      = useRef<ReturnType<typeof setInterval> | null>(null)
  const attemptsRef   = useRef(0)
  const downloadedRef = useRef(false)

  const total        = TIERS.reduce((s, t) => s + (quantities[t.id] ?? 0) * t.price, 0)
  const totalTickets = TIERS.reduce((s, t) => s + (quantities[t.id] ?? 0), 0)
  const firstHolder  = TIERS.flatMap(t => holders[t.id] ?? []).find(h => h.firstName || h.lastName || h.email || h.phone)

  // ── Quantity ────────────────────────────────────────────────────────────────
  const handleQtyChange = (tierId: string, qty: number) => {
    setQuantities(q => ({ ...q, [tierId]: qty }))
    setHolders(h => {
      const cur = h[tierId] || []
      if (qty > cur.length) return { ...h, [tierId]: [...cur, ...Array.from({ length: qty - cur.length }, emptyHolder)] }
      return { ...h, [tierId]: cur.slice(0, qty) }
    })
  }

  // ── Holder field ────────────────────────────────────────────────────────────
  const handleHolderChange = (tierId: string, idx: number, field: keyof HolderForm, value: string) => {
    setHolders(h => {
      const updated = [...(h[tierId] || [])]
      updated[idx] = { ...updated[idx], [field]: value }
      return { ...h, [tierId]: updated }
    })
  }

  // ── Copy first holder to all ────────────────────────────────────────────────
  const applyFirstToAll = () => {
    const first = TIERS.flatMap(t => holders[t.id] ?? []).find(() => true)
    if (!first) return
    setHolders(h => {
      const result: Record<string, HolderForm[]> = {}
      for (const [tid, forms] of Object.entries(h)) result[tid] = forms.map(() => ({ ...first }))
      return result
    })
  }

  // ── Polling cleanup ─────────────────────────────────────────────────────────
  const stopPolling = () => {
    if (pollRef.current)  clearInterval(pollRef.current)
    if (timerRef.current) clearInterval(timerRef.current)
  }
  useEffect(() => () => stopPolling(), [])

  // ── QR codes ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!tickets.length || typeof window === 'undefined') return
    tickets.forEach(t => {
      const url = `${window.location.origin}/verify/${t.ticketCode}`
      QRCode.toDataURL(url, { width: 200, margin: 1, color: { dark: '#0f2419', light: '#ffffff' } })
        .then(dataUrl => setQrDataUrls(prev => ({ ...prev, [t.ticketCode]: dataUrl })))
        .catch(() => {})
    })
  }, [tickets])

  // ── Auto-download when all QRs ready ───────────────────────────────────────
  const allQrsReady = tickets.length > 0 && tickets.every(t => qrDataUrls[t.ticketCode])
  useEffect(() => {
    if (!allQrsReady || downloadedRef.current) return
    downloadedRef.current = true
    tickets.forEach((t, i) => setTimeout(() => downloadSingleTicket(t), i * 700 + 400))
  }, [allQrsReady]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Download one ticket ─────────────────────────────────────────────────────
  const downloadSingleTicket = async (t: Ticket) => {
    const el = document.getElementById(`tc-${t.ticketCode}`)
    if (!el) return
    const { default: h2c } = await import('html2canvas')
    const canvas = await h2c(el, { scale: 3, useCORS: true, allowTaint: false, backgroundColor: '#0f2419', logging: false })
    const a = document.createElement('a')
    a.download = `MYIF2026-${t.ticketCode}.jpg`
    a.href = canvas.toDataURL('image/jpeg', 0.95)
    a.click()
  }

  const downloadAll = async () => {
    setDownloading(true)
    for (let i = 0; i < tickets.length; i++) {
      await downloadSingleTicket(tickets[i])
      if (i < tickets.length - 1) await new Promise(r => setTimeout(r, 600))
    }
    setDownloading(false)
  }

  // ── Create tickets after payment confirmed ──────────────────────────────────
  const createTickets = async (txId: string) => {
    setPayState('creating')
    const ticketHolders = TIERS.flatMap(tier =>
      (holders[tier.id] || []).map(h => ({
        holderName:  `${h.firstName.trim()} ${h.lastName.trim()}`,
        holderPhone: h.phone.trim(),
        holderEmail: h.email.trim().toLowerCase(),
        ticketType:  tier.id,
      }))
    )
    const res  = await fetch('/api/tickets/create', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactionRequestId: txId, tickets: ticketHolders }),
    })
    const data = await res.json()
    if (res.ok && data.tickets?.length > 0) {
      setTickets(data.tickets)
      setPayState('done')
    } else {
      setError(data.error ?? 'Ticket creation failed. Contact mombasayouthcouncil@gmail.com')
      setPayState('error')
    }
  }

  // ── Poll MegaPay status ─────────────────────────────────────────────────────
  const startPolling = (id: string) => {
    attemptsRef.current = 0
    setCountdown(60)
    timerRef.current = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000)
    pollRef.current  = setInterval(async () => {
      attemptsRef.current++
      if (attemptsRef.current > 20) { stopPolling(); setPayState('timeout'); return }
      try {
        const res  = await fetch('/api/pay/status', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transactionRequestId: id }),
        })
        const d = await res.json()
        const code   = String(d.ResultCode        ?? d.result_code        ?? '')
        const status = String(d.TransactionStatus ?? d.transaction_status ?? '').toLowerCase()
        if (code === '0' || status === 'completed')        { stopPolling(); await createTickets(id) }
        else if (code === '1032' || status === 'cancelled') { stopPolling(); setPayState('cancelled') }
      } catch { /* keep polling */ }
    }, 3000)
  }

  // ── Initiate payment ────────────────────────────────────────────────────────
  const handlePay = async () => {
    if (totalTickets === 0) { setError('Select at least one ticket.'); return }
    if (!payerPhone.trim()) { setError('Enter your M-Pesa phone number.'); return }
    for (const tier of TIERS) {
      for (let i = 0; i < (holders[tier.id] || []).length; i++) {
        const h = holders[tier.id][i]
        const label = `${tier.name} Ticket ${i + 1}`
        if (!h.firstName.trim() || !h.lastName.trim()) { setError(`Enter first and last name for ${label}.`); return }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(h.email)) { setError(`Enter a valid email for ${label}.`); return }
        if (!h.phone.trim()) { setError(`Enter a phone number for ${label}.`); return }
      }
    }
    setError('')
    setPayState('initiating')
    const amount = customAmount ? Number(customAmount) : total
    const res  = await fetch('/api/pay/initiate', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: payerPhone, amount, reference: `TKT-${Date.now()}` }),
    })
    const data = await res.json()
    if (!res.ok || !data.transactionRequestId) {
      setError(data.error ?? 'Could not reach MegaPay. Try again.')
      setPayState('form'); return
    }
    setPayState('waiting')
    startPolling(data.transactionRequestId)
  }

  const reset = () => { stopPolling(); setPayState('form'); setError('') }

  // ════════════════════════════════════════════════════════════════════════════
  // SCREENS
  // ════════════════════════════════════════════════════════════════════════════

  /* ── Waiting / Initiating / Creating ────────────────────────── */
  if (payState === 'waiting' || payState === 'initiating' || payState === 'creating') {
    return (
      <div className="min-h-screen bg-[#0f2419] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm text-center">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <span className="absolute inset-0 rounded-full animate-ping bg-[#c9a84c] opacity-20" />
            <span className="absolute inset-2 rounded-full animate-ping bg-[#c9a84c] opacity-15" style={{ animationDelay: '0.3s' }} />
            <div className="relative w-24 h-24 bg-[#c9a84c] rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-[#0f2419]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-black text-white mb-2">
            {payState === 'initiating' ? 'Sending request…'
              : payState === 'creating' ? `Generating ${totalTickets} ticket${totalTickets > 1 ? 's' : ''}…`
              : 'Check your phone'}
          </h2>
          {payState === 'waiting' && (
            <>
              <p className="text-white/60 mb-1">M-Pesa PIN prompt sent to</p>
              <p className="text-[#c9a84c] font-black text-lg mb-5">{payerPhone}</p>
              <div className="bg-[#1a4731] rounded-2xl p-4 mb-5 text-left space-y-2">
                {TIERS.filter(t => (quantities[t.id] ?? 0) > 0).map(t => (
                  <div key={t.id} className="flex justify-between text-sm">
                    <span className="text-white/60">{t.name} ×{quantities[t.id]}</span>
                    <span className="text-white font-bold">KSH {((quantities[t.id] ?? 0) * t.price).toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm pt-2 border-t border-white/10">
                  <span className="text-white/60 font-semibold">Total</span>
                  <span className="text-[#c9a84c] font-black">KSH {total.toLocaleString()}</span>
                </div>
              </div>
              <p className="text-white/40 text-sm mb-6">
                Enter your PIN. Expires in <span className="text-white font-bold">{countdown}s</span>
              </p>
              <button onClick={reset} className="text-white/40 text-sm underline hover:text-white/60">Cancel</button>
            </>
          )}
        </div>
      </div>
    )
  }

  /* ── Success — multiple ticket cards ───────────────────────── */
  if (payState === 'done' && tickets.length > 0) {
    return (
      <div className="min-h-screen bg-[#0b1e12] py-10 px-4">
        <div className="max-w-md mx-auto">

          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-white">Payment Confirmed!</h1>
            <p className="text-white/50 text-sm mt-1">
              {allQrsReady
                ? `${tickets.length} ticket${tickets.length > 1 ? 's are' : ' is'} downloading…`
                : 'Generating your tickets…'}
            </p>
          </div>

          <div className="space-y-6 mb-8">
            {tickets.map(t => {
              const badge = TIER_BADGE[t.ticketType] ?? { bg: '#e2e8f0', color: '#1a1a1a' }
              const label = TIERS.find(x => x.id === t.ticketType)?.name ?? t.ticketType
              const qr    = qrDataUrls[t.ticketCode]
              return (
                <div key={t.ticketCode}>
                  {/* ══ TICKET CARD — captured by html2canvas ══ */}
                  <div
                    id={`tc-${t.ticketCode}`}
                    style={{
                      backgroundColor: '#0f2419',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: '2px solid #c9a84c',
                      fontFamily: 'system-ui, -apple-system, Arial, sans-serif',
                    }}
                  >
                    <div style={{ height: '6px', background: 'linear-gradient(90deg,#6b4c0f,#c9a84c,#f5d87e,#c9a84c,#6b4c0f)' }} />

                    <div style={{ padding: '18px 20px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(201,168,76,0.25)' }}>
                      <div>
                        <div style={{ color: '#c9a84c', fontSize: '9px', fontWeight: '800', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '6px' }}>✦ Official Ticket ✦</div>
                        <div style={{ color: 'white', fontSize: '16px', fontWeight: '900', lineHeight: 1.1 }}>Mombasa Youth</div>
                        <div style={{ color: 'white', fontSize: '16px', fontWeight: '900', lineHeight: 1.1 }}>Innovation Festival</div>
                        <div style={{ color: '#c9a84c', fontSize: '19px', fontWeight: '900' }}>2026</div>
                        <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '10px', marginTop: '3px', fontStyle: 'italic' }}>Gala Dinner and Awards</div>
                      </div>
                      <div style={{ textAlign: 'center', flexShrink: 0 }}>
                        <div style={{ backgroundColor: badge.bg, color: badge.color, padding: '8px 14px', borderRadius: '8px', fontWeight: '900', fontSize: '13px', letterSpacing: '2px' }}>
                          {label.toUpperCase()}
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', marginTop: '5px' }}>ADMIT ONE</div>
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#ffffff', padding: '16px 20px' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {([
                            { label: 'Holder', value: t.holderName,                         size: '14px', weight: '900', color: '#111827' },
                            { label: 'Date',   value: '11 July 2026',                        size: '12px', weight: '700', color: '#374151' },
                            { label: 'Time',   value: '6:00 PM',                             size: '12px', weight: '700', color: '#374151' },
                            { label: 'Paid',   value: `KSH ${t.totalPaid.toLocaleString()}`, size: '12px', weight: '900', color: '#0f2419' },
                            { label: 'M-Pesa', value: t.mpesaReceipt,                        size: '11px', weight: '700', color: '#374151', mono: true },
                          ] as { label: string; value: string; size: string; weight: string; color: string; mono?: boolean }[]).map(row => (
                            <div key={row.label} style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '7px' }}>
                              <span style={{ color: '#9ca3af', fontSize: '8px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', minWidth: '44px', flexShrink: 0 }}>{row.label}</span>
                              <span style={{ color: row.color, fontSize: row.size, fontWeight: row.weight, fontFamily: row.mono ? 'monospace' : 'inherit', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.value}</span>
                            </div>
                          ))}
                        </div>
                        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                          {qr
                            ? <img src={qr} width={88} height={88} alt="QR" style={{ display: 'block', borderRadius: '6px', border: '2px solid #e5e7eb' }} /> // eslint-disable-line @next/next/no-img-element
                            : (
                              <div style={{ width: '88px', height: '88px', borderRadius: '6px', border: '2px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }}>
                                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                              </div>
                            )
                          }
                          <span style={{ color: '#9ca3af', fontSize: '8px' }}>Scan to verify</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ borderTop: '2px dashed rgba(201,168,76,0.4)', padding: '16px 20px', textAlign: 'center' }}>
                      <div style={{ color: 'rgba(201,168,76,0.6)', fontSize: '8px', fontWeight: '800', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '8px' }}>Ticket No.</div>
                      <div style={{ color: '#c9a84c', fontSize: '24px', fontWeight: '900', fontFamily: 'monospace', letterSpacing: '4px', textShadow: '0 0 24px rgba(201,168,76,0.4)' }}>{t.ticketCode}</div>
                    </div>

                    <div style={{ backgroundColor: '#1a4731', padding: '8px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '9px' }}>Mombasa Youth Council</span>
                      <span style={{ color: '#c9a84c', fontSize: '9px', fontWeight: '700' }}>mombasayouthcouncil@gmail.com</span>
                    </div>
                    <div style={{ height: '6px', background: 'linear-gradient(90deg,#6b4c0f,#c9a84c,#f5d87e,#c9a84c,#6b4c0f)' }} />
                  </div>

                  <button
                    onClick={() => downloadSingleTicket(t)}
                    className="mt-2 w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: 'rgba(201,168,76,0.15)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.3)' }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download {t.holderName.split(' ')[0]}&apos;s Ticket
                  </button>
                </div>
              )
            })}
          </div>

          {tickets.length > 1 && (
            <button
              onClick={downloadAll}
              disabled={downloading || !allQrsReady}
              className="w-full py-4 rounded-xl font-black text-sm flex items-center justify-center gap-3 mb-4 hover:opacity-90 disabled:opacity-50 transition-opacity"
              style={{ backgroundColor: '#c9a84c', color: '#0f2419' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {downloading ? 'Downloading…' : !allQrsReady ? 'Preparing…' : `Download All ${tickets.length} Tickets`}
            </button>
          )}

          <p className="text-center text-white/30 text-xs mt-4">
            Questions? <a href="mailto:mombasayouthcouncil@gmail.com" className="text-[#c9a84c] underline">mombasayouthcouncil@gmail.com</a>
          </p>
          <div className="text-center mt-3">
            <Link href="/" className="text-white/25 text-xs hover:text-white/50 transition-colors">Back to Homepage</Link>
          </div>
        </div>
      </div>
    )
  }

  /* ── Error / Timeout / Cancelled ───────────────────────────── */
  if (payState === 'timeout' || payState === 'cancelled' || payState === 'error') {
    const info = {
      timeout:   { icon: '⏱', title: 'Payment timed out',    msg: 'No PIN was entered in time. Please try again.' },
      cancelled: { icon: '✕',  title: 'Payment cancelled',    msg: 'You cancelled the M-Pesa prompt. Try again when ready.' },
      error:     { icon: '!',  title: 'Something went wrong', msg: error || 'An error occurred. Please try again.' },
    }[payState]
    return (
      <div className="min-h-screen bg-[#0f2419] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm text-center">
          <div className="w-20 h-20 bg-red-500/20 border-2 border-red-500/40 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">{info.icon}</div>
          <h2 className="text-2xl font-black text-white mb-3">{info.title}</h2>
          <p className="text-white/50 mb-8">{info.msg}</p>
          <button onClick={reset} className="px-8 py-3 rounded-xl font-black text-sm hover:opacity-90" style={{ backgroundColor: '#c9a84c', color: '#0f2419' }}>Try Again</button>
        </div>
      </div>
    )
  }

  // ════════════════════════════════════════════════════════════════════════════
  // MAIN FORM — TicketRaha style
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>

      {/* Event flyer */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/myif2026-flyer.jpeg"
        alt="MYIF 2026 — Gala Dinner & Awards"
        className="w-full block object-cover object-top"
        style={{ maxHeight: '520px' }}
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
      />

      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Organizer */}
        <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>
          By Mombasa Youth Council
        </p>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-black mb-1" style={{ color: 'var(--text)' }}>
          Mombasa Youth Innovation Festival 2026
        </h1>
        <p className="text-lg font-bold mb-5" style={{ color: 'var(--text-muted)' }}>Gala Dinner and Awards</p>

        {/* Date / venue chips */}
        <div className="flex flex-wrap gap-3 mb-8">
          {['📅 11th July 2026', '🕕 6:00 PM', '📍 Venue to be communicated'].map(chip => (
            <span
              key={chip}
              className="inline-flex items-center text-sm font-semibold px-3 py-1.5 rounded-full border"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
            >
              {chip}
            </span>
          ))}
        </div>

        <hr style={{ borderColor: 'var(--border)' }} className="mb-8" />

        {/* About */}
        <div className="mb-8">
          <h2 className="text-xl font-black mb-3" style={{ color: 'var(--text)' }}>About this event</h2>
          <p className="leading-relaxed mb-3" style={{ color: 'var(--text-muted)' }}>
            Join us for the{' '}
            <strong style={{ color: 'var(--text)' }}>
              Mombasa Youth Innovation Festival 2026 Gala Dinner and Awards Night
            </strong>{' '}
            — an exclusive evening celebrating youth excellence, innovation, and leadership across Mombasa County.
          </p>
          <p className="leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
            Theme:{' '}
            <strong style={{ color: 'var(--text)' }}>
              Youths at the Center of Mombasa&apos;s Creative Economy
            </strong>
          </p>
          <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-alt)', border: '1px solid var(--border)' }}>
            <p className="font-bold mb-2" style={{ color: 'var(--text)' }}>
              Dress Code — Glamorous African Formal / Corporate Elegance
            </p>
            <ul className="text-sm space-y-1" style={{ color: 'var(--text-muted)' }}>
              <li><strong style={{ color: 'var(--text)' }}>Gentlemen:</strong> Suits, blazers, tuxedos, or elegant African formal attire</li>
              <li><strong style={{ color: 'var(--text)' }}>Ladies:</strong> Evening gowns, cocktail dresses, or African-inspired formal wear</li>
              <li><strong style={{ color: 'var(--text)' }}>Colours:</strong> Gold, Navy Blue, Black, White, Emerald Green</li>
            </ul>
          </div>
        </div>

        <hr style={{ borderColor: 'var(--border)' }} className="mb-8" />

        {/* ══ TICKET SELECTION ══ */}
        <h2 className="text-xl font-black mb-1" style={{ color: 'var(--text)' }}>Tickets</h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
          Select ticket types and quantity, then fill in each ticket holder&apos;s details.
        </p>

        <div className="space-y-4 mb-3">
          {TIERS.map(tier => {
            const tierQty     = quantities[tier.id] ?? 0
            const tierHolders = holders[tier.id] ?? []
            return (
              <div key={tier.id} className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>

                {/* Tier row */}
                <div
                  className="flex items-center justify-between px-5 py-4"
                  style={{ backgroundColor: 'var(--bg-card)' }}
                >
                  <div>
                    <p className="font-black" style={{ color: 'var(--text)' }}>
                      {tier.name}{' '}
                      <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
                        — KES {tier.price.toLocaleString()}
                      </span>
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{tier.desc}</p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <label className="block text-xs font-semibold mb-1 text-right" style={{ color: 'var(--text-muted)' }}>Qty</label>
                    <select
                      value={tierQty}
                      onChange={e => handleQtyChange(tier.id, Number(e.target.value))}
                      className="border rounded-lg px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#c9a84c] w-20 text-center"
                      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--text)' }}
                    >
                      {Array.from({ length: 11 }, (_, i) => (
                        <option key={i} value={i}>{i}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Holder forms for this tier */}
                {tierHolders.map((holder, idx) => (
                  <div
                    key={idx}
                    className="px-5 py-4 border-t"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-alt)' }}
                  >
                    <h4 className="font-black text-sm mb-3" style={{ color: 'var(--text)' }}>
                      {tier.name} — Ticket Holder {idx + 1}
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {(
                        [
                          { field: 'firstName', label: 'First Name *',    type: 'text',  placeholder: 'First name' },
                          { field: 'lastName',  label: 'Last Name *',     type: 'text',  placeholder: 'Last name' },
                          { field: 'email',     label: 'Email *',         type: 'email', placeholder: 'email@example.com' },
                          { field: 'phone',     label: 'Phone Number *',  type: 'tel',   placeholder: '07XX XXX XXX' },
                        ] as { field: keyof HolderForm; label: string; type: string; placeholder: string }[]
                      ).map(({ field, label, type, placeholder }) => (
                        <div key={field}>
                          <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>{label}</label>
                          <input
                            type={type}
                            value={holder[field]}
                            onChange={e => handleHolderChange(tier.id, idx, field, e.target.value)}
                            placeholder={placeholder}
                            className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
                            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-card)', color: 'var(--text)' }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
        </div>

        {/* Apply first holder to all — only when > 1 ticket total */}
        {totalTickets > 1 && (
          <div className="flex items-center gap-3 py-3 px-1 mb-6">
            <input
              type="checkbox"
              id="applyAll"
              className="w-4 h-4 rounded accent-[#c9a84c]"
              onChange={e => {
                if (e.target.checked) {
                  applyFirstToAll()
                  e.target.checked = false
                }
              }}
            />
            <label
              htmlFor="applyAll"
              className="text-sm font-semibold cursor-pointer select-none"
              style={{ color: 'var(--text-muted)' }}
            >
              Apply first ticket holder&apos;s details to all tickets
            </label>
          </div>
        )}

        <hr style={{ borderColor: 'var(--border)' }} className="mb-6" />

        {/* ══ PAYMENT SECTION ══ */}
        <div className="space-y-4">

          {/* Payer phone */}
          <div>
            <label className="block text-sm font-bold mb-1.5" style={{ color: 'var(--text)' }}>
              M-Pesa Phone Number *
            </label>
            <input
              type="tel"
              value={payerPhone}
              onChange={e => setPayerPhone(e.target.value)}
              placeholder="07XX XXX XXX"
              className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--text)' }}
            />
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              This number will receive the M-Pesa PIN prompt for the total payment.
            </p>
          </div>

          {/* Test amount override */}
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Other Amount (testing only)
            </label>
            <input
              type="number"
              min="1"
              value={customAmount}
              onChange={e => setCustomAmount(e.target.value)}
              placeholder={`Leave blank — KES ${total.toLocaleString()}`}
              className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--text)' }}
            />
          </div>

          {/* Order summary */}
          {totalTickets > 0 && (
            <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-alt)', border: '1px solid var(--border)' }}>
              {TIERS.filter(t => (quantities[t.id] ?? 0) > 0).map(t => (
                <div key={t.id} className="flex justify-between text-sm mb-1.5">
                  <span style={{ color: 'var(--text-muted)' }}>{t.name} ×{quantities[t.id]}</span>
                  <span className="font-bold" style={{ color: 'var(--text)' }}>
                    KES {((quantities[t.id] ?? 0) * t.price).toLocaleString()}
                  </span>
                </div>
              ))}
              <div
                className="flex justify-between text-sm pt-2 mt-2 border-t font-black"
                style={{ borderColor: 'var(--border)' }}
              >
                <span style={{ color: 'var(--text)' }}>
                  Total ({totalTickets} ticket{totalTickets > 1 ? 's' : ''})
                </span>
                <span style={{ color: '#c9a84c' }}>
                  KES {(customAmount ? Number(customAmount) : total).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
          )}

          <button
            onClick={handlePay}
            disabled={!totalTickets}
            className="w-full py-4 font-black rounded-xl text-sm hover:opacity-90 disabled:opacity-40 transition-all"
            style={{ backgroundColor: '#0f2419', color: 'white' }}
          >
            {totalTickets
              ? `Get ${totalTickets} Ticket${totalTickets > 1 ? 's' : ''} — Pay KES ${(customAmount ? Number(customAmount) : total).toLocaleString()} via M-Pesa`
              : 'Select tickets to continue'}
          </button>

          {totalTickets > 0 && (
            <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
              You will receive an M-Pesa PIN prompt. Enter your PIN to pay — each ticket is generated and downloaded instantly.
            </p>
          )}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Need help?</p>
          <a href="mailto:mombasayouthcouncil@gmail.com" className="font-semibold hover:underline text-sm" style={{ color: '#c9a84c' }}>
            mombasayouthcouncil@gmail.com
          </a>
        </div>
        <div className="text-center mt-4">
          <Link href="/" className="text-xs hover:underline" style={{ color: 'var(--text-muted)' }}>
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
