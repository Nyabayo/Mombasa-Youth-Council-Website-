import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Leadership Training | Programmes | MYC' }

export default function LeadershipTrainingPage() {
  return (
    <>
      <div style={{ backgroundColor: '#004B6B' }} className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-teal-200 text-xs font-bold tracking-widest uppercase mb-2">Programmes</p>
          <h1 className="text-white text-3xl font-black">Leadership Training</h1>
          <p className="text-teal-200 text-sm">In partnership with the Kenya Red Cross</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-8">
          <Link href="/" className="hover:text-teal-700">Home</Link><span>/</span>
          <Link href="/programmes" className="hover:text-teal-700">Programmes</Link><span>/</span>
          <span className="text-gray-700">Leadership Training</span>
        </div>
        <div className="max-w-3xl space-y-5">
          <p className="text-gray-700 leading-relaxed text-lg">
            In partnership with the <strong>Kenya Red Cross Society</strong>, MYC equips young people with the
            skills, values, and tools needed to become effective grassroots leaders and change-makers.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              'Disaster Response and Management',
              'Community Health Advocacy',
              'Leadership and Organizational Skills',
              'Conflict Resolution',
              'Social Cohesion',
              'Practical Community Projects',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded">
                <span className="text-blue-600 font-bold">✓</span>
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-600 text-sm p-4 rounded" style={{ backgroundColor: '#e8f7fb' }}>
            Applications for training cohorts open periodically. Young people from all sub-counties of Mombasa
            are encouraged to apply.
          </p>
          <Link href="/register" style={{ backgroundColor: '#004B6B' }} className="inline-block px-6 py-3 text-white font-bold rounded hover:opacity-90">
            Join MYC Today
          </Link>
          <div>
            <Link href="/programmes" className="text-teal-700 hover:underline text-sm font-semibold">← Back to Programmes</Link>
          </div>
        </div>
      </div>
    </>
  )
}
