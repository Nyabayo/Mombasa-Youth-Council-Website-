'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const validate = () => {
    if (!form.name.trim() || !form.email.trim() || !form.password) return 'All fields are required.'
    if (form.password.length < 8) return 'Password must be at least 8 characters.'
    if (!/[A-Z]/.test(form.password)) return 'Password must contain at least one uppercase letter.'
    if (!/[0-9]/.test(form.password)) return 'Password must contain at least one number.'
    if (form.password !== form.confirm) return 'Passwords do not match.'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) { setError(validationError); return }
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
    })

    const data = await res.json()
    if (res.ok) {
      setSubmitted(true)
    } else {
      setError(data.error ?? 'Registration failed.')
      setLoading(false)
    }
  }

  const requirements = [
    { label: 'At least 8 characters', met: form.password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(form.password) },
    { label: 'One number', met: /[0-9]/.test(form.password) },
    { label: 'Passwords match', met: form.password.length > 0 && form.password === form.confirm },
  ]

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12" style={{ backgroundColor: '#f5f5f5' }}>
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
                <span className="text-white font-black text-lg">MYC</span>
              </div>
              <div className="text-gray-700 font-bold">Mombasa Youth Council</div>
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="bg-green-600 px-6 py-4">
              <h1 className="text-white text-xl font-black">Application Submitted!</h1>
              <p className="text-green-100 text-xs mt-1">Your account is pending administrator approval</p>
            </div>

            <div className="p-8 space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-black text-gray-900 mb-2">Account Created Successfully</h2>
                <p className="text-gray-600 text-sm">Your application has been received. Complete the steps below to get approved.</p>
              </div>

              {/* Payment instructions */}
              <div className="rounded-xl border-2 border-yellow-400 bg-yellow-50 overflow-hidden">
                <div className="bg-yellow-400 px-4 py-3">
                  <p className="font-black text-yellow-900 text-sm uppercase tracking-wide">Step 1: Complete Payment</p>
                </div>
                <div className="p-5 space-y-4">
                  <p className="text-sm text-gray-700">Pay the one-time membership fee of <strong>KES 200</strong> via M-Pesa:</p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg border border-yellow-200 p-3 text-center">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-1">Paybill Number</p>
                      <p className="text-2xl font-black text-gray-900">400200</p>
                    </div>
                    <div className="bg-white rounded-lg border border-yellow-200 p-3 text-center">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-1">Amount</p>
                      <p className="text-2xl font-black text-green-600">KES 200</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-yellow-200 p-3">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Account Number</p>
                    <p className="text-xl font-black text-gray-900 tracking-wider">01103084324001</p>
                  </div>

                  <div className="text-xs text-gray-500 bg-white rounded p-3 border border-yellow-100">
                    <strong>How to pay:</strong> Go to M-Pesa &rarr; Lipa na M-Pesa &rarr; Pay Bill &rarr; Enter Paybill <strong>400200</strong> &rarr; Account <strong>01103084324001</strong> &rarr; Amount <strong>200</strong>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border-2 border-teal-300 bg-teal-50 p-5">
                <p className="text-xs font-black text-teal-800 uppercase tracking-wide mb-2">Step 2: Wait for Approval</p>
                <p className="text-sm text-teal-700">Once payment is confirmed, an administrator will review and approve your account. You will then be able to <Link href="/login" className="font-bold underline">sign in</Link>.</p>
              </div>

              <p className="text-center text-sm text-gray-500">
                Already paid and approved?{' '}
                <Link href="/login" className="text-teal-700 font-semibold hover:underline">Sign in here</Link>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            <Link href="/" className="hover:text-gray-600">← Return to MYC Homepage</Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12" style={{ backgroundColor: '#f5f5f5' }}>
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
              <span className="text-white font-black text-lg">MYC</span>
            </div>
            <div className="text-gray-700 font-bold">Mombasa Youth Council</div>
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
          <div style={{ backgroundColor: 'var(--primary)' }} className="px-6 py-4">
            <h1 className="text-white text-xl font-black">Join MYC Today</h1>
            <p className="text-[#00A8C8] text-xs mt-1">Create your member account. Open to youth aged 18–34 in Mombasa County</p>
          </div>

          <div className="p-6 space-y-5">

            {/* Payment notice — always visible */}
            <div className="rounded-xl border-2 border-yellow-400 bg-yellow-50 overflow-hidden">
              <div className="bg-yellow-400 px-4 py-2.5 flex items-center gap-2">
                <span className="text-yellow-900 font-black text-xs uppercase tracking-wide">Membership Fee Required</span>
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-700 mb-3">A one-time payment of <strong>KES 200</strong> is required to activate your account:</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white rounded border border-yellow-200 p-2">
                    <p className="text-xs text-gray-400 font-semibold">Paybill</p>
                    <p className="text-base font-black text-gray-900">400200</p>
                  </div>
                  <div className="bg-white rounded border border-yellow-200 p-2">
                    <p className="text-xs text-gray-400 font-semibold">Account No.</p>
                    <p className="text-xs font-black text-gray-900 break-all">01103084324001</p>
                  </div>
                  <div className="bg-white rounded border border-yellow-200 p-2">
                    <p className="text-xs text-gray-400 font-semibold">Amount</p>
                    <p className="text-base font-black text-green-600">KES 200</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Pay after registering. Your account will be activated once payment is confirmed by an administrator.</p>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
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
                  required
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
                  required
                  autoComplete="new-password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
                {form.password && (
                  <div className="mt-2 grid grid-cols-2 gap-1">
                    {requirements.map((r) => (
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
                  required
                  autoComplete="new-password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              <div className="p-3 rounded text-xs text-gray-600" style={{ backgroundColor: 'var(--bg-alt)' }}>
                By joining, you confirm you are between <strong>18 and 34 years old</strong> and based in Mombasa County, and you agree to uphold the values and objectives of the MYC.
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: 'var(--primary)' }}
                className="w-full py-3 text-white font-bold rounded-lg disabled:opacity-50 hover:opacity-90 transition-opacity"
              >
                {loading ? 'Submitting Application...' : 'Submit Application'}
              </button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-teal-700 font-semibold hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          <Link href="/" className="hover:text-gray-600">← Return to MYC Homepage</Link>
        </p>
      </div>
    </div>
  )
}
