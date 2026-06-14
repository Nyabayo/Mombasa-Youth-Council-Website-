import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Youth Assembly | MYC' }

export default function YouthAssemblyPage() {
  return (
    <>
      <div style={{ backgroundColor: '#004B6B' }} className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-teal-200 text-xs font-bold tracking-widest uppercase mb-2">Governance</p>
          <h1 className="text-white text-3xl font-black">The Youth Assembly</h1>
          <p className="text-teal-200 text-sm">Representative &amp; Oversight Organ of the MYC</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-8">
          <Link href="/" className="hover:text-teal-700">Home</Link><span>/</span>
          <Link href="/governance" className="hover:text-teal-700">Governance</Link><span>/</span>
          <span className="text-gray-700">Youth Assembly</span>
        </div>
        <div className="max-w-3xl space-y-5">
          <p className="text-gray-700 leading-relaxed text-lg">
            The Youth Assembly is the representative organ of the Council, providing oversight, accountability,
            and policy guidance. It operates independently of the Administration.
          </p>
          <h3 className="text-xl font-black text-gray-900">Mandate</h3>
          <ul className="space-y-3">
            {[
              'Represent the interests and views of all MYC members.',
              'Debate and adopt policies, motions, and resolutions.',
              'Exercise oversight over the Administration.',
              'Review reports submitted by the Executive.',
              'Promote transparency, accountability, and good governance.',
              'Approve constitutional amendments.',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-gray-700">
                <span className="text-blue-600 font-bold mt-0.5">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <div className="p-4 rounded-lg border-l-4 border-blue-300" style={{ backgroundColor: '#e8f7fb' }}>
            <strong>Independence Clause:</strong> The Youth Assembly shall operate independently and shall not be
            subject to interference by the Administration in the execution of its constitutional mandate.
          </div>
          <Link href="/governance" className="text-teal-700 hover:underline text-sm font-semibold">← Back to Governance</Link>
        </div>
      </div>
    </>
  )
}
