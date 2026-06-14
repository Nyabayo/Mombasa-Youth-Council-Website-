import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Committees | Governance | MYC' }

export default function CommitteesPage() {
  return (
    <>
      <div style={{ backgroundColor: 'var(--primary)' }} className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-[#00A8C8] text-xs font-bold tracking-widest uppercase mb-2">Governance</p>
          <h1 className="text-white text-3xl font-black">Committees</h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-8">
          <Link href="/" className="hover:text-teal-700">Home</Link><span>/</span>
          <Link href="/governance" className="hover:text-teal-700">Governance</Link><span>/</span>
          <span className="text-gray-700">Committees</span>
        </div>
        <div className="max-w-4xl">
          <p className="text-gray-700 leading-relaxed mb-8">
            The Council may establish standing or ad hoc committees to support the work of the Administration and
            the Youth Assembly.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { name: 'Finance and Budget Committee', icon: '💰', desc: 'Oversight of Council finances and budget planning.' },
              { name: 'Vetting and House Business Committee', icon: '🔍', desc: 'Vetting appointments and managing assembly business.' },
              { name: 'Governance and Constitutional Affairs', icon: '📜', desc: 'Constitutional interpretation and governance matters.' },
              { name: 'Youth Empowerment and Innovation', icon: '💡', desc: 'Youth empowerment programmes and innovation.' },
              { name: 'Disciplinary Committee', icon: '⚖️', desc: 'Maintaining discipline and resolving disputes.' },
              { name: 'Events and Programs Committee', icon: '📅', desc: 'Planning and coordinating Council events.' },
            ].map((c) => (
              <div key={c.name} className="p-5 bg-white border border-gray-200 rounded-lg flex gap-4">
                <span className="text-3xl flex-shrink-0">{c.icon}</span>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{c.name}</h4>
                  <p className="text-sm text-gray-600">{c.desc}</p>
                </div>
              </div>
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
