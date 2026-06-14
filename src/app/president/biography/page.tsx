import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Biography | President | MYC' }

export default function PresidentBioPage() {
  return (
    <>
      <div style={{ backgroundColor: 'var(--primary)' }} className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-[#00A8C8] text-xs font-bold tracking-widest uppercase mb-2">Office of the President</p>
          <h1 className="text-white text-3xl font-black">Biography</h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-8">
          <Link href="/" className="hover:text-teal-700">Home</Link><span>/</span>
          <Link href="/president" className="hover:text-teal-700">The President</Link><span>/</span>
          <span className="text-gray-700">Biography</span>
        </div>
        <div className="max-w-3xl">
          <h2 className="text-2xl font-black text-gray-900 mb-5">His Excellency Antigoals Ray</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            His Excellency Antigoals Ray is the President of the Mombasa Youth Council (MYC), elected on a
            platform of youth empowerment, inclusive governance, innovation, and sustainable opportunity for
            all young people in Mombasa County.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            A dedicated youth leader and advocate, President Ray has committed his leadership to building a
            council that is transparent, accountable, and representative of the diverse voices of young people
            across all six sub-counties of Mombasa.
          </p>
          <p className="text-gray-700 leading-relaxed">
            His vision for the Mombasa Youth Council is one of a united and independent youth movement — one that
            champions youth interests through advocacy, capacity building, strategic partnerships, and meaningful
            engagement in governance and development.
          </p>
          <div className="mt-8">
            <Link href="/president" className="text-teal-700 hover:underline text-sm font-semibold">← Back to The President</Link>
          </div>
        </div>
      </div>
    </>
  )
}
