'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'

interface NavItem {
  label: string
  href?: string
  children?: { label: string; href: string }[]
}

const navItems: NavItem[] = [
  { label: 'HOME', href: '/' },
  {
    label: 'ADMINISTRATION',
    children: [
      { label: 'The President', href: '/president' },
      { label: 'The Deputy President', href: '/deputy-president' },
      { label: 'CS Finance & Economic Planning', href: '/cabinet-secretary' },
      { label: 'Speaker', href: '/speaker' },
      { label: 'Minority Leader', href: '/minority-leader' },
    ],
  },
  {
    label: 'GOVERNANCE',
    children: [
      { label: 'Governance Structure', href: '/governance' },
      { label: 'Youth Assembly', href: '/governance/youth-assembly' },
      { label: 'Committees', href: '/governance/committees' },
      { label: 'Administration', href: '/governance/administration' },
    ],
  },
  {
    label: 'POSTS & MEDIA',
    children: [
      { label: 'Latest Posts', href: '/posts' },
      { label: 'Press Releases', href: '/posts?category=Press+Release' },
      { label: 'Gallery', href: '/posts/gallery' },
    ],
  },
  {
    label: 'PROGRAMMES',
    children: [
      { label: 'What We Do', href: '/programmes' },
      { label: 'Innovation Festival 2026', href: '/programmes/innovation-festival' },
      { label: '#SheriaYaVijana', href: '/programmes/sheria-ya-vijana' },
      { label: 'Leadership Training', href: '/programmes/leadership-training' },
    ],
  },
  {
    label: 'ABOUT MYC',
    children: [
      { label: 'About Us', href: '/about' },
      { label: 'Mission & Vision', href: '/about/mission' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
]

const socialLinks = [
  {
    label: 'Facebook',
    href: '#',
    path: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z',
  },
  {
    label: 'X',
    href: '#',
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  {
    label: 'TikTok',
    href: '#',
    path: 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.16 8.16 0 004.78 1.53V6.77a4.85 4.85 0 01-1.01-.08z',
  },
  {
    label: 'LinkedIn',
    href: '#',
    path: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zm2-7a2 2 0 110 4 2 2 0 010-4z',
  },
  {
    label: 'Instagram',
    href: '#',
    path: 'M8 2h8a6 6 0 016 6v8a6 6 0 01-6 6H8a6 6 0 01-6-6V8a6 6 0 016-6zm0 2a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4V8a4 4 0 00-4-4H8zm4 3a5 5 0 110 10A5 5 0 0112 7zm0 2a3 3 0 100 6 3 3 0 000-6zm5-2.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z',
  },
  {
    label: 'YouTube',
    href: '#',
    path: 'M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z',
  },
  {
    label: 'WhatsApp',
    href: '#',
    path: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z',
  },
]

interface UserSession {
  id: string
  name: string
  email: string
  role: string
}

function DropdownMenu({
  item, isOpen, onOpen, onClose,
}: { item: NavItem; isOpen: boolean; onOpen: () => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    if (isOpen) document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [isOpen, onClose])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => (isOpen ? onClose() : onOpen())}
        className="flex items-center gap-1 px-6 py-3 text-xs font-black tracking-widest transition-all whitespace-nowrap border-b-2 border-transparent"
        style={{ color: '#004060' }}
        onMouseEnter={(e) => { onOpen(); (e.currentTarget as HTMLButtonElement).style.color = '#004B6B'; (e.currentTarget as HTMLButtonElement).style.borderBottomColor = '#004B6B' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#004060'; if (!isOpen) (e.currentTarget as HTMLButtonElement).style.borderBottomColor = 'transparent' }}
        aria-expanded={isOpen}
      >
        {item.label}
        <svg className={`w-3 h-3 ml-0.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          onMouseLeave={onClose}
          className="absolute top-full left-0 z-50 min-w-[240px] bg-white"
          style={{ boxShadow: '0 8px 32px rgba(0,30,100,0.18)', borderTop: '3px solid #004B6B' }}
        >
          {item.children?.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={onClose}
              className="flex items-center gap-3 px-5 py-3.5 text-sm font-semibold text-gray-800 border-b border-gray-100 last:border-0 transition-all group"
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#004B6B'; e.currentTarget.style.color = 'white'; e.currentTarget.style.paddingLeft = '24px' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = ''; e.currentTarget.style.paddingLeft = '20px' }}
            >
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#004B6B' }} />
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Header() {
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const [user, setUser] = useState<UserSession | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<number | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data?.user ?? null))
      .catch(() => null)
  }, [pathname])

  const handleLogout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/')
    router.refresh()
  }, [router])

  const today = new Date().toLocaleDateString('en-KE', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, width: '100%', boxShadow: '0 2px 20px rgba(0,0,0,0.25)' }}>

      {/* ── Top bar ─────────────────────────────────── */}
      <div style={{ backgroundColor: '#003350' }} className="text-white text-xs">
        <div className="w-full px-6 flex items-center justify-between h-9">
          <span className="hidden sm:block opacity-70">{today}</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              {socialLinks.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 transition-opacity">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d={s.path} /></svg>
                </a>
              ))}
            </div>
            <span className="opacity-30">|</span>
            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/dashboard" className="hover:text-teal-300 transition-colors">{user.name}</Link>
                <button onClick={handleLogout} className="px-3 py-1 text-xs font-bold rounded hover:opacity-80" style={{ backgroundColor: 'white', color: '#004B6B' }}>Logout</button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="px-3 py-1 text-xs font-bold rounded hover:opacity-80" style={{ backgroundColor: 'white', color: '#004B6B' }}>Login</Link>
                <Link href="/register" className="px-3 py-1 text-xs font-bold rounded hover:opacity-80" style={{ backgroundColor: '#F5A300', color: '#003350' }}>Join MYC Today</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Combined logo + nav bar ─────────────────── */}
      <div style={{ backgroundColor: 'white', borderBottom: '3px solid #004B6B' }}>
        <div className="w-full px-6 flex items-center justify-between gap-8 py-3">

          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/Logo1.png"
              alt="Mombasa Youth Council"
              width={340}
              height={130}
              priority
              className="object-contain"
              style={{ maxHeight: '130px', width: 'auto' }}
            />
          </Link>

          {/* Desktop nav — right side */}
          <nav className="hidden lg:flex items-stretch flex-1 justify-end">
            {navItems.map((item, idx) =>
              item.href && !item.children ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center px-6 py-3 text-xs font-black tracking-widest transition-all whitespace-nowrap border-b-2 border-transparent hover:border-teal-800"
                  style={{ color: '#004060' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#004B6B'; (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = '#004B6B' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#004060'; (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = 'transparent' }}
                >
                  {item.label}
                </Link>
              ) : (
                <DropdownMenu
                  key={item.label}
                  item={item}
                  isOpen={openMenu === idx}
                  onOpen={() => setOpenMenu(idx)}
                  onClose={() => setOpenMenu(null)}
                />
              )
            )}
            {user && (
              <Link href="/dashboard" className="flex items-center px-3 py-3 text-xs font-black tracking-widest ml-2 transition-colors" style={{ color: '#004B6B' }}>
                + NEW POST
              </Link>
            )}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2"
            style={{ color: '#004B6B' }}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* ── Mobile nav ──────────────────────────────── */}
      {mobileOpen && (
        <nav style={{ backgroundColor: '#003350' }} className="lg:hidden">
          {navItems.map((item, idx) => (
            <div key={item.label}>
              {item.href && !item.children ? (
                <Link href={item.href} onClick={() => setMobileOpen(false)} className="block px-5 py-3 text-white text-sm font-bold border-b" style={{ borderColor: '#004060' }}>
                  {item.label}
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => setMobileExpanded(mobileExpanded === idx ? null : idx)}
                    className="w-full flex items-center justify-between px-5 py-3 text-white text-sm font-semibold border-b"
                    style={{ borderColor: '#004060' }}
                  >
                    {item.label}
                    <svg className={`w-4 h-4 transition-transform ${mobileExpanded === idx ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {mobileExpanded === idx && item.children?.map((child) => (
                    <Link key={child.href} href={child.href} onClick={() => setMobileOpen(false)} className="block px-8 py-2.5 text-sm text-teal-200 hover:text-white border-b transition-colors" style={{ borderColor: '#004060' }}>
                      {child.label}
                    </Link>
                  ))}
                </>
              )}
            </div>
          ))}
          <div className="px-5 py-3 flex gap-4 border-b" style={{ borderColor: '#004060' }}>
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="text-white text-sm">Dashboard</Link>
                <button onClick={handleLogout} className="text-white text-sm">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)} className="text-white text-sm">Login</Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="text-white text-sm">Join MYC Today</Link>
              </>
            )}
          </div>
          <div className="px-5 py-3 flex gap-4 flex-wrap">
            {socialLinks.map((s) => (
              <a key={s.label} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer" className="text-teal-300 hover:text-white transition-colors text-xs">
                {s.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
