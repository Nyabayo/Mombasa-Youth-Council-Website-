'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

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
      router.push('/dashboard')
      router.refresh()
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
            <p className="text-[#00A8C8] text-xs mt-1">Create your member account — open to youth aged 18–34 in Mombasa County</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
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
                      <div key={r.label} className={`flex items-center gap-1 text-xs ${r.met ? 'text-blue-600' : 'text-gray-400'}`}>
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
                By joining, you confirm you are between <strong>18 and 34 years old</strong> and based in
                Mombasa County, and you agree to uphold the values and objectives of the MYC.
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: 'var(--primary)' }}
                className="w-full py-3 text-white font-bold rounded-lg disabled:opacity-50 hover:opacity-90 transition-opacity"
              >
                {loading ? 'Creating Account...' : 'Join MYC Today'}
              </button>
            </form>

            <div className="mt-6 text-center">
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
