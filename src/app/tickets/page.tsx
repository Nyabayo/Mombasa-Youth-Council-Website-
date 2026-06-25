'use client'

import { useState } from 'react'
import Link from 'next/link'

const TICKETS = [
  {
    id: 'regular',
    name: 'Regular',
    price: 500,
    tagline: 'Access. Connect. Inspire.',
    perks: ['Full festival access', 'Networking sessions', 'Gala dinner entry'],
    color: 'border-gray-300',
    bg: 'bg-white',
    badge: 'bg-gray-800 text-white',
    selected: 'ring-4 ring-gray-800 border-gray-800',
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 1000,
    tagline: 'Engage. Network. Elevate.',
    perks: ['All Regular benefits', 'Priority seating', 'VIP lounge access', 'Awards ceremony front row'],
    color: 'border-[#1a4731]',
    bg: 'bg-[#f5fbf7]',
    badge: 'bg-[#1a4731] text-white',
    selected: 'ring-4 ring-[#1a4731] border-[#1a4731]',
  },
  {
    id: 'vvip',
    name: 'VVIP',
    price: 2000,
    tagline: 'Exclusive. Premium. Impact.',
    perks: ['All VIP benefits', 'Premium table placement', 'Meet & greet with speakers', 'Exclusive gift pack'],
    color: 'border-[#c9a84c]',
    bg: 'bg-[#fffbf0]',
    badge: 'bg-[#c9a84c] text-[#1a1a00]',
    selected: 'ring-4 ring-[#c9a84c] border-[#c9a84c]',
  },
]

const WA_LINK = 'https://wa.link/i8lfuo'

function buildWhatsAppMessage(fields: {
  name: string; phone: string; email: string
  ticket: string; price: number; mpesaRef: string
}) {
  return (
    `🎟 *MYIF 2026 Ticket Booking*\n` +
    `━━━━━━━━━━━━━━━━━━━━━\n` +
    `*Name:* ${fields.name}\n` +
    `*Phone:* ${fields.phone}\n` +
    `*Email:* ${fields.email}\n` +
    `*Ticket:* ${fields.ticket} — KSH ${fields.price.toLocaleString()}\n` +
    `*M-Pesa Ref:* ${fields.mpesaRef.toUpperCase()}\n` +
    `━━━━━━━━━━━━━━━━━━━━━\n` +
    `_Mombasa Youth Innovation Festival 2026_\n` +
    `_Gala Dinner & Awards — 11th July 2026, 6:00 PM_`
  )
}

export default function TicketsPage() {
  const [selected, setSelected] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', phone: '', email: '', mpesaRef: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const ticket = TICKETS.find((t) => t.id === selected)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected || !ticket) { setError('Please select a ticket type.'); return }
    if (!form.name.trim()) { setError('Enter your full name.'); return }
    if (!form.phone.trim()) { setError('Enter your phone number.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError('Enter a valid email address.'); return }
    if (form.mpesaRef.trim().length < 6) { setError('Enter your M-Pesa confirmation code.'); return }

    setError('')
    setLoading(true)

    const message = buildWhatsAppMessage({
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      ticket: ticket.name,
      price: ticket.price,
      mpesaRef: form.mpesaRef.trim(),
    })

    // Open WhatsApp chat in new tab
    const waUrl = `${WA_LINK}`
    window.open(waUrl, '_blank', 'noopener,noreferrer')

    // Auto-copy message to clipboard so user can paste into WhatsApp
    try {
      await navigator.clipboard.writeText(message)
    } catch {
      // clipboard access may be denied on some browsers — not critical
    }

    setLoading(false)
    setSubmitted(true)
  }

  const whatsappMessage = submitted && ticket ? buildWhatsAppMessage({
    name: form.name.trim(),
    phone: form.phone.trim(),
    email: form.email.trim(),
    ticket: ticket.name,
    price: ticket.price,
    mpesaRef: form.mpesaRef.trim(),
  }) : ''

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(whatsappMessage)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore */ }
  }

  if (submitted && ticket) {
    return (
      <div className="min-h-screen bg-[#0f2419] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Success header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-[#c9a84c] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-[#0f2419]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-black text-white mb-1">Booking Submitted!</h1>
            <p className="text-white/50 text-sm">WhatsApp has opened — paste the message below into the chat to confirm your seat.</p>
          </div>

          {/* Booking summary */}
          <div className="bg-white/10 rounded-xl p-5 mb-5 space-y-2.5">
            {[
              { label: 'Name', value: form.name },
              { label: 'Phone', value: form.phone },
              { label: 'Email', value: form.email },
              { label: 'Ticket', value: `${ticket.name} — KSH ${ticket.price.toLocaleString()}`, gold: true },
              { label: 'M-Pesa ref', value: form.mpesaRef.toUpperCase(), mono: true },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center gap-4">
                <span className="text-white/50 text-sm flex-shrink-0">{row.label}</span>
                <span className={`text-sm text-right ${row.gold ? 'text-[#c9a84c] font-black' : row.mono ? 'font-mono font-bold text-white tracking-wider' : 'text-white font-semibold'}`}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {/* WhatsApp message to copy */}
          <div className="bg-[#1a4731] rounded-xl overflow-hidden mb-5">
            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-[#c9a84c] text-xs font-black uppercase tracking-wide">Message to paste in WhatsApp</span>
              <button
                onClick={copyMessage}
                className="text-xs text-white/70 hover:text-white px-3 py-1 rounded border border-white/20 hover:border-white/50 transition-all"
              >
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="px-4 pb-4 text-xs text-white/80 whitespace-pre-wrap font-sans leading-relaxed">
              {whatsappMessage}
            </pre>
          </div>

          {/* Open WhatsApp again */}
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 rounded-xl font-black text-sm mb-6 transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#25D366', color: 'white' }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Open WhatsApp
          </a>

          <p className="text-center text-white/30 text-xs mb-4">
            Questions? <a href="mailto:mombasayouthcouncil@gmail.com" className="text-[#c9a84c] underline">mombasayouthcouncil@gmail.com</a>
          </p>
          <div className="text-center">
            <Link href="/" className="text-white/30 text-xs hover:text-white/50 transition-colors">← Back to homepage</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f2419]">

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#c9a84c]/5 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#c9a84c]/5 rounded-full translate-y-24 -translate-x-24" />

        <div className="max-w-4xl mx-auto px-4 py-16 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-px h-6 bg-[#c9a84c]" />
              <span className="text-[#c9a84c] text-xs font-bold tracking-[0.3em] uppercase">Mombasa Youth Council presents</span>
              <div className="w-px h-6 bg-[#c9a84c]" />
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight mb-2">Mombasa Youth</h1>
            <h2 className="text-4xl sm:text-6xl font-black text-white leading-tight mb-1">Innovation Festival</h2>
            <h3 className="text-3xl sm:text-5xl font-black text-[#c9a84c] italic mb-6">2026</h3>

            <div className="inline-block border border-[#c9a84c]/40 rounded-full px-6 py-2 mb-8">
              <span className="text-white/70 text-sm">Theme: </span>
              <span className="text-[#c9a84c] text-sm font-semibold">Youths at the Center of Mombasa&apos;s Creative Economy</span>
            </div>

            <div className="inline-flex flex-wrap justify-center gap-6 bg-[#1a4731] rounded-2xl px-8 py-5 mb-4">
              <div className="flex items-center gap-2.5">
                <svg className="w-5 h-5 text-[#c9a84c] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-white font-bold">11th July 2026</span>
              </div>
              <div className="w-px bg-white/20 hidden sm:block" />
              <div className="flex items-center gap-2.5">
                <svg className="w-5 h-5 text-[#c9a84c] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-white font-bold">6:00 PM</span>
              </div>
              <div className="w-px bg-white/20 hidden sm:block" />
              <div className="flex items-center gap-2.5">
                <svg className="w-5 h-5 text-[#c9a84c] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-white/70 font-medium text-sm italic">Venue to be announced</span>
              </div>
            </div>

            <div className="mt-4">
              <span className="inline-block bg-[#c9a84c] text-[#0f2419] text-xs font-black px-4 py-1.5 rounded-full tracking-wide uppercase">
                Gala Dinner &amp; Awards — Celebrating Youth. Honouring Excellence.
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-20">

        {/* Dress code */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10">
          <h3 className="text-[#c9a84c] font-black text-sm uppercase tracking-widest mb-4 text-center">Dress Code</h3>
          <p className="text-white text-center font-bold mb-5">Glamorous African Formal / Corporate Elegance</p>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-[#c9a84c] font-bold mb-1">Gentlemen</p>
              <p className="text-white/70">Suits, blazers, tuxedos, or elegant African formal attire</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-[#c9a84c] font-bold mb-1">Ladies</p>
              <p className="text-white/70">Evening gowns, cocktail dresses, or African-inspired formal wear</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-[#c9a84c] font-bold mb-1">Colours</p>
              <p className="text-white/70">Gold, Navy Blue, Black, White, Emerald Green</p>
            </div>
          </div>
        </div>

        {/* Ticket tiers */}
        <h2 className="text-white text-2xl font-black text-center mb-2">Select Your Ticket</h2>
        <p className="text-white/50 text-center text-sm mb-8">Choose your experience for the evening</p>

        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {TICKETS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelected(t.id)}
              className={`text-left rounded-2xl border-2 p-5 transition-all cursor-pointer ${t.bg} ${selected === t.id ? t.selected : t.color}`}
            >
              <div className={`inline-block text-xs font-black px-3 py-1 rounded-full mb-3 ${t.badge}`}>{t.name}</div>
              <div className="mb-1">
                <span className="text-xs text-gray-400">KSH</span>
                <span className="text-3xl font-black text-gray-900 ml-1">{t.price.toLocaleString()}</span>
              </div>
              <p className="text-xs text-gray-500 italic mb-4">{t.tagline}</p>
              <ul className="space-y-1.5">
                {t.perks.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="text-green-600 mt-0.5 flex-shrink-0">✓</span>
                    {p}
                  </li>
                ))}
              </ul>
              {selected === t.id && <div className="mt-4 text-center text-xs font-bold text-[#1a4731]">Selected ✓</div>}
            </button>
          ))}
        </div>

        {/* Payment + booking form */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-[#1a4731] px-6 py-5">
            <h2 className="text-white text-xl font-black">Pay &amp; Book Your Seat</h2>
            <p className="text-white/60 text-sm mt-1">
              {selected ? `${ticket?.name} ticket — KSH ${ticket?.price.toLocaleString()}` : 'Select a ticket above, then complete payment below'}
            </p>
          </div>

          <div className="p-6">
            {/* Payment details */}
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-5 mb-6">
              <p className="text-sm text-gray-700 mb-4">
                Send <strong className="text-gray-900">KSH {selected ? ticket?.price.toLocaleString() : '500 / 1,000 / 2,000'}</strong> via M-Pesa to:
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Business number</span>
                  <span className="text-2xl font-black text-gray-900">400200</span>
                </div>
                <div className="border-t border-amber-100" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Account number</span>
                  <span className="text-base font-black text-gray-900 tracking-wider">01103084324001</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-4">M-Pesa &rarr; Lipa na M-Pesa &rarr; Pay Bill &rarr; enter the details above</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    autoComplete="name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4731]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="07XX XXX XXX"
                    autoComplete="tel"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4731]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  autoComplete="email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4731]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">M-Pesa confirmation code *</label>
                <p className="text-xs text-gray-400 mb-2">From the SMS M-Pesa sent after payment, e.g. <strong>QFG4XXXXXW</strong></p>
                <input
                  type="text"
                  name="mpesaRef"
                  value={form.mpesaRef}
                  onChange={handleChange}
                  placeholder="QFG4XXXXXW"
                  maxLength={30}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm font-mono uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-[#1a4731]"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !selected}
                className="w-full py-4 font-black text-sm rounded-xl transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                style={{ backgroundColor: '#c9a84c', color: '#0f2419' }}
              >
                {loading ? 'Sending…' : (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Confirm {ticket ? `${ticket.name} Ticket` : 'Ticket'} via WhatsApp
                  </>
                )}
              </button>

              {!selected && (
                <p className="text-center text-xs text-gray-400">Select a ticket type above to continue</p>
              )}
            </form>
          </div>
        </div>

        <div className="text-center mt-10">
          <p className="text-white/40 text-sm mb-1">Need help?</p>
          <a href="mailto:mombasayouthcouncil@gmail.com" className="text-[#c9a84c] font-semibold hover:underline text-sm">
            mombasayouthcouncil@gmail.com
          </a>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="text-white/30 text-xs hover:text-white/60 transition-colors">← Back to MYC Homepage</Link>
        </div>
      </div>
    </div>
  )
}
