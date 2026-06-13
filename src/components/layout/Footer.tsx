import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{ backgroundColor: '#001a52' }} className="text-gray-300 mt-auto">
      {/* Gold accent bar */}
      <div style={{ backgroundColor: '#002673' }} className="h-1" />

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center border-2 flex-shrink-0"
              style={{ backgroundColor: '#002673', borderColor: 'white' }}
            >
              <span className="font-black text-sm text-white">MYC</span>
            </div>
            <div>
              <div className="text-white font-bold leading-tight">Mombasa Youth Council</div>
              <div className="text-xs opacity-60">By Youth, For Youth</div>
            </div>
          </div>
          <p className="text-sm leading-relaxed opacity-75">
            A structured space where young people lead. MYC brings together young people aged 18 to
            34, creating an active platform for engagement in governance, innovation, and community
            development.
          </p>
          {/* Social icons */}
          <div className="flex flex-wrap gap-3 mt-5">
            {[
              { label: 'Facebook', path: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
              { label: 'X', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
              { label: 'TikTok', path: 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.16 8.16 0 004.78 1.53V6.77a4.85 4.85 0 01-1.01-.08z' },
              { label: 'LinkedIn', path: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zm2-7a2 2 0 110 4 2 2 0 010-4z' },
              { label: 'Instagram', path: 'M8 2h8a6 6 0 016 6v8a6 6 0 01-6 6H8a6 6 0 01-6-6V8a6 6 0 016-6zm0 2a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4V8a4 4 0 00-4-4H8zm4 3a5 5 0 110 10A5 5 0 0112 7zm0 2a3 3 0 100 6 3 3 0 000-6zm5-2.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z' },
              { label: 'YouTube', path: 'M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z' },
              { label: 'WhatsApp', path: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z' },
            ].map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
                style={{ backgroundColor: '#003087' }}
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold uppercase tracking-widest text-xs mb-4 text-white">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            {[
              { label: 'The President', href: '/president' },
              { label: 'The Deputy President', href: '/deputy-president' },
              { label: 'Governance Structure', href: '/governance' },
              { label: 'What We Do', href: '/programmes' },
              { label: 'Posts & Media', href: '/posts' },
              { label: 'About MYC', href: '/about' },
              { label: 'Contact Us', href: '/contact' },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="opacity-75 hover:opacity-100 hover:text-white transition-all">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Programmes */}
        <div>
          <h3 className="font-semibold uppercase tracking-widest text-xs mb-4 text-white">
            Programmes
          </h3>
          <ul className="space-y-2 text-sm">
            {[
              { label: 'Innovation Festival 2026', href: '/programmes/innovation-festival' },
              { label: '#SheriaYaVijana', href: '/programmes/sheria-ya-vijana' },
              { label: 'Leadership Training', href: '/programmes/leadership-training' },
              { label: 'Youth Assembly', href: '/governance/youth-assembly' },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="opacity-75 hover:opacity-100 hover:text-white transition-all">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold uppercase tracking-widest text-xs mb-4 text-white">
            Contact
          </h3>
          <ul className="space-y-3 text-sm">
            {[
              { icon: '📍', text: 'Mombasa County, Kenya' },
              { icon: '✉️', text: 'info@myc.co.ke' },
              { icon: '📞', text: '+254 700 000 000' },
            ].map((item) => (
              <li key={item.text} className="flex items-start gap-2 opacity-80">
                <span className="flex-shrink-0">{item.icon}</span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5">
            <Link
              href="/register"
              className="inline-block px-4 py-2 text-sm font-bold rounded hover:opacity-90 transition-opacity"
              style={{ backgroundColor: 'white', color: '#003087' }}
            >
              Join MYC Today
            </Link>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: '#001230', borderTop: '1px solid #002673' }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs opacity-50">
          <span>© {year} Mombasa Youth Council. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/about" className="hover:opacity-100 transition-opacity">Privacy Policy</Link>
            <Link href="/about" className="hover:opacity-100 transition-opacity">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
