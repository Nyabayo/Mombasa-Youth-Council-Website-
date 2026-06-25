import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Secretary General Nasib Juma | Mombasa Youth Council',
  description: 'Nasib Juma, Secretary General of the Mombasa Youth Council',
}

export default function SecretaryGeneralPage() {
  return (
    <>
      {/* Banner */}
      <div style={{ backgroundColor: 'var(--primary)' }} className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-[#00A8C8] text-xs font-bold tracking-widest uppercase mb-2">Mombasa Youth Council</p>
          <h1 className="text-white text-3xl sm:text-4xl font-black mb-1">Nasib Juma</h1>
          <p className="text-[#00A8C8] text-sm">Secretary General, Mombasa Youth Council (MYC)</p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={{ backgroundColor: 'var(--bg-alt)' }} className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-teal-700">Home</Link>
          <span>/</span>
          <Link href="/governance/administration" className="hover:text-teal-700">Administration</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">Secretary General</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          <main className="flex-1 min-w-0">

            {/* Profile card */}
            <div style={{ backgroundColor: 'var(--primary)' }} className="overflow-hidden mb-12">
              <div className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-80 lg:w-96 aspect-square flex-shrink-0 overflow-hidden border-b-4 sm:border-b-0 sm:border-r-4 border-white">
                  <img
                    src="/secretary-general.jpeg"
                    alt="Nasib Juma, Secretary General"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="text-white p-8 flex flex-col justify-center">
                  <p className="text-[#00A8C8] text-xs tracking-widest uppercase font-bold mb-2">Secretary General</p>
                  <h2 className="text-4xl font-black mb-2">Nasib Juma</h2>
                  <p className="text-xl font-semibold opacity-90 mb-2">Secretary General</p>
                  <p className="opacity-70">Mombasa Youth Council (MYC)</p>
                  <p className="text-sm opacity-70 mt-1">Appointed 2026 · Mombasa County, Kenya</p>
                </div>
              </div>
            </div>

            {/* About the Office */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-5">
                <div style={{ backgroundColor: 'var(--primary)' }} className="w-1 h-7 flex-shrink-0" />
                <h2 className="text-2xl font-black text-gray-900">About the Office</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Nasib Juma serves as the Secretary General of the Mombasa Youth Council, a critical administrative
                  and coordination role within the Council&apos;s executive structure. The Secretary General is
                  the principal administrator responsible for the efficient running of Council operations, records
                  management, and inter-departmental coordination.
                </p>
                <p>
                  As Secretary General, Nasib Juma acts as the custodian of the Council&apos;s institutional memory,
                  ensuring that decisions, resolutions, and official records are documented and maintained with
                  the highest standards of accuracy and confidentiality.
                </p>
                <p>
                  The Secretary General works closely with the President, Deputy President, and all Cabinet
                  Secretaries to facilitate the smooth implementation of the Council&apos;s agenda, coordinate
                  meetings, and manage official correspondence on behalf of the Council.
                </p>
              </div>
            </section>

            {/* Key Responsibilities */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-5">
                <div style={{ backgroundColor: 'var(--primary)' }} className="w-1 h-7 flex-shrink-0" />
                <h2 className="text-2xl font-black text-gray-900">Key Responsibilities</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: '📋', title: 'Records Management', desc: 'Maintaining accurate records of Council meetings, decisions, and official correspondence.' },
                  { icon: '🤝', title: 'Coordination', desc: 'Facilitating inter-departmental coordination and ensuring smooth Council operations.' },
                  { icon: '📅', title: 'Meeting Management', desc: 'Organizing, scheduling, and managing Council meetings and official engagements.' },
                  { icon: '📝', title: 'Official Communications', desc: 'Managing official correspondence and communications on behalf of the Council.' },
                  { icon: '🏛️', title: 'Institutional Memory', desc: 'Serving as the custodian of the Council\'s history, policies, and official documentation.' },
                  { icon: '⚙️', title: 'Administrative Oversight', desc: 'Overseeing day-to-day administrative functions and ensuring compliance with Council policies.' },
                ].map((f) => (
                  <div key={f.title} className="flex gap-4 p-4 bg-gray-50 border border-gray-200">
                    <span className="text-2xl flex-shrink-0">{f.icon}</span>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">{f.title}</h4>
                      <p className="text-sm text-gray-600">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Statement */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-5">
                <div style={{ backgroundColor: 'var(--primary)' }} className="w-1 h-7 flex-shrink-0" />
                <h2 className="text-2xl font-black text-gray-900">Statement from the Secretary General</h2>
              </div>
              <div className="p-6 border-l-4" style={{ borderColor: 'var(--gold)', backgroundColor: 'var(--bg-alt)' }}>
                <p className="text-gray-800 italic leading-relaxed text-lg">
                  "The strength of any organization lies in how well it is administered. My commitment is to
                  ensure that the Mombasa Youth Council operates with the highest standards of professionalism,
                  efficiency, and transparency, so that our leadership can focus on what matters most: serving
                  the youth of Mombasa County."
                </p>
                <p className="text-sm font-bold text-teal-700 mt-3">Nasib Juma, Secretary General, MYC</p>
              </div>
            </section>

          </main>

          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white border border-gray-200 p-4">
              <h4 className="font-bold text-gray-900 mb-3">Administration</h4>
              <div className="space-y-2">
                <Link href="/president" className="block text-sm text-teal-700 hover:underline">The President →</Link>
                <Link href="/deputy-president" className="block text-sm text-teal-700 hover:underline">The Deputy President →</Link>
                <Link href="/cabinet-secretary" className="block text-sm text-teal-700 hover:underline">CS Finance →</Link>
                <Link href="/speaker" className="block text-sm text-teal-700 hover:underline">The Speaker →</Link>
                <Link href="/minority-leader" className="block text-sm text-teal-700 hover:underline">Minority Leader →</Link>
                <Link href="/governance" className="block text-sm text-teal-700 hover:underline">Governance Structure →</Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
