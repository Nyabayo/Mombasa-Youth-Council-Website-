'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirm: '', mpesaRef: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const passwordReqs = [
    { label: 'At least 8 characters', met: form.password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(form.password) },
    { label: 'One number', met: /[0-9]/.test(form.password) },
    { label: 'Passwords match', met: form.password.length > 0 && form.password === form.confirm },
  ]

  const validateStep1 = () => {
    if (!form.name.trim()) return 'Full name is required.'
    if (!form.email.trim()) return 'Email is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Enter a valid email address.'
    if (form.password.length < 8) return 'Password must be at least 8 characters.'
    if (!/[A-Z]/.test(form.password)) return 'Password must contain at least one uppercase letter.'
    if (!/[0-9]/.test(form.password)) return 'Password must contain at least one number.'
    if (form.password !== form.confirm) return 'Passwords do not match.'
    return null
  }

  const handleNextStep = () => {
    const err = validateStep1()
    if (err) { setError(err); return }
    setError('')
    setStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.mpesaRef.trim()) { setError('Enter your M-Pesa transaction code.'); return }
    if (form.mpesaRef.trim().length < 6) { setError('M-Pesa transaction codes are at least 6 characters.'); return }
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
        mpesaRef: form.mpesaRef.trim().toUpperCase(),
      }),
    })

    const data = await res.json()
    if (res.ok) {
      setSubmitted(true)
    } else {
      setError(data.error ?? 'Registration failed. Please try again.')
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
                <span className="text-white font-black text-lg">MYC</span>
              </div>
              <div className="text-gray-700 font-bold">Mombasa Youth Council</div>
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="bg-green-600 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-white text-xl font-black">Application Submitted!</h1>
                  <p className="text-green-100 text-xs mt-0.5">Your payment reference has been recorded</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
                <p className="text-xs text-gray-500 font-semibold uppercase mb-1">M-Pesa Reference Submitted</p>
                <p className="text-lg font-black text-gray-900 tracking-wider">{form.mpesaRef.toUpperCase()}</p>
              </div>

              <div className="rounded-lg bg-teal-50 border border-teal-200 p-4">
                <p className="text-sm font-bold text-teal-800 mb-1">What happens next?</p>
                <ol className="text-sm text-teal-700 space-y-1 list-decimal list-inside">
                  <li>An administrator will verify your M-Pesa payment of KES 200</li>
                  <li>Once confirmed, your account will be activated</li>
                  <li>You will then be able to sign in</li>
                </ol>
              </div>

              <p className="text-center text-sm text-gray-600">
                Ready to sign in?{' '}
                <Link href="/login" className="text-teal-700 font-semibold hover:underline">Sign in here</Link>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            <Link href="/" className="hover:text-gray-600">← Return to Homepage</Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
              <span className="text-white font-black text-lg">MYC</span>
            </div>
            <div className="text-gray-700 font-bold">Mombasa Youth Council</div>
          </Link>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-6">
          <div className="flex-1 flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${step >= 1 ? 'text-white' : 'bg-gray-200 text-gray-500'}`} style={step >= 1 ? { backgroundColor: 'var(--primary)' } : {}}>
              {step > 1 ? '✓' : '1'}
            </div>
            <span className={`text-sm font-semibold ${step === 1 ? 'text-gray-900' : 'text-gray-400'}`}>Your Details</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300 mx-2" />
          <div className="flex-1 flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${step >= 2 ? 'text-white' : 'bg-gray-200 text-gray-500'}`} style={step >= 2 ? { backgroundColor: 'var(--primary)' } : {}}>
              2
            </div>
            <span className={`text-sm font-semibold ${step === 2 ? 'text-gray-900' : 'text-gray-400'}`}>Pay & Submit</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
          <div style={{ backgroundColor: 'var(--primary)' }} className="px-6 py-4">
            <h1 className="text-white text-xl font-black">
              {step === 1 ? 'Create Your Account' : 'Complete Payment'}
            </h1>
            <p className="text-[#00A8C8] text-xs mt-1">
              {step === 1
                ? 'Open to youth aged 18–34 in Mombasa County'
                : 'Pay KES 200 via M-Pesa, then enter your transaction code below'}
            </p>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* STEP 1 — Personal details */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    autoComplete="name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                  {form.password && (
                    <div className="mt-2 grid grid-cols-2 gap-1">
                      {passwordReqs.map((r) => (
                        <div key={r.label} className={`flex items-center gap-1 text-xs ${r.met ? 'text-green-600' : 'text-gray-400'}`}>
                          <span>{r.met ? '✓' : '○'}</span> {r.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password *</label>
                  <input
                    type="password"
                    name="confirm"
                    value={form.confirm}
                    onChange={handleChange}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>

                <div className="p-3 rounded text-xs text-gray-600 bg-gray-50 border border-gray-100">
                  By joining, you confirm you are between <strong>18 and 34 years old</strong> and based in Mombasa County, and agree to uphold the values of the MYC.
                </div>

                <button
                  type="button"
                  onClick={handleNextStep}
                  style={{ backgroundColor: 'var(--primary)' }}
                  className="w-full py-3 text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
                >
                  Next: Make Payment &rarr;
                </button>

                <p className="text-center text-sm text-gray-500">
                  Already have an account?{' '}
                  <Link href="/login" className="text-teal-700 font-semibold hover:underline">Sign in</Link>
                </p>
              </div>
            )}

            {/* STEP 2 — Payment */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* M-Pesa payment instructions */}
                <div>
                  <p className="text-sm text-gray-700 mb-3">
                    Send <strong>KES 200</strong> via M-Pesa using the details below, then paste your confirmation code to complete registration.
                  </p>

                  <div className="rounded-lg bg-green-50 border border-green-200 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Business number</span>
                      <span className="text-xl font-black text-gray-900 tracking-wide">400200</span>
                    </div>
                    <div className="border-t border-green-100" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Account number</span>
                      <span className="text-sm font-black text-gray-900 tracking-wider">01103084324001</span>
                    </div>
                    <div className="border-t border-green-100" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Amount</span>
                      <span className="text-xl font-black text-green-700">KES 200</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 mt-2">
                    On your phone: M-Pesa &rarr; Lipa na M-Pesa &rarr; Pay Bill &rarr; enter the details above
                  </p>
                </div>

                {/* M-Pesa reference input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    M-Pesa confirmation code *
                  </label>
                  <p className="text-xs text-gray-400 mb-2">
                    Check your SMS from M-Pesa — it looks like <strong>QFG4XXXXXW</strong>
                  </p>
                    <input
                      type="text"
                      name="mpesaRef"
                      value={form.mpesaRef}
                      onChange={handleChange}
                      placeholder="e.g. QFG4XXXXXW"
                      required
                      maxLength={30}
                      className="w-full border-2 border-teal-300 rounded-lg px-4 py-3 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                      style={{ letterSpacing: '0.1em' }}
                    />
                  <p className="text-xs text-gray-400 mt-2">An administrator will verify this before activating your account.</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => { setStep(1); setError('') }}
                    className="px-5 py-3 border border-gray-300 text-gray-700 font-semibold text-sm rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    &larr; Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !form.mpesaRef.trim()}
                    style={{ backgroundColor: 'var(--primary)' }}
                    className="flex-1 py-3 text-white font-bold rounded-lg disabled:opacity-50 hover:opacity-90 transition-opacity"
                  >
                    {loading ? 'Submitting…' : 'Submit Application'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          <Link href="/" className="hover:text-gray-600">← Return to Homepage</Link>
        </p>
      </div>
    </div>
  )
}
