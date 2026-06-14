import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Administration | Governance | MYC' }

export default function AdministrationPage() {
  return (
    <>
      <div style={{ backgroundColor: 'var(--primary)' }} className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-[#00A8C8] text-xs font-bold tracking-widest uppercase mb-2">Governance</p>
          <h1 className="text-white text-3xl font-black">The Administration</h1>
          <p className="text-[#00A8C8] text-sm">Executive Arm of the Mombasa Youth Council</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-8">
          <Link href="/" className="hover:text-teal-700">Home</Link><span>/</span>
          <Link href="/governance" className="hover:text-teal-700">Governance</Link><span>/</span>
          <span className="text-gray-700">Administration</span>
        </div>
        <div className="max-w-4xl">
          <p className="text-gray-700 leading-relaxed mb-8">
            The Administration is responsible for the day-to-day management, implementation of programmes,
            execution of policies, and coordination of Council activities.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: 'President', name: 'His Exc. Antigoals Ray', href: '/president', initials: 'AR' },
              { title: 'Deputy President', name: 'Her Exc. Khadija Jilo', href: '/deputy-president', initials: 'KJ' },
              { title: 'Secretary General', name: 'To Be Announced', href: '#', initials: 'SG' },
              { title: 'Treasurer', name: 'To Be Announced', href: '#', initials: 'TR' },
              { title: 'Cabinet Secretaries', name: 'Portfolio Holders', href: '#', initials: 'CS' },
              { title: 'Executive Committee', name: 'Committee Members', href: '#', initials: 'EC' },
            ].map((m) => (
              <Link key={m.title} href={m.href} className="group block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div style={{ backgroundColor: 'var(--primary)' }} className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                    <span className="text-white font-black text-sm">{m.initials}</span>
                  </div>
                  <div className="text-white">
                    <p className="text-xs text-[#00A8C8] uppercase tracking-wide">{m.title}</p>
                    <p className="font-bold text-sm">{m.name}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/governance" className="text-teal-700 hover:underline text-sm font-semibold">← Back to Governance</Link>
          </div>
        </div>
      </div>
    </>
  )
}
