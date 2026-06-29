'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const TICKETS = [
  { id: 'regular', name: 'Regular', price: 500,  tagline: 'Access. Connect. Inspire.',   perks: ['Full festival access', 'Networking sessions', 'Gala dinner entry'] },
  { id: 'vip',     name: 'VIP',     price: 1000, tagline: 'Engage. Network. Elevate.',   perks: ['All Regular benefits', 'Priority seating', 'VIP lounge access', 'Front-row awards ceremony'] },
  { id: 'vvip',    name: 'VVIP',    price: 2000, tagline: 'Exclusive. Premium. Impact.', perks: ['All VIP benefits', 'Premium table placement', 'Meet & greet with speakers', 'Exclusive gift pack'] },
]

const WA_PHONE = '254791625444'

type PayState = 'form' | 'initiating' | 'waiting' | 'success' | 'timeout' | 'cancelled' | 'error'

function buildWhatsAppMessage(f: { name: string; phone: string; email: string; ticket: string; qty: number; total: number; receipt: string }) {
  return (
    `🎟 *MYIF 2026 Ticket Booking*\n` +
    `━━━━━━━━━━━━━━━━━━━━━\n` +
    `*Name:* ${f.name}\n` +
    `*Phone:* ${f.phone}\n` +
    `*Email:* ${f.email}\n` +
    `*Ticket:* ${f.ticket} × ${f.qty} — KSH ${f.total.toLocaleString()}\n` +
    `*M-Pesa Receipt:* ${f.receipt}\n` +
    `━━━━━━━━━━━━━━━━━━━━━\n` +
    `_Mombasa Youth Innovation Festival 2026_\n` +
    `_Gala Dinner & Awards · 11th July 2026, 6:00 PM_`
  )
}

export default function TicketsPage() {
  const [ticketId, setTicketId]   = useState('regular')
  const [qty, setQty]             = useState(1)
  const [form, setForm]           = useState({ name: '', phone: '', email: '' })
  const [payState, setPayState]   = useState<PayState>('form')
  const [error, setError]         = useState('')
  const [txId, setTxId]           = useState('')
  const [receipt, setReceipt]     = useState('')
  const [countdown, setCountdown] = useState(60)

  const pollRef      = useRef<ReturnType<typeof setInterval> | null>(null)
  const timerRef     = useRef<ReturnType<typeof setInterval> | null>(null)
  const attemptsRef  = useRef(0)

  const ticket = TICKETS.find((t) => t.id === ticketId)!
  const total  = ticket.price * qty

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const stopPolling = () => {
    if (pollRef.current)  clearInterval(pollRef.current)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  useEffect(() => () => stopPolling(), [])

  const startPolling = (id: string) => {
    attemptsRef.current = 0
    setCountdown(60)

    timerRef.current = setInterval(() => {
      setCountdown((c) => Math.max(0, c - 1))
    }, 1000)

    pollRef.current = setInterval(async () => {
      attemptsRef.current++
      if (attemptsRef.current > 20) {
        stopPolling()
        setPayState('timeout')
        return
      }

      try {
        const res  = await fetch('/api/pay/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transactionRequestId: id }),
        })
        const data = await res.json()

        const code   = String(data.ResultCode ?? data.result_code ?? '')
        const status = String(data.TransactionStatus ?? data.transaction_status ?? '').toLowerCase()

        if (code === '0' || status === 'completed') {
          stopPolling()
          const ref = data.TransactionReceipt ?? data.receipt ?? 'N/A'
          setReceipt(ref)
          setPayState('success')
        } else if (code === '1032' || status === 'cancelled') {
          stopPolling()
          setPayState('cancelled')
        }
        // pending → keep polling
      } catch { /* network hiccup — keep trying */ }
    }, 3000)
  }

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim())                                { setError('Enter your full name.'); return }
    if (!form.phone.trim())                               { setError('Enter your M-Pesa phone number.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError('Enter a valid email address.'); return }

    setError('')
    setPayState('initiating')

    const res  = await fetch('/api/pay/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone:     form.phone,
        amount:    total,
        reference: `TKT-${Date.now()}`,
      }),
    })
    const data = await res.json()

    if (!res.ok || !data.transactionRequestId) {
      setError(data.error ?? 'Could not reach MegaPay. Try again.')
      setPayState('form')
      return
    }

    setTxId(data.transactionRequestId)
    setPayState('waiting')
    startPolling(data.transactionRequestId)
  }

  const reset = () => {
    stopPolling()
    setPayState('form')
    setError('')
    setTxId('')
    setReceipt('')
  }

  const waMessage = buildWhatsAppMessage({
    name:   form.name.trim(),
    phone:  form.phone.trim(),
    email:  form.email.trim(),
    ticket: ticket.name,
    qty,
    total,
    receipt,
  })

  /* ─── Waiting screen ─────────────────────────────────────────── */
  if (payState === 'waiting' || payState === 'initiating') {
    return (
      <div className="min-h-screen bg-[#0f2419] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm text-center">
          {/* Pulse ring */}
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
            {payState === 'initiating' ? 'Sending request…' : 'Check your phone'}
          </h2>
          <p className="text-white/60 mb-2">
            {payState === 'initiating'
              ? 'Contacting MegaPay…'
              : `An M-Pesa PIN prompt has been sent to`}
          </p>
          {payState === 'waiting' && (
            <p className="text-[#c9a84c] font-black text-lg mb-6">{form.phone}</p>
          )}

          <div className="bg-[#1a4731] rounded-2xl p-5 mb-6 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Ticket</span>
              <span className="text-white font-bold">{ticket.name} × {qty}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Amount</span>
              <span className="text-[#c9a84c] font-black">KSH {total.toLocaleString()}</span>
            </div>
          </div>

          {payState === 'waiting' && (
            <>
              <p className="text-white/40 text-sm mb-6">
                Enter your M-Pesa PIN on your phone to complete payment.
                <br />Expires in <span className="text-white font-bold">{countdown}s</span>
              </p>
              <button onClick={reset} className="text-white/40 text-sm hover:text-white/70 transition-colors underline">
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  /* ─── Success screen ─────────────────────────────────────────── */
  if (payState === 'success') {
    return (
      <div className="min-h-screen bg-[#0f2419] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-[#25D366] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-black text-white mb-1">Payment Confirmed!</h1>
            <p className="text-white/50 text-sm">KSH {total.toLocaleString()} received via M-Pesa</p>
          </div>

          <div className="bg-white/10 rounded-xl p-5 mb-5 space-y-2.5">
            {[
              { label: 'Name',         value: form.name },
              { label: 'Phone',        value: form.phone },
              { label: 'Email',        value: form.email },
              { label: 'Ticket',       value: `${ticket.name} × ${qty} — KSH ${total.toLocaleString()}`, gold: true },
              { label: 'M-Pesa Ref',   value: receipt, mono: true },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center gap-4">
                <span className="text-white/50 text-sm flex-shrink-0">{row.label}</span>
                <span className={`text-sm text-right break-all ${row.gold ? 'text-[#c9a84c] font-black' : row.mono ? 'font-mono font-bold text-white tracking-wider' : 'text-white font-semibold'}`}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          <p className="text-white/50 text-xs text-center mb-4">
            Send the booking details below to WhatsApp to receive your confirmation.
          </p>

          <a
            href={`https://wa.me/${WA_PHONE}?text=${encodeURIComponent(waMessage)}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 rounded-xl font-black text-sm mb-4 transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#25D366', color: 'white' }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Send Booking to WhatsApp
          </a>

          <p className="text-center text-white/30 text-xs mb-3">
            Questions? <a href="mailto:mombasayouthcouncil@gmail.com" className="text-[#c9a84c] underline">mombasayouthcouncil@gmail.com</a>
          </p>
          <div className="text-center">
            <Link href="/" className="text-white/25 text-xs hover:text-white/50 transition-colors">← Back to Homepage</Link>
          </div>
        </div>
      </div>
    )
  }

  /* ─── Timeout / Cancelled / Error screens ────────────────────── */
  if (payState === 'timeout' || payState === 'cancelled' || payState === 'error') {
    const info = {
      timeout:   { icon: '⏱', title: 'Payment timed out',  msg: 'No PIN was entered in time. You can try again.' },
      cancelled: { icon: '✕',  title: 'Payment cancelled',  msg: 'You cancelled the M-Pesa PIN prompt. Try again when ready.' },
      error:     { icon: '!',  title: 'Something went wrong', msg: 'An unexpected error occurred. Please try again.' },
    }[payState]

    return (
      <div className="min-h-screen bg-[#0f2419] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm text-center">
          <div className="w-20 h-20 bg-red-500/20 border-2 border-red-500/40 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
            {info.icon}
          </div>
          <h2 className="text-2xl font-black text-white mb-3">{info.title}</h2>
          <p className="text-white/50 mb-8">{info.msg}</p>
          <button
            onClick={reset}
            className="px-8 py-3 rounded-xl font-black text-sm hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#c9a84c', color: '#0f2419' }}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  /* ─── Main form ──────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#0f2419]">

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />
        <div className="max-w-4xl mx-auto px-4 py-14 text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-px h-6 bg-[#c9a84c]" />
            <span className="text-[#c9a84c] text-xs font-bold tracking-[0.3em] uppercase">Mombasa Youth Council presents</span>
            <div className="w-px h-6 bg-[#c9a84c]" />
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight">Mombasa Youth</h1>
          <h2 className="text-4xl sm:text-6xl font-black text-white leading-tight mb-1">Innovation Festival</h2>
          <h3 className="text-3xl sm:text-5xl font-black text-[#c9a84c] italic mb-6">2026</h3>
          <div className="inline-flex flex-wrap justify-center gap-4 sm:gap-6 bg-[#1a4731] rounded-2xl px-6 sm:px-8 py-5 mb-4">
            {[
              { icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', text: '11th July 2026' },
              { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', text: '6:00 PM' },
            ].map((i) => (
              <div key={i.text} className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#c9a84c] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={i.icon} />
                </svg>
                <span className="text-white font-bold text-sm sm:text-base">{i.text}</span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#c9a84c] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-white/60 italic text-sm">Venue to be announced</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="inline-block bg-[#c9a84c] text-[#0f2419] text-xs font-black px-4 py-1.5 rounded-full tracking-wide uppercase">
              Gala Dinner &amp; Awards · Celebrating Youth. Honouring Excellence.
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-20">

        {/* Dress code */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10">
          <h3 className="text-[#c9a84c] font-black text-sm uppercase tracking-widest mb-4 text-center">Dress Code</h3>
          <p className="text-white text-center font-bold mb-5">Glamorous African Formal / Corporate Elegance</p>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            {[
              { title: 'Gentlemen', desc: 'Suits, blazers, tuxedos, or elegant African formal attire' },
              { title: 'Ladies',    desc: 'Evening gowns, cocktail dresses, or African-inspired formal wear' },
              { title: 'Colours',   desc: 'Gold, Navy Blue, Black, White, Emerald Green' },
            ].map((d) => (
              <div key={d.title} className="bg-white/5 rounded-xl p-4">
                <p className="text-[#c9a84c] font-bold mb-1">{d.title}</p>
                <p className="text-white/70">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ticket tier cards */}
        <h2 className="text-white text-2xl font-black text-center mb-2">Choose Your Ticket</h2>
        <p className="text-white/50 text-center text-sm mb-6">Click a tier to select it, then fill in your details below</p>
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {TICKETS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTicketId(t.id)}
              className={`text-left rounded-2xl border-2 p-5 transition-all ${
                ticketId === t.id
                  ? t.id === 'vvip' ? 'border-[#c9a84c] ring-2 ring-[#c9a84c]/40 bg-[#c9a84c]/10'
                  : t.id === 'vip'  ? 'border-[#4ade80] ring-2 ring-[#4ade80]/30 bg-[#4ade80]/10'
                  : 'border-white ring-2 ring-white/20 bg-white/10'
                  : 'border-white/10 bg-white/5 hover:border-white/25'
              }`}
            >
              <div className={`inline-block text-xs font-black px-3 py-1 rounded-full mb-3 ${
                t.id === 'vvip' ? 'bg-[#c9a84c] text-[#0f2419]'
                : t.id === 'vip' ? 'bg-[#1a4731] text-white border border-[#4ade80]/40'
                : 'bg-white/20 text-white'
              }`}>{t.name}</div>
              <div className="mb-1">
                <span className="text-white/50 text-xs">KSH</span>
                <span className="text-3xl font-black text-white ml-1">{t.price.toLocaleString()}</span>
              </div>
              <p className="text-white/50 text-xs italic mb-3">{t.tagline}</p>
              <ul className="space-y-1.5">
                {t.perks.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-xs text-white/70">
                    <span className="text-[#c9a84c] mt-0.5 flex-shrink-0">✓</span>{p}
                  </li>
                ))}
              </ul>
              {ticketId === t.id && <div className="mt-3 text-center text-xs font-bold text-[#c9a84c]">Selected ✓</div>}
            </button>
          ))}
        </div>

        {/* Booking form */}
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10" style={{ backgroundColor: 'var(--bg-card)' }}>
          <div className="bg-[#1a4731] px-6 py-5">
            <h2 className="text-white text-xl font-black">Book Your Seat — Pay via M-Pesa</h2>
            <p className="text-white/60 text-sm mt-1">Fill in your details and we will send an M-Pesa PIN prompt to your phone</p>
          </div>

          <div className="p-6 space-y-5">

            {/* Ticket selector + qty */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>Ticket Type</label>
                <select
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  className="w-full border rounded-lg px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--text)' }}
                >
                  {TICKETS.map((t) => (
                    <option key={t.id} value={t.id}>{t.name} — KSH {t.price.toLocaleString()}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>Number of Tickets</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-11 h-11 rounded-lg border-2 text-xl font-black flex items-center justify-center transition-colors hover:border-[#c9a84c] hover:text-[#c9a84c]"
                    style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                  >−</button>
                  <span className="text-2xl font-black w-10 text-center" style={{ color: 'var(--text)' }}>{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.min(10, q + 1))}
                    className="w-11 h-11 rounded-lg border-2 text-xl font-black flex items-center justify-center transition-colors hover:border-[#c9a84c] hover:text-[#c9a84c]"
                    style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                  >+</button>
                  <div className="flex-1 text-right">
                    <span className="text-xs" style={{ color: 'var(--text-light)' }}>Total</span>
                    <div className="text-xl font-black text-[#c9a84c]">KSH {total.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal details */}
            <form onSubmit={handlePay} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>Full Name *</label>
                  <input
                    type="text" name="name" value={form.name} onChange={handleChange}
                    placeholder="Your full name" autoComplete="name"
                    className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--text)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>M-Pesa Phone Number *</label>
                  <input
                    type="tel" name="phone" value={form.phone} onChange={handleChange}
                    placeholder="07XX XXX XXX" autoComplete="tel"
                    className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--text)' }}
                  />
                  <p className="text-xs mt-1" style={{ color: 'var(--text-light)' }}>The PIN prompt will go to this number</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>Email Address *</label>
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="your@email.com" autoComplete="email"
                  className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--text)' }}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>
              )}

              <button
                type="submit"
                className="w-full py-4 font-black rounded-xl transition-all flex flex-col items-center justify-center gap-0.5 hover:opacity-90 active:scale-[0.98]"
                style={{ backgroundColor: '#c9a84c', color: '#0f2419' }}
              >
                <span className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Pay via M-Pesa
                </span>
                <span className="text-xs font-semibold opacity-75">{ticket.name} × {qty} — KSH {total.toLocaleString()}</span>
              </button>

              <p className="text-center text-xs" style={{ color: 'var(--text-light)' }}>
                You will receive an M-Pesa PIN prompt. Enter your PIN to complete payment instantly.
              </p>
            </form>
          </div>
        </div>

        <div className="text-center mt-10">
          <p className="text-white/40 text-sm mb-1">Need help?</p>
          <a href="mailto:mombasayouthcouncil@gmail.com" className="text-[#c9a84c] font-semibold hover:underline text-sm">
            mombasayouthcouncil@gmail.com
          </a>
        </div>
        <div className="text-center mt-6">
          <Link href="/" className="text-white/30 text-xs hover:text-white/60 transition-colors">← Back to MYC Homepage</Link>
        </div>
      </div>
    </div>
  )
}
