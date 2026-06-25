'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

export default function TicketBanner() {
  const [dismissed, setDismissed] = useState(false)
  const pathname = usePathname()

  if (dismissed || pathname === '/tickets') return null

  return (
    <div
      className="relative z-[150] flex items-center justify-center gap-3 px-4 py-2.5 text-center"
      style={{ backgroundColor: '#c9a84c' }}
    >
      {/* Sparkle left */}
      <span className="hidden sm:block text-[#0f2419] text-base select-none" aria-hidden>✦</span>

      <Link
        href="/tickets"
        className="flex items-center gap-2 font-black text-sm text-[#0f2419] hover:underline"
      >
        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 10V6a2 2 0 00-2-2H4a2 2 0 00-2 2v4a2 2 0 000 4v4a2 2 0 002 2h16a2 2 0 002-2v-4a2 2 0 000-4zm-2-4v2.382A3 3 0 0018 11a3 3 0 002 2.618V18H4v-4.382A3 3 0 006 11a3 3 0 00-2-2.618V6h16z"/>
        </svg>
        <span>
          <span className="hidden sm:inline">Mombasa Youth Innovation Festival 2026 — Gala Dinner &amp; Awards &nbsp;·&nbsp; </span>
          <span className="font-black underline underline-offset-2">Book your ticket now &rarr;</span>
        </span>
      </Link>

      <span className="hidden sm:block text-[#0f2419] text-base select-none" aria-hidden>✦</span>

      {/* Dismiss */}
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0f2419]/60 hover:text-[#0f2419] transition-colors text-lg leading-none"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  )
}
