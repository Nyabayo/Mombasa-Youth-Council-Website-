'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import QRCode from 'qrcode'
import type { Ticket } from '@/lib/db'

const TICKETS = [
  { id: 'regular', name: 'Regular', price: 500,  tagline: 'Access. Connect. Inspire.',   perks: ['Full festival access', 'Networking sessions', 'Gala dinner entry'] },
  { id: 'vip',     name: 'VIP',     price: 1000, tagline: 'Engage. Network. Elevate.',   perks: ['All Regular benefits', 'Priority seating', 'VIP lounge access', 'Front-row awards ceremony'] },
  { id: 'vvip',    name: 'VVIP',    price: 2000, tagline: 'Exclusive. Premium. Impact.', perks: ['All VIP benefits', 'Premium table placement', 'Meet & greet with speakers', 'Exclusive gift pack'] },
]

type PayState    = 'form' | 'initiating' | 'waiting' | 'creating' | 'done' | 'timeout' | 'cancelled' | 'error'

const TYPE_COLOR: Record<string, string> = { regular: '#e2e8f0', vip: '#4ade80', vvip: '#c9a84c' }
const TYPE_TEXT:  Record<string, string> = { regular: '#1a1a1a', vip: '#064e3b', vvip: '#0f2419' }

export default function TicketsPage() {
  const [ticketId, setTicketId]   = useState('regular')
  const [qty, setQty]             = useState(1)
  const [form, setForm]           = useState({ name: '', phone: '', email: '' })
  const [payState, setPayState]   = useState<PayState>('form')
  const [error, setError]         = useState('')
  const [ticket, setTicket]       = useState<Ticket | null>(null)
  const [countdown, setCountdown] = useState(60)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [downloading, setDownloading] = useState(false)
  const [customAmount, setCustomAmount] = useState('')

  const pollRef     = useRef<ReturnType<typeof setInterval> | null>(null)
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null)
  const attemptsRef = useRef(0)

  const tier  = TICKETS.find((t) => t.id === ticketId)!
  const total = tier.price * qty

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const stopPolling = () => {
    if (pollRef.current)  clearInterval(pollRef.current)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  useEffect(() => () => stopPolling(), [])

  // Generate QR code then auto-download the ticket image
  useEffect(() => {
    if (!ticket || typeof window === 'undefined') return
    const verifyUrl = `${window.location.origin}/verify/${ticket.ticketCode}`
    QRCode.toDataURL(verifyUrl, {
      width: 220, margin: 1,
      color: { dark: '#0f2419', light: '#ffffff' },
    }).then((url) => {
      setQrDataUrl(url)
      // Give React one frame to render the QR into the card, then auto-download
      requestAnimationFrame(() => {
        setTimeout(() => {
          const el = document.getElementById('ticket-card')
          if (!el) return
          import('html2canvas').then(({ default: html2canvas }) => {
            html2canvas(el, { scale: 2, useCORS: true, allowTaint: false, backgroundColor: null, logging: false })
              .then((canvas) => {
                const link = document.createElement('a')
                link.download = `MYIF2026-${ticket.ticketCode}.png`
                link.href = canvas.toDataURL('image/png')
                link.click()
              })
              .catch(() => {})
          })
        }, 150)
      })
    }).catch(() => {})
  }, [ticket])

  const downloadTicket = async () => {
    const el = document.getElementById('ticket-card')
    if (!el || !ticket) return
    setDownloading(true)
    try {
      const { default: html2canvas } = await import('html2canvas')
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, allowTaint: false, backgroundColor: null, logging: false })
      const link = document.createElement('a')
      link.download = `MYIF2026-${ticket.ticketCode}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch { /* silent */ }
    setDownloading(false)
  }

  const createTicket = async (confirmedTxId: string) => {
    setPayState('creating')
    const res  = await fetch('/api/tickets/create', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim(),
        ticketType: ticketId, qty, transactionRequestId: confirmedTxId,
      }),
    })
    const data = await res.json()
    if (res.ok && data.ticket) {
      const t = data.ticket
      setTicket(t)
      setPayState('done')
    } else {
      setError(data.error ?? 'Ticket creation failed. Contact mombasayouthcouncil@gmail.com')
      setPayState('error')
    }
  }

  const startPolling = (id: string) => {
    attemptsRef.current = 0
    setCountdown(60)
    timerRef.current = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000)
    pollRef.current  = setInterval(async () => {
      attemptsRef.current++
      if (attemptsRef.current > 20) { stopPolling(); setPayState('timeout'); return }
      try {
        const res  = await fetch('/api/pay/status', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transactionRequestId: id }),
        })
        const data = await res.json()
        const code   = String(data.ResultCode        ?? data.result_code          ?? '')
        const status = String(data.TransactionStatus ?? data.transaction_status   ?? '').toLowerCase()
        if (code === '0' || status === 'completed') { stopPolling(); await createTicket(id) }
        else if (code === '1032' || status === 'cancelled') { stopPolling(); setPayState('cancelled') }
      } catch { /* keep polling */ }
    }, 3000)
  }

  const handlePay = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!form.name.trim())                               { setError('Enter your full name.'); return }
    if (!form.phone.trim())                              { setError('Enter your M-Pesa phone number.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError('Enter a valid email address.'); return }
    setError('')
    setPayState('initiating')
    const res  = await fetch('/api/pay/initiate', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: form.phone, amount: customAmount ? Number(customAmount) : total, reference: `TKT-${Date.now()}` }),
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

  /* ─── Waiting / Initiating screen ───────────────────────────── */
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
            {payState === 'initiating' ? 'Sending request...' : payState === 'creating' ? 'Generating your ticket...' : 'Check your phone'}
          </h2>
          {payState === 'waiting' && (
            <>
              <p className="text-white/60 mb-1">M-Pesa PIN prompt sent to</p>
              <p className="text-[#c9a84c] font-black text-lg mb-4">{form.phone}</p>
              <div className="bg-[#1a4731] rounded-2xl p-4 mb-5 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Ticket</span>
                  <span className="text-white font-bold">{tier.name} x{qty}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Amount</span>
                  <span className="text-[#c9a84c] font-black">KSH {total.toLocaleString()}</span>
                </div>
              </div>
              <p className="text-white/40 text-sm mb-6">Enter your PIN on your phone. Expires in <span className="text-white font-bold">{countdown}s</span></p>
              <button onClick={reset} className="text-white/40 text-sm underline hover:text-white/60">Cancel</button>
            </>
          )}
          {payState === 'creating' && (
            <p className="text-white/60 text-sm">Payment confirmed. Creating your unique ticket...</p>
          )}
        </div>
      </div>
    )
  }

  /* ─── Ticket Card (success) ──────────────────────────────────── */
  if (payState === 'done' && ticket) {
    const tierColor = TYPE_COLOR[ticket.ticketType] ?? '#e2e8f0'
    const tierText  = TYPE_TEXT[ticket.ticketType]  ?? '#1a1a1a'
    return (
      <div className="min-h-screen bg-[#0f2419] py-12 px-4">
        <div className="max-w-md mx-auto">

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-white">Your Ticket is Ready</h1>
            <p className="text-white/50 text-sm">{qrDataUrl ? 'Downloading your ticket image...' : 'Generating your ticket...'}</p>
          </div>

          {/* The actual ticket */}
          <div id="ticket-card" className="rounded-2xl overflow-hidden shadow-2xl mb-6">

            {/* Ticket header */}
            <div className="bg-[#0f2419] border-b-4 border-[#c9a84c] px-6 py-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[#c9a84c] text-xs font-bold tracking-widest uppercase mb-0.5">Official Ticket</p>
                  <h2 className="text-white text-xl font-black leading-tight">Mombasa Youth</h2>
                  <h3 className="text-white text-xl font-black leading-tight">Innovation Festival 2026</h3>
                  <p className="text-white/60 text-xs mt-1">Gala Dinner and Awards</p>
                </div>
                {/* Tier badge */}
                <div className="flex-shrink-0 text-right">
                  <span
                    className="inline-block px-3 py-1.5 rounded-lg text-sm font-black"
                    style={{ backgroundColor: tierColor, color: tierText }}
                  >
                    {(tier.name ?? ticket.ticketType).toUpperCase()}
                  </span>
                  <p className="text-white/50 text-xs mt-1">x{ticket.quantity}</p>
                </div>
              </div>
            </div>

            {/* Ticket body */}
            <div className="bg-white px-6 py-5">
              <div className="flex gap-5">
                {/* Left: details */}
                <div className="flex-1 space-y-3 min-w-0">
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wide font-bold">Holder</p>
                    <p className="text-gray-900 font-black text-lg leading-tight truncate">{ticket.holderName}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wide font-bold">Date</p>
                      <p className="text-gray-800 font-bold text-sm">11 July 2026</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wide font-bold">Time</p>
                      <p className="text-gray-800 font-bold text-sm">6:00 PM</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wide font-bold">Amount Paid</p>
                    <p className="text-gray-900 font-black">KSH {ticket.totalPaid.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wide font-bold">M-Pesa Receipt</p>
                    <p className="text-gray-900 font-mono font-bold tracking-wider text-sm">{ticket.mpesaReceipt}</p>
                  </div>
                </div>
                {/* Right: QR */}
                <div className="flex-shrink-0 flex flex-col items-center gap-1">
                  {qrDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={qrDataUrl} alt="Ticket QR Code" width={100} height={100} className="rounded-lg border border-gray-200" />
                  ) : (
                    <div className="w-[100px] h-[100px] rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                    </div>
                  )}
                  <p className="text-gray-400 text-xs text-center">Scan to verify</p>
                </div>
              </div>

              {/* Ticket code */}
              <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-200">
                <p className="text-gray-400 text-xs uppercase tracking-wide font-bold text-center mb-1">Ticket Code</p>
                <p className="text-center font-mono font-black text-xl tracking-widest text-[#0f2419]">{ticket.ticketCode}</p>
              </div>
            </div>

            {/* Ticket footer */}
            <div className="bg-[#1a4731] px-6 py-3 flex items-center justify-between">
              <p className="text-white/60 text-xs">Mombasa Youth Council</p>
              <p className="text-[#c9a84c] text-xs font-bold">mombasayouthcouncil@gmail.com</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            {/* Download as image */}
            <button
              onClick={downloadTicket}
              disabled={downloading || !qrDataUrl}
              className="flex items-center justify-center gap-3 w-full py-4 rounded-xl font-black text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#c9a84c', color: '#0f2419' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {downloading ? 'Saving...' : !qrDataUrl ? 'Preparing download...' : 'Download Ticket Again'}
            </button>


          </div>

          <p className="text-center text-white/30 text-xs mt-6">
            Questions? <a href="mailto:mombasayouthcouncil@gmail.com" className="text-[#c9a84c] underline">mombasayouthcouncil@gmail.com</a>
          </p>
          <div className="text-center mt-3">
            <Link href="/" className="text-white/25 text-xs hover:text-white/50 transition-colors">Back to Homepage</Link>
          </div>
        </div>
      </div>
    )
  }

  /* ─── Timeout / Cancelled / Error ────────────────────────────── */
  if (payState === 'timeout' || payState === 'cancelled' || payState === 'error') {
    const info = {
      timeout:   { icon: '⏱', title: 'Payment timed out',   msg: 'No PIN was entered in time. Please try again.' },
      cancelled: { icon: '✕',  title: 'Payment cancelled',   msg: 'You cancelled the M-Pesa prompt. Try again when ready.' },
      error:     { icon: '!',  title: 'Something went wrong', msg: error || 'An error occurred. Please try again or contact support.' },
    }[payState]

    return (
      <div className="min-h-screen bg-[#0f2419] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm text-center">
          <div className="w-20 h-20 bg-red-500/20 border-2 border-red-500/40 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
            {info.icon}
          </div>
          <h2 className="text-2xl font-black text-white mb-3">{info.title}</h2>
          <p className="text-white/50 mb-8">{info.msg}</p>
          <button onClick={reset} className="px-8 py-3 rounded-xl font-black text-sm hover:opacity-90 transition-opacity" style={{ backgroundColor: '#c9a84c', color: '#0f2419' }}>
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
              Gala Dinner and Awards - Celebrating Youth. Honouring Excellence.
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

        {/* Tier cards */}
        <h2 className="text-white text-2xl font-black text-center mb-2">Choose Your Ticket</h2>
        <p className="text-white/50 text-center text-sm mb-6">Select a tier below, then fill your details to pay</p>
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {TICKETS.map((t) => (
            <button
              key={t.id} type="button" onClick={() => setTicketId(t.id)}
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
            <h2 className="text-white text-xl font-black">Book Your Seat - Pay via M-Pesa</h2>
            <p className="text-white/60 text-sm mt-1">Fill your details and we will send an M-Pesa PIN prompt to your phone instantly</p>
          </div>
          <div className="p-6 space-y-5">

            {/* Selector + qty */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>Ticket Type</label>
                <select value={ticketId} onChange={(e) => setTicketId(e.target.value)}
                  className="w-full border rounded-lg px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--text)' }}>
                  {TICKETS.map((t) => (
                    <option key={t.id} value={t.id}>{t.name} - KSH {t.price.toLocaleString()}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>Number of Tickets</label>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-11 h-11 rounded-lg border-2 text-xl font-black flex items-center justify-center transition-colors hover:border-[#c9a84c] hover:text-[#c9a84c]"
                    style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>-</button>
                  <span className="text-2xl font-black w-10 text-center" style={{ color: 'var(--text)' }}>{qty}</span>
                  <button type="button" onClick={() => setQty((q) => Math.min(10, q + 1))}
                    className="w-11 h-11 rounded-lg border-2 text-xl font-black flex items-center justify-center transition-colors hover:border-[#c9a84c] hover:text-[#c9a84c]"
                    style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>+</button>
                  <div className="flex-1 text-right">
                    <span className="text-xs" style={{ color: 'var(--text-light)' }}>Total</span>
                    <div className="text-xl font-black text-[#c9a84c]">KSH {total.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handlePay} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>Full Name *</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" autoComplete="name"
                    className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--text)' }} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>M-Pesa Phone *</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="07XX XXX XXX" autoComplete="tel"
                    className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--text)' }} />
                  <p className="text-xs mt-1" style={{ color: 'var(--text-light)' }}>PIN prompt will be sent here</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>Email Address *</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" autoComplete="email"
                  className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--text)' }} />
              </div>
              {/* Test amount override */}
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>Other Amount (testing only)</label>
                <input
                  type="number" min="1" value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder={`Leave blank to use KSH ${total.toLocaleString()}`}
                  className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--text)' }}
                />
              </div>

              {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>}
              <button type="submit"
                className="w-full py-4 font-black rounded-xl transition-all flex flex-col items-center justify-center gap-0.5 hover:opacity-90 active:scale-[0.98]"
                style={{ backgroundColor: '#c9a84c', color: '#0f2419' }}>
                <span className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Pay via M-Pesa
                </span>
                <span className="text-xs font-semibold opacity-75">{tier.name} x{qty} - KSH {total.toLocaleString()}</span>
              </button>
              <p className="text-center text-xs" style={{ color: 'var(--text-light)' }}>
                You will receive an M-Pesa PIN prompt. Enter your PIN to pay - your unique ticket is generated instantly.
              </p>
            </form>
          </div>
        </div>

        <div className="text-center mt-10">
          <p className="text-white/40 text-sm mb-1">Need help?</p>
          <a href="mailto:mombasayouthcouncil@gmail.com" className="text-[#c9a84c] font-semibold hover:underline text-sm">mombasayouthcouncil@gmail.com</a>
        </div>
        <div className="text-center mt-6">
          <Link href="/" className="text-white/30 text-xs hover:text-white/60 transition-colors">Back to MYC Homepage</Link>
        </div>
      </div>
    </div>
  )
}
