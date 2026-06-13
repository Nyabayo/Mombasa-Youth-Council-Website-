import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Policy Platform | President | MYC' }

export default function PolicyPlatformPage() {
  return (
    <>
      <div style={{ backgroundColor: '#003087' }} className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-blue-200 text-xs font-bold tracking-widest uppercase mb-2">Office of the President</p>
          <h1 className="text-white text-3xl font-black">Policy Platform</h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-8">
          <Link href="/" className="hover:text-blue-700">Home</Link><span>/</span>
          <Link href="/president" className="hover:text-blue-700">The President</Link><span>/</span>
          <span className="text-gray-700">Policy Platform</span>
        </div>
        <div className="max-w-3xl">
          <p className="text-gray-700 leading-relaxed mb-6">
            President Ray was elected to lead the Mombasa Youth Council on a platform centered on youth
            empowerment, inclusivity, leadership development, civic participation, innovation, and sustainable
            opportunities for young people across Mombasa County.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'Youth Employment', desc: 'Pathways to employment and entrepreneurship.' },
              { title: 'Education', desc: 'Quality education and skills development.' },
              { title: 'Climate Action', desc: 'Youth-led environmental sustainability.' },
              { title: 'Talent Development', desc: 'Sports, arts, culture, and creative industries.' },
              { title: 'Social Inclusion', desc: 'No young person left behind.' },
              { title: 'Civic Participation', desc: 'Active youth engagement in governance.' },
            ].map((p) => (
              <div key={p.title} className="p-4 bg-white border border-gray-200 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-1">{p.title}</h4>
                <p className="text-sm text-gray-600">{p.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/president" className="text-blue-700 hover:underline text-sm font-semibold">← Back to The President</Link>
          </div>
        </div>
      </div>
    </>
  )
}
