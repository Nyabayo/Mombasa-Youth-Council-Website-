import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Speeches & Statements | President | MYC' }

const speeches = [
  { date: '2026-06-10', title: 'Remarks at the Launch of Innovation Festival 2026', venue: 'Mombasa' },
  { date: '2026-06-01', title: 'Address at the Adoption of the MYC Governance Framework', venue: 'Mombasa' },
  { date: '2026-05-28', title: 'Statement on Youth Empowerment and Inclusive Leadership', venue: 'Mombasa County Youth Forum' },
]

export default function PresidentSpeechesPage() {
  return (
    <>
      <div style={{ backgroundColor: 'var(--primary)' }} className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-[#00A8C8] text-xs font-bold tracking-widest uppercase mb-2">Office of the President</p>
          <h1 className="text-white text-3xl font-black">Speeches &amp; Statements</h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-8">
          <Link href="/" className="hover:text-teal-700">Home</Link><span>/</span>
          <Link href="/president" className="hover:text-teal-700">The President</Link><span>/</span>
          <span className="text-gray-700">Speeches</span>
        </div>
        <div className="max-w-3xl space-y-4">
          {speeches.map((s) => (
            <div key={s.title} className="p-5 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <p className="text-xs text-gray-400 mb-1">{new Date(s.date).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })} · {s.venue}</p>
              <h3 className="font-bold text-gray-900">{s.title}</h3>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link href="/president" className="text-teal-700 hover:underline text-sm font-semibold">← Back to The President</Link>
        </div>
      </div>
    </>
  )
}
