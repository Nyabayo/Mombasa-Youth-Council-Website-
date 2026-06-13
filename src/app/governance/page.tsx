import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Governance Structure | Mombasa Youth Council',
  description: 'The governance structure of the Mombasa Youth Council (MYC)',
}

export default function GovernancePage() {
  return (
    <>
      <div style={{ backgroundColor: '#003087' }} className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-blue-200 text-xs font-bold tracking-widest uppercase mb-2">Council Structure</p>
          <h1 className="text-white text-3xl sm:text-4xl font-black mb-1">Governance Structure</h1>
          <p className="text-blue-200 text-sm">Mombasa Youth Council (MYC)</p>
        </div>
      </div>
      <div style={{ backgroundColor: '#f5f5f5' }} className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-blue-700">Home</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">Governance</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          <main className="flex-1">
            <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-3xl">
              The Mombasa Youth Council shall operate through distinct but complementary organs to ensure
              effective leadership, representation, accountability, and inclusivity.
            </p>

            {/* Organ 1 */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <div style={{ backgroundColor: 'white', color: '#003087' }} className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0">1</div>
                <h2 className="text-2xl font-black text-gray-900">The Administration (Executive Arm)</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Administration shall be responsible for the day-to-day management, implementation of programmes,
                execution of policies, and coordination of Council activities.
              </p>
              <p className="text-gray-700 mb-4 font-semibold">The Administration shall consist of:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                {[
                  { title: 'The President', name: 'His Exc. Antigoals Ray', href: '/president' },
                  { title: 'The Deputy President', name: 'Her Exc. Khadija Jilo', href: '/deputy-president' },
                  { title: 'The Executive Committee', name: 'Cabinet Members', href: '/governance/administration' },
                  { title: 'The Secretary General', name: 'Administrative Lead', href: '/governance/administration' },
                  { title: 'The Treasurer', name: 'Financial Oversight', href: '/governance/administration' },
                  { title: 'Cabinet Secretaries', name: 'Portfolio Holders', href: '/governance/administration' },
                ].map((m) => (
                  <Link key={m.title} href={m.href} className="group block p-4 bg-white border border-gray-200 rounded hover:border-blue-600 hover:shadow-md transition-all">
                    <div style={{ backgroundColor: '#003087' }} className="w-8 h-8 rounded-full flex items-center justify-center mb-3">
                      <span className="text-white text-xs font-bold">🏛</span>
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm group-hover:text-blue-700 mb-1">{m.title}</h4>
                    <p className="text-xs text-gray-500">{m.name}</p>
                  </Link>
                ))}
              </div>
            </section>

            {/* Organ 2 */}
            <section className="mb-10 p-6 rounded-lg border-l-4" style={{ backgroundColor: '#eff6ff', borderColor: '#003087' }}>
              <div className="flex items-center gap-3 mb-5">
                <div style={{ backgroundColor: '#003087' }} className="w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0">2</div>
                <h2 className="text-2xl font-black text-gray-900">The Youth Assembly (Representative &amp; Oversight Arm)</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Youth Assembly shall be the representative organ of the Council and shall provide oversight,
                accountability, and policy guidance.
              </p>
              <p className="text-gray-700 mb-3 font-semibold">The Youth Assembly shall:</p>
              <ul className="space-y-2 mb-5">
                {[
                  'Represent the interests and views of members.',
                  'Debate and adopt policies, motions, and resolutions.',
                  'Exercise oversight over the Administration.',
                  'Review reports submitted by the Executive.',
                  'Promote transparency, accountability, and good governance.',
                  'Approve constitutional amendments and other matters as provided by this Constitution.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-gray-700 text-sm">
                    <span className="text-blue-600 mt-0.5 flex-shrink-0">✔</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-sm font-semibold text-gray-800 p-3 rounded" style={{ backgroundColor: '#eff6ff' }}>
                ⚖️ The Youth Assembly shall operate independently and shall not be subject to interference by the
                Administration in the execution of its constitutional mandate.
              </p>
            </section>

            {/* Organ 3 */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <div style={{ backgroundColor: 'white', color: '#003087' }} className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0">3</div>
                <h2 className="text-2xl font-black text-gray-900">Committees</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-5">
                The Council may establish standing or ad hoc committees to support the work of the Administration
                and the Youth Assembly.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'Finance and Budget Committee', icon: '💰', desc: 'Oversight of Council finances and budget planning.' },
                  { name: 'Vetting and House Business Committee', icon: '📋', desc: 'Vetting of appointments and management of assembly business.' },
                  { name: 'Governance and Constitutional Affairs', icon: '📜', desc: 'Constitutional interpretation and governance matters.' },
                  { name: 'Youth Empowerment and Innovation', icon: '💡', desc: 'Driving youth empowerment programmes and innovation initiatives.' },
                  { name: 'Disciplinary Committee', icon: '⚖️', desc: 'Maintaining discipline and resolving disputes within the Council.' },
                  { name: 'Events and Programs Committee', icon: '📅', desc: 'Planning and coordinating Council events and programmes.' },
                ].map((c) => (
                  <div key={c.name} className="flex gap-4 p-4 bg-white border border-gray-200 rounded-lg">
                    <span className="text-2xl flex-shrink-0">{c.icon}</span>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-1">{c.name}</h4>
                      <p className="text-xs text-gray-600">{c.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>

          <aside className="lg:w-64">
            <div className="bg-white border border-gray-200 mb-4">
              <div style={{ backgroundColor: '#003087' }} className="px-4 py-3">
                <h3 className="text-white font-bold text-sm">Governance</h3>
              </div>
              <div className="p-1">
                {[
                  { label: 'Governance Structure', href: '/governance' },
                  { label: 'Youth Assembly', href: '/governance/youth-assembly' },
                  { label: 'Committees', href: '/governance/committees' },
                  { label: 'Administration', href: '/governance/administration' },
                ].map((l) => (
                  <Link key={l.href} href={l.href} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-700 hover:text-white border-b border-gray-100 last:border-0 transition-colors">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
