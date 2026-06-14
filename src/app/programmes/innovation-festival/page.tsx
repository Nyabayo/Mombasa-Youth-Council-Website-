import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Innovation Festival 2026 | Programmes | MYC' }

export default function InnovationFestivalPage() {
  return (
    <>
      <div style={{ backgroundColor: '#004B6B' }} className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-teal-200 text-xs font-bold tracking-widest uppercase mb-2">Programmes</p>
          <h1 className="text-white text-3xl font-black">Innovation Festival 2026</h1>
          <p className="text-teal-200 text-sm">Mombasa · 2026 · Young innovators collaborating</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-8">
          <Link href="/" className="hover:text-teal-700">Home</Link><span>/</span>
          <Link href="/programmes" className="hover:text-teal-700">Programmes</Link><span>/</span>
          <span className="text-gray-700">Innovation Festival 2026</span>
        </div>
        <div className="max-w-3xl">
          <p className="text-gray-700 leading-relaxed mb-5 text-lg">
            Strategic workplans that turn youth-led ideas — entrepreneurship, creative industries, social impact —
            into tangible action.
          </p>
          <p className="text-gray-700 leading-relaxed mb-5">
            The Innovation Festival 2026 will bring together young innovators, entrepreneurs, and change-makers
            from across Mombasa County to showcase solutions, pitch ideas, and build partnerships.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[
              { icon: '🎪', label: 'Innovation Showcases' },
              { icon: '🏆', label: 'Pitch Competitions' },
              { icon: '👥', label: 'Mentorship Sessions' },
              { icon: '🤝', label: 'Networking Opportunities' },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-2xl">{f.icon}</span>
                <span className="font-semibold text-gray-800">{f.label}</span>
              </div>
            ))}
          </div>
          <Link href="/register" style={{ backgroundColor: '#004B6B' }} className="inline-block px-6 py-3 text-white font-bold rounded hover:opacity-90">
            Join MYC Today
          </Link>
          <div className="mt-6">
            <Link href="/programmes" className="text-teal-700 hover:underline text-sm font-semibold">← Back to Programmes</Link>
          </div>
        </div>
      </div>
    </>
  )
}
