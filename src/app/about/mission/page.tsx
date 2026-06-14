import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Mission & Vision | About | MYC' }

export default function MissionPage() {
  return (
    <>
      <div style={{ backgroundColor: 'var(--primary)' }} className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-[#00A8C8] text-xs font-bold tracking-widest uppercase mb-2">About MYC</p>
          <h1 className="text-white text-3xl font-black">Mission &amp; Vision</h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-8">
          <Link href="/" className="hover:text-teal-700">Home</Link><span>/</span>
          <Link href="/about" className="hover:text-teal-700">About</Link><span>/</span>
          <span className="text-gray-700">Mission &amp; Vision</span>
        </div>
        <div className="max-w-3xl space-y-8">
          <div className="p-6 bg-white border-l-4 border-teal-700 rounded-lg shadow-sm">
            <h2 className="text-xl font-black text-gray-900 mb-3">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              To champion the interests of young people in Mombasa County through advocacy, capacity building,
              strategic partnerships, and meaningful engagement in governance and development processes —
              positioning youth as active agents of change.
            </p>
          </div>
          <div className="p-6 bg-white border-l-4 border-teal-700 rounded-lg shadow-sm">
            <h2 className="text-xl font-black text-gray-900 mb-3">Our Vision</h2>
            <p className="text-gray-700 leading-relaxed">
              A united, empowered, and progressive youth movement that serves as the strong and credible voice
              for the youth of Mombasa County — one that promotes transparency, accountability, equal
              representation, and active participation in decision-making.
            </p>
          </div>
          <div className="p-6 bg-white border-l-4 border-blue-400 rounded-lg shadow-sm">
            <h2 className="text-xl font-black text-gray-900 mb-3">Our Values</h2>
            <div className="grid grid-cols-2 gap-3">
              {['Transparency', 'Accountability', 'Inclusivity', 'Youth Empowerment', 'Non-Partisanship', 'Innovation'].map((v) => (
                <div key={v} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-blue-600">✓</span> {v}
                </div>
              ))}
            </div>
          </div>
          <Link href="/about" className="text-teal-700 hover:underline text-sm font-semibold">← Back to About MYC</Link>
        </div>
      </div>
    </>
  )
}
