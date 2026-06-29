'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

type PayState = 'idle' | 'initiating' | 'waiting' | 'success' | 'timeout' | 'cancelled' | 'error'

export default function RegisterPage() {
  const [step, setStep]           = useState<1 | 2>(1)
  const [form, setForm]           = useState({ name: '', phone: '', email: '', password: '', confirm: '' })
  const [error, setError]         = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [mpesaReceipt, setMpesaReceipt] = useState('')

  const [payState, setPayState]   = useState<PayState>('idle')
  const [countdown, setCountdown] = useState(60)
  const [customAmount, setCustomAmount] = useState('')

  const pollRef     = useRef<ReturnType<typeof setInterval> | null>(null)
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null)
  const attemptsRef = useRef(0)

  useEffect(() => () => { stopPolling() }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const passwordReqs = [
    { label: 'At least 8 characters', met: form.password.length >= 8 },
    { label: 'One uppercase letter',  met: /[A-Z]/.test(form.password) },
    { label: 'One number',            met: /[0-9]/.test(form.password) },
    { label: 'Passwords match',       met: form.password.length > 0 && form.password === form.confirm },
  ]

  const validateStep1 = () => {
    if (!form.name.trim())                               return 'Full name is required.'
    if (!form.phone.trim())                              return 'Phone number is required.'
    if (!form.email.trim())                              return 'Email is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Enter a valid email address.'
    if (form.password.length < 8)                        return 'Password must be at least 8 characters.'
    if (!/[A-Z]/.test(form.password))                    return 'Password must contain at least one uppercase letter.'
    if (!/[0-9]/.test(form.password))                   return 'Password must contain at least one number.'
    if (form.password !== form.confirm)                  return 'Passwords do not match.'
    return null
  }

  const handleNextStep = () => {
    const err = validateStep1()
    if (err) { setError(err); return }
    setError('')
    setStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const stopPolling = () => {
    if (pollRef.current)  clearInterval(pollRef.current)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  const submitRegistration = async (receipt: string) => {
    const res  = await fetch('/api/auth/register', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name: form.name, email: form.email, password: form.password, mpesaRef: receipt }),
    })
    const data = await res.json()
    if (res.ok) {
      setSubmitted(true)
    } else {
      setError(data.error ?? 'Registration failed. Please try again.')
      setPayState('idle')
    }
  }

  const startPolling = (txId: string) => {
    attemptsRef.current = 0
    setCountdown(60)

    timerRef.current = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000)

    pollRef.current = setInterval(async () => {
      attemptsRef.current++
      if (attemptsRef.current > 20) { stopPolling(); setPayState('timeout'); return }

      try {
        const res  = await fetch('/api/pay/status', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transactionRequestId: txId }),
        })
        const data = await res.json()
        const code   = String(data.ResultCode   ?? data.result_code          ?? '')
        const status = String(data.TransactionStatus ?? data.transaction_status ?? '').toLowerCase()

        if (code === '0' || status === 'completed') {
          stopPolling()
          const receipt = data.TransactionReceipt ?? data.receipt ?? 'AUTO'
          setMpesaReceipt(receipt)
          setPayState('success')
          await submitRegistration(receipt)
        } else if (code === '1032' || status === 'cancelled') {
          stopPolling(); setPayState('cancelled')
        }
      } catch { /* keep polling */ }
    }, 3000)
  }

  const handleInitiatePayment = async () => {
    setError('')
    setPayState('initiating')
    const res  = await fetch('/api/pay/initiate', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: form.phone, amount: customAmount ? Number(customAmount) : 200, reference: `REG-${Date.now()}` }),
    })
    const data = await res.json()
    if (!res.ok || !data.transactionRequestId) {
      setError(data.error ?? 'Could not send M-Pesa request. Check your phone number.')
      setPayState('idle'); return
    }
    setPayState('waiting')
    startPolling(data.transactionRequestId)
  }

  /* ─── Submitted ──────────────────────────────────────────────── */
  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
                <span className="text-white font-black text-lg">MYC</span>
              </div>
              <div className="font-bold" style={{ color: 'var(--text-muted)' }}>Mombasa Youth Council</div>
            </Link>
          </div>
          <div className="rounded-xl border overflow-hidden shadow-lg" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <div className="bg-green-600 px-6 py-5 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h1 className="text-white text-xl font-black">Payment Confirmed!</h1>
                <p className="text-green-100 text-xs mt-0.5">KES 200 received — application submitted</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--bg-alt)', border: '1px solid var(--border)' }}>
                <p className="text-xs font-semibold uppercase mb-1" style={{ color: 'var(--text-light)' }}>M-Pesa Receipt</p>
                <p className="text-lg font-black tracking-wider" style={{ color: 'var(--text)' }}>{mpesaReceipt}</p>
              </div>
              <div className="rounded-lg p-4" style={{ backgroundColor: 'rgba(0,168,200,0.08)', border: '1px solid rgba(0,168,200,0.2)' }}>
                <p className="text-sm font-bold mb-1" style={{ color: 'var(--accent)' }}>What happens next?</p>
                <ol className="text-sm space-y-1 list-decimal list-inside" style={{ color: 'var(--text-muted)' }}>
                  <li>An administrator will review your application</li>
                  <li>Your KES 200 payment has been confirmed automatically</li>
                  <li>Once approved, you can sign in</li>
                </ol>
              </div>
              <p className="text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                Ready to sign in?{' '}
                <Link href="/login" className="text-teal-700 font-semibold hover:underline">Sign in here</Link>
              </p>
            </div>
          </div>
          <p className="text-center text-xs mt-6" style={{ color: 'var(--text-light)' }}>
            <Link href="/" className="hover:underline">← Return to Homepage</Link>
          </p>
        </div>
      </div>
    )
  }

  /* ─── Main form ──────────────────────────────────────────────── */
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
              <span className="text-white font-black text-lg">MYC</span>
            </div>
            <div className="font-bold" style={{ color: 'var(--text-muted)' }}>Mombasa Youth Council</div>
          </Link>
        </div>

        {/* Step indicator */}
        <div className="flex items-center mb-6">
          {[{ n: 1, label: 'Your Details' }, { n: 2, label: 'Pay KES 200' }].map((s, i) => (
            <div key={s.n} className="flex items-center flex-1">
              {i > 0 && <div className="flex-1 h-0.5 mx-2" style={{ backgroundColor: 'var(--border)' }} />}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black"
                  style={step >= s.n ? { backgroundColor: 'var(--primary)', color: 'white' } : { backgroundColor: 'var(--border)', color: 'var(--text-light)' }}
                >
                  {step > s.n ? '✓' : s.n}
                </div>
                <span className="text-sm font-semibold hidden sm:inline" style={{ color: step === s.n ? 'var(--text)' : 'var(--text-light)' }}>{s.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border overflow-hidden shadow-lg" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <div style={{ backgroundColor: 'var(--primary)' }} className="px-6 py-4">
            <h1 className="text-white text-xl font-black">
              {step === 1 ? 'Create Your Account' : 'Pay Membership Fee'}
            </h1>
            <p className="text-[#00A8C8] text-xs mt-1">
              {step === 1 ? 'Open to youth aged 18–34 in Mombasa County' : 'One-time fee of KES 200 via M-Pesa'}
            </p>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>
            )}

            {/* ── STEP 1 ── */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>Full Name *</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" autoComplete="name"
                    className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--text)' }} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>M-Pesa Phone Number *</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="07XX XXX XXX" autoComplete="tel"
                    className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--text)' }} />
                  <p className="text-xs mt-1" style={{ color: 'var(--text-light)' }}>Used to collect the KES 200 membership fee</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>Email Address *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" autoComplete="email"
                    className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--text)' }} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>Password *</label>
                  <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Create a strong password" autoComplete="new-password"
                    className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--text)' }} />
                  {form.password && (
                    <div className="mt-2 grid grid-cols-2 gap-1">
                      {passwordReqs.map((r) => (
                        <div key={r.label} className={`flex items-center gap-1 text-xs ${r.met ? 'text-green-600' : ''}`} style={!r.met ? { color: 'var(--text-light)' } : {}}>
                          <span>{r.met ? '✓' : '○'}</span> {r.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>Confirm Password *</label>
                  <input type="password" name="confirm" value={form.confirm} onChange={handleChange} placeholder="Repeat your password" autoComplete="new-password"
                    className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--text)' }} />
                </div>
                <div className="p-3 rounded text-xs" style={{ backgroundColor: 'var(--bg-alt)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  By joining, you confirm you are between <strong>18 and 34 years old</strong> and based in Mombasa County.
                </div>
                <button type="button" onClick={handleNextStep} style={{ backgroundColor: 'var(--primary)' }}
                  className="w-full py-3 text-white font-bold rounded-lg hover:opacity-90 transition-opacity">
                  Next: Pay KES 200 &rarr;
                </button>
                <p className="text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                  Already have an account?{' '}
                  <Link href="/login" className="text-teal-700 font-semibold hover:underline">Sign in</Link>
                </p>
              </div>
            )}

            {/* ── STEP 2 — STK Push ── */}
            {step === 2 && (
              <div className="space-y-5">

                {/* Initiating / Waiting */}
                {(payState === 'initiating' || payState === 'waiting') && (
                  <div className="text-center py-6">
                    <div className="relative w-20 h-20 mx-auto mb-5">
                      <span className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: 'var(--primary)' }} />
                      <div className="relative w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
                        <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="font-black text-lg mb-1" style={{ color: 'var(--text)' }}>
                      {payState === 'initiating' ? 'Sending request…' : 'Check your phone'}
                    </h3>
                    {payState === 'waiting' && (
                      <>
                        <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>M-Pesa PIN prompt sent to</p>
                        <p className="font-black text-base mb-3" style={{ color: 'var(--accent)' }}>{form.phone}</p>
                        <p className="text-sm mb-4" style={{ color: 'var(--text-light)' }}>
                          Enter your PIN to pay <strong style={{ color: 'var(--text)' }}>KES 200</strong>.{' '}
                          Expires in <strong style={{ color: 'var(--text)' }}>{countdown}s</strong>
                        </p>
                        <button onClick={() => { stopPolling(); setPayState('cancelled') }} className="text-sm underline" style={{ color: 'var(--text-light)' }}>
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* Timeout / Cancelled */}
                {(payState === 'timeout' || payState === 'cancelled') && (
                  <div className="text-center py-2">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl bg-red-100 border-2 border-red-300">
                      {payState === 'timeout' ? '⏱' : '✕'}
                    </div>
                    <p className="font-bold mb-1" style={{ color: 'var(--text)' }}>
                      {payState === 'timeout' ? 'Payment timed out' : 'Payment cancelled'}
                    </p>
                    <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                      {payState === 'timeout' ? 'No PIN entered in time.' : 'You cancelled the PIN prompt.'}
                    </p>
                  </div>
                )}

                {/* Idle / Retry button */}
                {(payState === 'idle' || payState === 'timeout' || payState === 'cancelled') && (
                  <>
                    <div className="rounded-lg p-4 space-y-2" style={{ backgroundColor: 'var(--bg-alt)', border: '1px solid var(--border)' }}>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Sending <strong style={{ color: 'var(--text)' }}>KES {customAmount || '200'}</strong> to:</p>
                      <p className="text-xl font-black" style={{ color: 'var(--text)' }}>{form.phone}</p>
                      <p className="text-xs" style={{ color: 'var(--text-light)' }}>
                        An M-Pesa PIN prompt will appear on your phone immediately.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>Other Amount (testing only)</label>
                      <input
                        type="number" min="1" value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder="Leave blank to use KES 200"
                        className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--text)' }}
                      />
                    </div>

                    <button
                      onClick={handleInitiatePayment}
                      style={{ backgroundColor: 'var(--primary)' }}
                      className="w-full py-4 text-white font-black rounded-lg hover:opacity-90 transition-opacity flex flex-col items-center gap-0.5"
                    >
                      <span className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        {payState === 'idle' ? 'Send M-Pesa Request' : 'Try Again'}
                      </span>
                      <span className="text-xs font-semibold opacity-75">KES {customAmount || '200'} to {form.phone}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setStep(1); setError(''); setPayState('idle') }}
                      className="w-full py-2.5 text-sm font-semibold rounded-lg border transition-colors hover:opacity-80"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                    >
                      &larr; Back
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'var(--text-light)' }}>
          <Link href="/" className="hover:underline">← Return to Homepage</Link>
        </p>
      </div>
    </div>
  )
}
