import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '#SheriaYaVijana | Programmes | MYC' }

export default function SheriaYaVijanaPage() {
  return (
    <>
      <div style={{ backgroundColor: '#003087' }} className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-blue-200 text-xs font-bold tracking-widest uppercase mb-2">Advocacy</p>
          <h1 className="text-white text-3xl font-black">#SheriaYaVijana</h1>
          <p className="text-blue-200 text-sm">Youth voices in policy — shaping the laws that affect our lives</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-8">
          <Link href="/" className="hover:text-blue-700">Home</Link><span>/</span>
          <Link href="/programmes" className="hover:text-blue-700">Programmes</Link><span>/</span>
          <span className="text-gray-700">#SheriaYaVijana</span>
        </div>
        <div className="max-w-3xl space-y-5">
          <p className="text-gray-700 leading-relaxed text-lg">
            Through <strong>#SheriaYaVijana</strong>, MYC engages young people in policy conversations so they
            understand and influence the laws that shape their lives.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Young Mombasa advocates are engaging county and national government institutions, demanding formalized
            channels for youth input in policy development and resource allocation for youth-led advocacy.
          </p>
          <blockquote className="border-l-4 border-blue-700 pl-4 italic text-gray-600 py-2">
            &ldquo;Support from allied leaders has reinforced the council&apos;s legitimacy, pushing back against efforts
            to sideline youth participation in governance.&rdquo;
          </blockquote>
          <Link href="/register" style={{ backgroundColor: '#003087' }} className="inline-block px-6 py-3 text-white font-bold rounded hover:opacity-90">
            Join the Movement
          </Link>
          <div>
            <Link href="/programmes" className="text-blue-700 hover:underline text-sm font-semibold">← Back to Programmes</Link>
          </div>
        </div>
      </div>
    </>
  )
}
