import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Minority Leader Kibwana Hamisi Juma | Mombasa Youth Council',
  description: 'Minority Leader Kibwana Hamisi Juma of the Mombasa Youth Council Youth Assembly',
}

export default function MinorityLeaderPage() {
  return (
    <>
      {/* Banner */}
      <div style={{ backgroundColor: 'var(--primary)' }} className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-[#00A8C8] text-xs font-bold tracking-widest uppercase mb-2">Mombasa Youth Council</p>
          <h1 className="text-white text-3xl sm:text-4xl font-black mb-1">Minority Leader Kibwana Hamisi Juma</h1>
          <p className="text-[#00A8C8] text-sm">Minority Leader, Mombasa Youth Council Youth Assembly</p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={{ backgroundColor: '#f5f5f5' }} className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-teal-700">Home</Link>
          <span>/</span>
          <Link href="/governance/administration" className="hover:text-teal-700">Administration</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">Minority Leader Kibwana Hamisi Juma</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main content */}
          <main className="flex-1 min-w-0">

            {/* Profile card */}
            <div style={{ backgroundColor: 'var(--primary)' }} className="overflow-hidden mb-12">
              <div className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-80 lg:w-96 aspect-square flex-shrink-0 overflow-hidden border-b-4 sm:border-b-0 sm:border-r-4 border-white">
                  <img
                    src="/MINORITY Leader Kibwana Hamisi Juma.jpeg"
                    alt="Minority Leader Kibwana Hamisi Juma"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-white p-8 flex flex-col justify-center">
                  <p className="text-[#00A8C8] text-xs tracking-widest uppercase font-bold mb-2">Minority Leader</p>
                  <h2 className="text-4xl font-black mb-2">Kibwana Hamisi Juma</h2>
                  <p className="text-xl font-semibold opacity-90 mb-2">Minority Leader, Youth Assembly</p>
                  <p className="opacity-70">Mombasa Youth Council (MYC)</p>
                  <p className="text-sm opacity-70 mt-1">Elected 2026 · Mombasa County, Kenya</p>
                </div>
              </div>
            </div>

            {/* Biography */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-5">
                <div style={{ backgroundColor: 'var(--primary)' }} className="w-1 h-7 flex-shrink-0" />
                <h2 className="text-2xl font-black text-gray-900">Biography</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Kibwana Hamisi Juma serves as the Minority Leader of the Mombasa Youth Council&apos;s Youth
                  Assembly, representing the official opposition within the Council&apos;s legislative structure.
                  His role is critical in ensuring that governance at MYC remains balanced, contested, and
                  accountable.
                </p>
                <p>
                  As Minority Leader, Kibwana provides an essential check on the majority, championing
                  alternative perspectives and ensuring that the interests of all youth, regardless of
                  political affiliation, are represented in the Assembly&apos;s deliberations.
                </p>
                <p>
                  Kibwana Hamisi Juma has a strong track record in grassroots advocacy, community
                  organizing, and youth mobilization across Mombasa County. His commitment to democratic
                  values and principled opposition makes him a vital voice in the Council&apos;s governance.
                </p>
              </div>
            </section>

            {/* Role */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-5">
                <div style={{ backgroundColor: 'var(--primary)' }} className="w-1 h-7 flex-shrink-0" />
                <h2 className="text-2xl font-black text-gray-900">Role of the Minority Leader</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: '⚖️', title: 'Democratic Opposition', desc: 'Leading the minority bloc in principled, constructive opposition within the Assembly.' },
                  { icon: '🗣️', title: 'Alternative Voice', desc: 'Presenting alternative policies and viewpoints to ensure balanced governance.' },
                  { icon: '🔍', title: 'Accountability', desc: 'Holding the majority and Council leadership accountable through robust debate.' },
                  { icon: '🤝', title: 'Bipartisan Collaboration', desc: 'Working across divides where youth interests demand unified action.' },
                  { icon: '📋', title: 'Minority Rights', desc: 'Protecting the rights and representation of minority voices in all Assembly matters.' },
                  { icon: '🌍', title: 'Civic Participation', desc: 'Encouraging broader youth participation in democratic and governance processes.' },
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
                <h2 className="text-2xl font-black text-gray-900">Statement from the Minority Leader</h2>
              </div>
              <div className="p-6 border-l-4" style={{ borderColor: 'var(--primary)', backgroundColor: 'var(--bg-alt)' }}>
                <p className="text-gray-800 italic leading-relaxed text-lg">
                  "A strong democracy needs a strong opposition. We are not here to obstruct. We are here
                  to question, to challenge, and to ensure that the decisions made in this Assembly truly
                  serve every young person in Mombasa, not just the majority."
                </p>
                <p className="text-sm font-bold text-teal-700 mt-3">Minority Leader Kibwana Hamisi Juma, MYC</p>
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
                <Link href="/governance/youth-assembly" className="block text-sm text-teal-700 hover:underline">Youth Assembly →</Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
