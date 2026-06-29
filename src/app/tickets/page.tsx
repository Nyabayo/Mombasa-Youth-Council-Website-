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
  regular: { bg: '#ffffff', color: '#0f2419' },
  vip:     { bg: '#4ade80', color: '#052e16' },
  vvip:    { bg: '#c9a84c', color: '#0f2419' },
}

// ─── Shared input style (works in both light and dark via CSS var overrides) ──
const inputStyle = {
  width: '100%',
  border: '1px solid rgba(201,168,76,0.35)',
  borderRadius: '10px',
  padding: '10px 14px',
  fontSize: '14px',
  outline: 'none',
  backgroundColor: 'rgba(255,255,255,0.06)',
  color: 'inherit',
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

  // ── Quantity change ─────────────────────────────────────────────────────────
  const handleQtyChange = (tierId: string, qty: number) => {
    setQuantities(q => ({ ...q, [tierId]: qty }))
    setHolders(h => {
      const cur = h[tierId] || []
      if (qty > cur.length) return { ...h, [tierId]: [...cur, ...Array.from({ length: qty - cur.length }, emptyHolder)] }
      return { ...h, [tierId]: cur.slice(0, qty) }
    })
  }

  // ── Holder field change ─────────────────────────────────────────────────────
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
      QRCode.toDataURL(url, { width: 220, margin: 1, color: { dark: '#0f2419', light: '#ffffff' } })
        .then(dataUrl => setQrDataUrls(prev => ({ ...prev, [t.ticketCode]: dataUrl })))
        .catch(() => {})
    })
  }, [tickets])

  // ── Auto-download when all QRs ready ───────────────────────────────────────
  const allQrsReady = tickets.length > 0 && tickets.every(t => qrDataUrls[t.ticketCode])
  useEffect(() => {
    if (!allQrsReady || downloadedRef.current) return
    downloadedRef.current = true
    tickets.forEach((t, i) => setTimeout(() => downloadSingleTicket(t), i * 800 + 500))
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
      if (i < tickets.length - 1) await new Promise(r => setTimeout(r, 700))
    }
    setDownloading(false)
  }

  // ── Test download (bypass payment) ─────────────────────────────────────────
  const testDownload = () => {
    setError('')
    const base = TIERS.flatMap(tier =>
      Array.from({ length: quantities[tier.id] ?? 0 }, (_, i) => {
        const h = holders[tier.id]?.[i]
        const code = 'MYIF26-' + Math.random().toString(36).slice(2, 10).toUpperCase()
        return {
          id: `test-${tier.id}-${i}`,
          ticketCode:           code,
          holderName:           (h?.firstName && h?.lastName) ? `${h.firstName.trim()} ${h.lastName.trim()}` : `Test Holder ${i + 1}`,
          holderPhone:          h?.phone || '0700000000',
          holderEmail:          h?.email || 'test@example.com',
          ticketType:           tier.id,
          ticketPrice:          tier.price,
          quantity:             1,
          totalPaid:            tier.price,
          mpesaReceipt:         'TKT0TEST12X',
          transactionRequestId: 'TEST-TX',
          status:               'valid',
          createdAt:            new Date().toISOString(),
        } satisfies Ticket
      })
    )
    const result: Ticket[] = base.length > 0 ? base : [{
      id: 'test-0',
      ticketCode: 'MYIF26-' + Math.random().toString(36).slice(2, 10).toUpperCase(),
      holderName: 'Test Attendee', holderPhone: '0700000000', holderEmail: 'test@example.com',
      ticketType: 'regular', ticketPrice: 500, quantity: 1, totalPaid: 500,
      mpesaReceipt: 'TKT0TEST12X', transactionRequestId: 'TEST-TX', status: 'valid',
      createdAt: new Date().toISOString(),
    }]
    downloadedRef.current = false
    setTickets(result)
    setPayState('done')
  }

  // ── Create tickets after payment ────────────────────────────────────────────
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
      downloadedRef.current = false
      setTickets(data.tickets)
      setPayState('done')
    } else {
      setError(data.error ?? 'Ticket creation failed. Contact mombasayouthcouncil@gmail.com')
      setPayState('error')
    }
  }

  // ── Poll MegaPay ────────────────────────────────────────────────────────────
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
        if (code === '0' || status === 'completed')         { stopPolling(); await createTickets(id) }
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
  // TICKET CARD — landscape 550×200 px (→ 1650×600 at scale 3 = 5.5″×2″)
  // ════════════════════════════════════════════════════════════════════════════
  const TicketCard = ({ t }: { t: Ticket }) => {
    const label = TIERS.find(x => x.id === t.ticketType)?.name ?? t.ticketType
    const qr    = qrDataUrls[t.ticketCode]

    return (
      <div
        id={`tc-${t.ticketCode}`}
        style={{
          width: '550px',
          height: '200px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0f2419',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '2px solid #c9a84c',
          fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        }}
      >
        {/* ── Gold top bar ── */}
        <div style={{ height: '6px', flexShrink: 0, background: 'linear-gradient(90deg,#5c3d08,#c9a84c,#f5d87e,#e8c96a,#c9a84c,#5c3d08)' }} />

        {/* ── Three-column body ── */}
        <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>

          {/* LEFT — event branding */}
          <div style={{
            width: '152px',
            flexShrink: 0,
            backgroundColor: '#0f2419',
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            borderRight: '1px solid rgba(201,168,76,0.25)',
          }}>
            <div style={{ color: '#c9a84c', fontSize: '7px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '7px' }}>
              ✦ Official Ticket ✦
            </div>
            <div style={{ color: '#ffffff', fontSize: '11px', fontWeight: '900', lineHeight: '1.25' }}>
              Mombasa Youth
            </div>
            <div style={{ color: '#ffffff', fontSize: '11px', fontWeight: '900', lineHeight: '1.25', marginBottom: '5px' }}>
              Innovation Festival
            </div>
            <div style={{ color: '#c9a84c', fontSize: '20px', fontWeight: '900', lineHeight: '1.1', marginBottom: '5px' }}>
              2026
            </div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '8px', fontStyle: 'italic', lineHeight: '1.3' }}>
              Gala Dinner &amp; Awards
            </div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px', marginTop: '2px' }}>
              11 July 2026 · 6:00 PM
            </div>
          </div>

          {/* MIDDLE — holder + details */}
          <div style={{
            flex: 1,
            backgroundColor: '#ffffff',
            padding: '12px 16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
            {/* Holder name */}
            <div style={{ marginBottom: '9px', paddingBottom: '9px', borderBottom: '1px solid #d1d5db' }}>
              <div style={{ color: '#374151', fontSize: '7.5px', fontWeight: '800', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '3px' }}>
                Ticket Holder
              </div>
              <div style={{ color: '#0f2419', fontSize: '17px', fontWeight: '900', lineHeight: '1.15', letterSpacing: '-0.2px' }}>
                {t.holderName}
              </div>
            </div>

            {/* Details grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 14px' }}>
              {([
                { label: 'Date',        value: '11 July 2026' },
                { label: 'Time',        value: '6:00 PM'      },
                { label: 'Ticket Type', value: label          },
                { label: 'Amount Paid', value: `KSH ${t.totalPaid.toLocaleString()}` },
              ]).map(row => (
                <div key={row.label}>
                  <div style={{ color: '#374151', fontSize: '7px', fontWeight: '800', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '2px' }}>
                    {row.label}
                  </div>
                  <div style={{ color: '#111827', fontSize: '11.5px', fontWeight: '700', lineHeight: '1.2' }}>
                    {row.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — QR + ticket no. (separated by dashed tear-line) */}
          <div style={{
            width: '152px',
            flexShrink: 0,
            backgroundColor: '#112b1c',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            borderLeft: '2px dashed rgba(201,168,76,0.4)',
          }}>
            {qr ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qr} width={102} height={102} alt="QR"
                style={{ display: 'block', borderRadius: '8px', border: '2px solid rgba(201,168,76,0.55)', backgroundColor: '#fff', padding: '3px' }}
              />
            ) : (
              <div style={{ width: '102px', height: '102px', borderRadius: '8px', border: '2px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.04)' }}>
                <div className="w-5 h-5 border-2 border-white/20 border-t-white/50 rounded-full animate-spin" />
              </div>
            )}
            <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: '6.5px', letterSpacing: '1px', textTransform: 'uppercase', textAlign: 'center' }}>
              Scan to verify
            </div>
            <div style={{ color: '#c9a84c', fontSize: '8.5px', fontWeight: '900', fontFamily: 'monospace', letterSpacing: '1.5px', whiteSpace: 'nowrap', textAlign: 'center' }}>
              {t.ticketCode}
            </div>
          </div>

        </div>

        {/* ── Gold bottom bar ── */}
        <div style={{ height: '6px', flexShrink: 0, background: 'linear-gradient(90deg,#5c3d08,#c9a84c,#f5d87e,#e8c96a,#c9a84c,#5c3d08)' }} />
      </div>
    )
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SCREENS
  // ════════════════════════════════════════════════════════════════════════════

  /* ── Waiting / Initiating / Creating ─────────────────────────────────────── */
  if (payState === 'waiting' || payState === 'initiating' || payState === 'creating') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ backgroundColor: '#061010' }}>
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
              : payState === 'creating' ? `Generating ${totalTickets} ticket${totalTickets !== 1 ? 's' : ''}…`
              : 'Check your phone'}
          </h2>
          {payState === 'waiting' && (
            <>
              <p className="text-white/60 mb-1">M-Pesa PIN prompt sent to</p>
              <p className="text-[#c9a84c] font-black text-lg mb-5">{payerPhone}</p>
              <div className="rounded-2xl p-4 mb-5 text-left space-y-2" style={{ backgroundColor: '#1a4731' }}>
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
                Enter your PIN on your phone. Expires in{' '}
                <span className="text-white font-bold">{countdown}s</span>
              </p>
              <button onClick={reset} className="text-white/40 text-sm underline hover:text-white/60">Cancel</button>
            </>
          )}
        </div>
      </div>
    )
  }

  /* ── Success — all ticket cards ──────────────────────────────────────────── */
  if (payState === 'done' && tickets.length > 0) {
    return (
      <div className="min-h-screen py-10 px-4" style={{ backgroundColor: '#061010' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>

          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-white">
              {tickets[0]?.ticketCode.startsWith('MYIF26-') && tickets[0]?.mpesaReceipt === 'TKT0TEST12X'
                ? 'Test Mode — Tickets Ready'
                : 'Payment Confirmed!'}
            </h1>
            <p className="text-white/50 text-sm mt-1">
              {allQrsReady
                ? `${tickets.length} ticket${tickets.length !== 1 ? 's are' : ' is'} downloading…`
                : 'Generating your tickets…'}
            </p>
          </div>

          <div className="space-y-6 mb-8">
            {tickets.map(t => (
              <div key={t.ticketCode}>
                {/* Scrollable on small screens so the 550px ticket is never clipped */}
                <div style={{ overflowX: 'auto', paddingBottom: '4px' }}>
                  <TicketCard t={t} />
                </div>
                <button
                  onClick={() => downloadSingleTicket(t)}
                  className="mt-3 w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: 'rgba(201,168,76,0.15)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.4)' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download {t.holderName.split(' ')[0]}&apos;s Ticket
                </button>
              </div>
            ))}
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

          <button
            onClick={reset}
            className="w-full py-3 rounded-xl text-sm font-semibold hover:opacity-80 transition-opacity mb-4"
            style={{ backgroundColor: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            ← Book More Tickets
          </button>

          <p className="text-center text-white/30 text-xs">
            Questions?{' '}
            <a href="mailto:mombasayouthcouncil@gmail.com" className="text-[#c9a84c] underline">
              mombasayouthcouncil@gmail.com
            </a>
          </p>
        </div>
      </div>
    )
  }

  /* ── Error / Timeout / Cancelled ─────────────────────────────────────────── */
  if (payState === 'timeout' || payState === 'cancelled' || payState === 'error') {
    const info = {
      timeout:   { icon: '⏱', title: 'Payment timed out',    msg: 'No PIN was entered in time. Please try again.' },
      cancelled: { icon: '✕',  title: 'Payment cancelled',    msg: 'You cancelled the M-Pesa prompt. Try again when ready.' },
      error:     { icon: '!',  title: 'Something went wrong', msg: error || 'An error occurred. Please try again.' },
    }[payState]
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ backgroundColor: '#061010' }}>
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
  // MAIN FORM — always dark green theme (brand consistent, no mode issues)
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div style={{ backgroundColor: '#061010', minHeight: '100vh' }}>

      {/* Event flyer — full image, no cropping */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/myif2026-flyer.jpeg"
        alt="MYIF 2026 — Gala Dinner & Awards"
        style={{ width: '100%', display: 'block', height: 'auto' }}
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
      />

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 20px 80px' }}>

        {/* Organizer */}
        <p style={{ color: 'rgba(201,168,76,0.7)', fontSize: '13px', fontWeight: '600', marginBottom: '8px', letterSpacing: '0.5px' }}>
          By Mombasa Youth Council
        </p>

        {/* Title */}
        <h1 style={{ color: '#ffffff', fontSize: 'clamp(24px, 5vw, 38px)', fontWeight: '900', lineHeight: '1.1', marginBottom: '6px' }}>
          Mombasa Youth Innovation Festival 2026
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '17px', fontWeight: '600', marginBottom: '22px' }}>
          Gala Dinner and Awards
        </p>

        {/* Date / venue chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '32px' }}>
          {['📅 11th July 2026', '🕕 6:00 PM', '📍 Venue to be communicated'].map(chip => (
            <span
              key={chip}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                fontSize: '13px',
                fontWeight: '600',
                padding: '7px 14px',
                borderRadius: '999px',
                border: '1px solid rgba(201,168,76,0.3)',
                color: 'rgba(255,255,255,0.7)',
                backgroundColor: 'rgba(201,168,76,0.08)',
              }}
            >
              {chip}
            </span>
          ))}
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', marginBottom: '32px' }} />

        {/* About */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ color: '#ffffff', fontSize: '19px', fontWeight: '900', marginBottom: '14px' }}>About this event</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.75', marginBottom: '12px', fontSize: '14px' }}>
            Join us for the{' '}
            <strong style={{ color: 'rgba(255,255,255,0.9)' }}>Mombasa Youth Innovation Festival 2026 Gala Dinner and Awards Night</strong>
            {' '}— an exclusive evening celebrating youth excellence, innovation, and leadership across Mombasa County.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.75', marginBottom: '16px', fontSize: '14px' }}>
            Theme: <strong style={{ color: '#c9a84c' }}>Youths at the Center of Mombasa&apos;s Creative Economy</strong>
          </p>
          <div style={{ backgroundColor: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '14px', padding: '18px 20px' }}>
            <p style={{ color: '#c9a84c', fontWeight: '700', marginBottom: '10px', fontSize: '14px' }}>
              Dress Code — Glamorous African Formal / Corporate Elegance
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                ['Gentlemen', 'Suits, blazers, tuxedos, or elegant African formal attire'],
                ['Ladies',    'Evening gowns, cocktail dresses, or African-inspired formal wear'],
                ['Colours',   'Gold, Navy Blue, Black, White, Emerald Green'],
              ].map(([k, v]) => (
                <li key={k} style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px' }}>
                  <strong style={{ color: 'rgba(255,255,255,0.85)' }}>{k}: </strong>{v}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', marginBottom: '32px' }} />

        {/* ══ TICKET SELECTION ══ */}
        <h2 style={{ color: '#ffffff', fontSize: '19px', fontWeight: '900', marginBottom: '6px' }}>Tickets</h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', marginBottom: '20px' }}>
          Select ticket types and quantity, then fill in each ticket holder&apos;s details.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '12px' }}>
          {TIERS.map(tier => {
            const tierQty     = quantities[tier.id] ?? 0
            const tierHolders = holders[tier.id] ?? []
            const badge       = TIER_BADGE[tier.id]
            return (
              <div
                key={tier.id}
                style={{
                  borderRadius: '14px',
                  overflow: 'hidden',
                  border: `1px solid ${tierQty > 0 ? 'rgba(201,168,76,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  backgroundColor: tierQty > 0 ? 'rgba(201,168,76,0.06)' : 'rgba(255,255,255,0.03)',
                  transition: 'border-color 0.2s, background-color 0.2s',
                }}
              >
                {/* Tier row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                    <div style={{ backgroundColor: badge.bg, color: badge.color, padding: '4px 10px', borderRadius: '6px', fontWeight: '900', fontSize: '11px', letterSpacing: '1px', flexShrink: 0 }}>
                      {tier.name.toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ color: '#ffffff', fontWeight: '800', fontSize: '15px', marginBottom: '2px' }}>
                        KES {tier.price.toLocaleString()}
                      </p>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {tier.desc}
                      </p>
                    </div>
                  </div>
                  <div style={{ flexShrink: 0, marginLeft: '16px', textAlign: 'right' }}>
                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: '600', marginBottom: '4px' }}>Qty</label>
                    <select
                      value={tierQty}
                      onChange={e => handleQtyChange(tier.id, Number(e.target.value))}
                      style={{
                        width: '72px',
                        padding: '7px 10px',
                        borderRadius: '8px',
                        border: '1px solid rgba(201,168,76,0.4)',
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        color: '#ffffff',
                        fontSize: '14px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        outline: 'none',
                      }}
                    >
                      {Array.from({ length: 11 }, (_, i) => (
                        <option key={i} value={i} style={{ backgroundColor: '#0f2419', color: '#fff' }}>{i}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Holder forms */}
                {tierHolders.map((holder, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '16px 20px',
                      borderTop: '1px solid rgba(201,168,76,0.15)',
                      backgroundColor: 'rgba(0,0,0,0.2)',
                    }}
                  >
                    <p style={{ color: '#c9a84c', fontSize: '13px', fontWeight: '800', marginBottom: '14px', letterSpacing: '0.3px' }}>
                      {tier.name} — Ticket Holder {idx + 1}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {(
                        [
                          { field: 'firstName', label: 'First Name *',   type: 'text',  placeholder: 'First name' },
                          { field: 'lastName',  label: 'Last Name *',    type: 'text',  placeholder: 'Last name' },
                          { field: 'email',     label: 'Email *',        type: 'email', placeholder: 'email@example.com' },
                          { field: 'phone',     label: 'Phone Number *', type: 'tel',   placeholder: '07XX XXX XXX' },
                        ] as { field: keyof HolderForm; label: string; type: string; placeholder: string }[]
                      ).map(({ field, label, type, placeholder }) => (
                        <div key={field}>
                          <label style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: '11px', fontWeight: '600', marginBottom: '5px' }}>{label}</label>
                          <input
                            type={type}
                            value={holder[field]}
                            onChange={e => handleHolderChange(tier.id, idx, field, e.target.value)}
                            placeholder={placeholder}
                            style={{
                              ...inputStyle,
                              backgroundColor: 'rgba(255,255,255,0.05)',
                              color: '#ffffff',
                              border: '1px solid rgba(201,168,76,0.25)',
                            }}
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

        {/* Apply first holder to all */}
        {totalTickets > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', marginBottom: '20px', borderRadius: '12px', border: '1px solid rgba(201,168,76,0.35)', backgroundColor: 'rgba(201,168,76,0.06)' }}>
            <input
              type="checkbox"
              id="applyAll"
              style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#c9a84c', flexShrink: 0 }}
              onChange={e => { if (e.target.checked) { applyFirstToAll(); setTimeout(() => { e.target.checked = false }, 80) } }}
            />
            <label htmlFor="applyAll" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', fontWeight: '700', cursor: 'pointer', userSelect: 'none', lineHeight: '1.3' }}>
              Apply first ticket holder&apos;s details to all tickets
            </label>
          </div>
        )}

        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', marginBottom: '28px' }} />

        {/* ══ PAYMENT SECTION ══ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Payer phone */}
          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: '700', marginBottom: '7px' }}>
              M-Pesa Phone Number *
            </label>
            <input
              type="tel"
              value={payerPhone}
              onChange={e => setPayerPhone(e.target.value)}
              placeholder="07XX XXX XXX"
              style={{ ...inputStyle, backgroundColor: 'rgba(255,255,255,0.06)', color: '#ffffff', border: '1px solid rgba(201,168,76,0.35)' }}
            />
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', marginTop: '5px' }}>
              This number will receive the M-Pesa PIN prompt for the total payment.
            </p>
          </div>

          {/* Test amount */}
          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '13px', fontWeight: '600', marginBottom: '7px' }}>
              Other Amount (testing only)
            </label>
            <input
              type="number"
              min="1"
              value={customAmount}
              onChange={e => setCustomAmount(e.target.value)}
              placeholder={`Leave blank — KES ${total.toLocaleString()}`}
              style={{ ...inputStyle, backgroundColor: 'rgba(255,255,255,0.04)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>

          {/* Order summary */}
          {totalTickets > 0 && (
            <div style={{ backgroundColor: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', padding: '16px 18px' }}>
              {TIERS.filter(t => (quantities[t.id] ?? 0) > 0).map(t => (
                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.55)' }}>{t.name} ×{quantities[t.id]}</span>
                  <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: '700' }}>KES {((quantities[t.id] ?? 0) * t.price).toLocaleString()}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', marginTop: '8px', borderTop: '1px solid rgba(201,168,76,0.15)', fontSize: '15px', fontWeight: '900' }}>
                <span style={{ color: 'rgba(255,255,255,0.8)' }}>Total ({totalTickets} ticket{totalTickets !== 1 ? 's' : ''})</span>
                <span style={{ color: '#c9a84c' }}>KES {(customAmount ? Number(customAmount) : total).toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ padding: '12px 16px', backgroundColor: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)', borderRadius: '10px', color: '#fca5a5', fontSize: '14px' }}>
              {error}
            </div>
          )}

          {/* Main pay button */}
          <button
            onClick={handlePay}
            disabled={!totalTickets}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: totalTickets ? '#c9a84c' : 'rgba(201,168,76,0.25)',
              color: totalTickets ? '#0f2419' : 'rgba(255,255,255,0.3)',
              fontWeight: '900',
              fontSize: '15px',
              border: 'none',
              cursor: totalTickets ? 'pointer' : 'not-allowed',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => { if (totalTickets) (e.target as HTMLElement).style.opacity = '0.9' }}
            onMouseLeave={e => { (e.target as HTMLElement).style.opacity = '1' }}
          >
            {totalTickets
              ? `Get ${totalTickets} Ticket${totalTickets !== 1 ? 's' : ''} — Pay KES ${(customAmount ? Number(customAmount) : total).toLocaleString()} via M-Pesa`
              : 'Select tickets to continue'}
          </button>

          {/* Test download button */}
          <button
            onClick={testDownload}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '12px',
              backgroundColor: 'transparent',
              color: 'rgba(255,255,255,0.35)',
              fontWeight: '600',
              fontSize: '13px',
              border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer',
              transition: 'color 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => {
              (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.7)'
              ;(e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.25)'
            }}
            onMouseLeave={e => {
              (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.35)'
              ;(e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'
            }}
          >
            ⚙ Test Download (skip payment)
          </button>

          {totalTickets > 0 && (
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>
              You will receive an M-Pesa PIN prompt. Enter your PIN to pay — tickets are generated and downloaded instantly.
            </p>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', marginBottom: '6px' }}>Need help?</p>
          <a href="mailto:mombasayouthcouncil@gmail.com" style={{ color: '#c9a84c', fontWeight: '600', fontSize: '14px', textDecoration: 'none' }}>
            mombasayouthcouncil@gmail.com
          </a>
        </div>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.25)', fontSize: '13px', textDecoration: 'none' }}>
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
