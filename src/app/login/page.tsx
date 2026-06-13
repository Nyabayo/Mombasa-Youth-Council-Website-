'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()
    if (res.ok) {
      router.push('/dashboard')
      router.refresh()
    } else {
      setError(data.error ?? 'Login failed.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12" style={{ backgroundColor: '#f5f5f5' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center" style={{ backgroundColor: '#003087' }}>
              <span className="text-white font-black text-lg">MYC</span>
            </div>
            <div className="text-gray-700 font-bold">Mombasa Youth Council</div>
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
          <div style={{ backgroundColor: '#003087' }} className="px-6 py-4">
            <h1 className="text-white text-xl font-black">Member Login</h1>
            <p className="text-blue-200 text-xs mt-1">Sign in to access your MYC account</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  autoComplete="email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-gray-700">Password</label>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: '#003087' }}
                className="w-full py-3 text-white font-bold rounded-lg disabled:opacity-50 hover:opacity-90 transition-opacity"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-blue-700 font-semibold hover:underline">
                  Join MYC Today
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
