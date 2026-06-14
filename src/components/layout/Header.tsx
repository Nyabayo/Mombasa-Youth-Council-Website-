'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { useTheme } from '@/components/ThemeProvider'

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
  { label: 'Facebook', href: '#', path: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
  { label: 'X', href: '#', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
  { label: 'Instagram', href: '#', path: 'M8 2h8a6 6 0 016 6v8a6 6 0 01-6 6H8a6 6 0 01-6-6V8a6 6 0 016-6zm0 2a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4V8a4 4 0 00-4-4H8zm4 3a5 5 0 110 10A5 5 0 0112 7zm0 2a3 3 0 100 6 3 3 0 000-6zm5-2.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z' },
  { label: 'YouTube', href: '#', path: 'M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z' },
  { label: 'WhatsApp', href: '#', path: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z' },
]

interface UserSession { id: string; name: string; email: string; role: string }

function SunIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="5" />
      <path strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  )
}

function DropdownMenu({ item, isOpen, onOpen, onClose }: {
  item: NavItem; isOpen: boolean; onOpen: () => void; onClose: () => void
}) {
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
        className="flex items-center gap-1 px-4 py-3 text-xs font-black tracking-widest transition-all whitespace-nowrap border-b-2 border-transparent"
        style={{ color: 'var(--primary)' }}
        onMouseEnter={(e) => {
          onOpen()
          const el = e.currentTarget as HTMLButtonElement
          el.style.color = 'var(--accent)'
          el.style.borderBottomColor = 'var(--gold)'
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLButtonElement
          el.style.color = 'var(--primary)'
          if (!isOpen) el.style.borderBottomColor = 'transparent'
        }}
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
          className="absolute top-full left-0 z-50 min-w-[220px]"
          style={{ backgroundColor: 'var(--bg-card)', boxShadow: '0 8px 32px rgba(0,75,107,0.18)', borderTop: '3px solid var(--gold)' }}
        >
          {item.children?.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={onClose}
              className="flex items-center gap-3 px-5 py-3 text-sm font-semibold border-b last:border-0 transition-all"
              style={{ color: 'var(--text)', borderColor: 'var(--border)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary)'
                e.currentTarget.style.color = 'white'
                e.currentTarget.style.paddingLeft = '24px'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = ''
                e.currentTarget.style.color = 'var(--text)'
                e.currentTarget.style.paddingLeft = '20px'
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--gold)' }} />
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
  const { theme, toggle } = useTheme()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data?.user ?? null))
      .catch(() => null)
  }, [pathname])

  useEffect(() => { setMobileOpen(false) }, [pathname])

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

      {/* ── Top bar ─────────────────────────────── */}
      <div style={{ backgroundColor: 'var(--topbar-bg)' }} className="text-white text-xs">
        <div className="w-full px-3 sm:px-6 flex items-center justify-between h-9 gap-2">
          <span className="hidden md:block opacity-70 truncate text-xs">{today}</span>

          <div className="flex items-center gap-2 ml-auto flex-shrink-0">
            {/* Social icons — hidden on mobile to save space */}
            <div className="hidden sm:flex items-center gap-2">
              {socialLinks.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 transition-opacity">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d={s.path} /></svg>
                </a>
              ))}
              <span className="opacity-30">|</span>
            </div>

            {/* Dark mode toggle */}
            <button
              onClick={toggle}
              aria-label="Toggle dark mode"
              className="p-1.5 rounded opacity-80 hover:opacity-100 transition-opacity flex-shrink-0"
              style={{ color: 'white' }}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>

            <span className="opacity-30 hidden sm:block">|</span>

            {user ? (
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link href="/dashboard" className="hover:text-yellow-300 transition-colors text-xs truncate max-w-[80px] sm:max-w-none">{user.name}</Link>
                <button onClick={handleLogout} className="px-2 py-1 text-xs font-bold rounded flex-shrink-0" style={{ backgroundColor: 'white', color: 'var(--primary)' }}>
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Link href="/login" className="px-2 py-1 text-xs font-bold rounded whitespace-nowrap" style={{ backgroundColor: 'white', color: 'var(--primary)' }}>
                  Login
                </Link>
                <Link href="/register" className="px-2 py-1 text-xs font-bold rounded whitespace-nowrap" style={{ backgroundColor: 'var(--gold)', color: 'var(--primary-dark)' }}>
                  Join MYC
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Logo + Nav bar ──────────────────────── */}
      <div style={{ backgroundColor: 'var(--nav-bg)', borderBottom: '3px solid var(--primary)' }}>
        <div className="w-full px-3 sm:px-6 flex items-center justify-between gap-4 py-2">

          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/Logo1.png"
              alt="Mombasa Youth Council"
              width={260}
              height={100}
              priority
              className="object-contain w-auto"
              style={{ maxHeight: '90px' }}
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-stretch flex-1 justify-end flex-wrap">
            {navItems.map((item, idx) =>
              item.href && !item.children ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center px-4 py-3 text-xs font-black tracking-widest transition-all whitespace-nowrap border-b-2 border-transparent"
                  style={{ color: 'var(--primary)' }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.color = 'var(--accent)'
                    el.style.borderBottomColor = 'var(--gold)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.color = 'var(--primary)'
                    el.style.borderBottomColor = 'transparent'
                  }}
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
              <Link href="/dashboard" className="flex items-center px-3 py-3 text-xs font-black tracking-widest ml-2 transition-colors" style={{ color: 'var(--gold)' }}>
                + NEW POST
              </Link>
            )}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 flex-shrink-0"
            style={{ color: 'var(--primary)' }}
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

      {/* ── Mobile nav ──────────────────────────── */}
      {mobileOpen && (
        <nav
          className="lg:hidden overflow-y-auto"
          style={{ backgroundColor: 'var(--primary-dark)', maxHeight: 'calc(100vh - 100px)' }}
        >
          {navItems.map((item, idx) => (
            <div key={item.label}>
              {item.href && !item.children ? (
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-5 py-3.5 text-white text-sm font-bold border-b"
                  style={{ borderColor: 'var(--primary)' }}
                >
                  {item.label}
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => setMobileExpanded(mobileExpanded === idx ? null : idx)}
                    className="w-full flex items-center justify-between px-5 py-3.5 text-white text-sm font-semibold border-b"
                    style={{ borderColor: 'var(--primary)' }}
                  >
                    {item.label}
                    <svg className={`w-4 h-4 transition-transform ${mobileExpanded === idx ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {mobileExpanded === idx && item.children?.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-8 py-3 text-sm font-medium border-b transition-colors"
                      style={{ color: 'var(--accent)', borderColor: 'var(--primary)' }}
                    >
                      <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--gold)' }} />
                      {child.label}
                    </Link>
                  ))}
                </>
              )}
            </div>
          ))}

          {/* Mobile auth */}
          <div className="px-5 py-4 flex gap-3 flex-wrap border-b" style={{ borderColor: 'var(--primary)' }}>
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="text-white text-sm font-semibold">Dashboard</Link>
                <button onClick={handleLogout} className="text-white text-sm font-semibold">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)} className="px-4 py-2 text-sm font-bold rounded" style={{ backgroundColor: 'white', color: 'var(--primary)' }}>Login</Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="px-4 py-2 text-sm font-bold rounded" style={{ backgroundColor: 'var(--gold)', color: 'var(--primary-dark)' }}>Join MYC Today</Link>
              </>
            )}
          </div>

          {/* Mobile social */}
          <div className="px-5 py-3 flex gap-4 flex-wrap">
            {socialLinks.map((s) => (
              <a key={s.label} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer" className="text-xs transition-colors" style={{ color: 'var(--accent)' }}>
                {s.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
