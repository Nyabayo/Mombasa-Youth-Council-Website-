'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function TicketFloatingButton() {
  const pathname = usePathname()
  // Hide on the tickets page itself
  if (pathname === '/tickets') return null

  return (
    <Link
      href="/tickets"
      className="fixed z-[200] flex items-center gap-2 font-black text-sm shadow-2xl transition-transform hover:scale-105 active:scale-95"
      style={{
        bottom: '24px',
        right: '20px',
        backgroundColor: '#c9a84c',
        color: '#0f2419',
        borderRadius: '50px',
        padding: '14px 22px',
        boxShadow: '0 4px 24px rgba(201,168,76,0.55), 0 2px 8px rgba(0,0,0,0.3)',
      }}
      aria-label="Get tickets for Innovation Festival 2026"
    >
      {/* Ticket icon */}
      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22 10V6a2 2 0 00-2-2H4a2 2 0 00-2 2v4a2 2 0 000 4v4a2 2 0 002 2h16a2 2 0 002-2v-4a2 2 0 000-4zm-2-4v2.382A3 3 0 0018 11a3 3 0 002 2.618V18H4v-4.382A3 3 0 006 11a3 3 0 00-2-2.618V6h16z"/>
      </svg>
      <span className="whitespace-nowrap">GET TICKETS</span>

      {/* Pulse ring — draws the eye */}
      <span
        className="absolute inset-0 rounded-[50px] animate-ping opacity-30"
        style={{ backgroundColor: '#c9a84c' }}
        aria-hidden="true"
      />
    </Link>
  )
}
