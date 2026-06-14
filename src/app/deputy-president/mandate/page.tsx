import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Leadership Mandate | Deputy President | MYC' }

export default function MandatePage() {
  return (
    <>
      <div style={{ backgroundColor: 'var(--primary)' }} className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-[#00A8C8] text-xs font-bold tracking-widest uppercase mb-2">Office of the Deputy President</p>
          <h1 className="text-white text-3xl font-black">Leadership Mandate</h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-8">
          <Link href="/" className="hover:text-teal-700">Home</Link><span>/</span>
          <Link href="/deputy-president" className="hover:text-teal-700">Deputy President</Link><span>/</span>
          <span className="text-gray-700">Mandate</span>
        </div>
        <div className="max-w-3xl space-y-4 text-gray-700 leading-relaxed">
          <p>
            Deputy President Khadija Jilo serves as the principal assistant to the President and supports the
            implementation of the vision, mission, and objectives of the Mombasa Youth Council.
          </p>
          <p>
            Her leadership mandate includes coordinating youth programmes, strengthening stakeholder engagement,
            promoting participation in governance, and supporting initiatives in education, entrepreneurship,
            innovation, and leadership development.
          </p>
          <div className="p-4 rounded-lg border-l-4 border-blue-300" style={{ backgroundColor: 'var(--bg-alt)' }}>
            <strong>Constitutional Role:</strong> In the absence of the President, the Deputy President shall
            perform the functions and duties of the Office of the President.
          </div>
          <Link href="/deputy-president" className="text-teal-700 hover:underline text-sm font-semibold">← Back to Deputy President</Link>
        </div>
      </div>
    </>
  )
}
