import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Speaker Ali Kubo | Mombasa Youth Council',
  description: 'Speaker Ali Kubo, Speaker of the Mombasa Youth Council Youth Assembly',
}

export default function SpeakerPage() {
  return (
    <>
      {/* Banner */}
      <div style={{ backgroundColor: 'var(--primary)' }} className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-[#00A8C8] text-xs font-bold tracking-widest uppercase mb-2">Mombasa Youth Council</p>
          <h1 className="text-white text-3xl sm:text-4xl font-black mb-1">Speaker Ali Kubo</h1>
          <p className="text-[#00A8C8] text-sm">Speaker of the Mombasa Youth Council Youth Assembly</p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={{ backgroundColor: '#f5f5f5' }} className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-teal-700">Home</Link>
          <span>/</span>
          <Link href="/governance/administration" className="hover:text-teal-700">Administration</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">Speaker Ali Kubo</span>
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
                    src="/Speaker Ali Kubo.jpeg"
                    alt="Speaker Ali Kubo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-white p-8 flex flex-col justify-center">
                  <p className="text-[#00A8C8] text-xs tracking-widest uppercase font-bold mb-2">The Speaker</p>
                  <h2 className="text-4xl font-black mb-2">Ali Kubo</h2>
                  <p className="text-xl font-semibold opacity-90 mb-2">Speaker, Youth Assembly</p>
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
                  Ali Kubo serves as the Speaker of the Mombasa Youth Council&apos;s Youth Assembly — the
                  legislative and deliberative arm of the Council. As Speaker, he is the presiding officer
                  of the Assembly, responsible for maintaining order, impartiality, and the integrity of
                  the Council&apos;s legislative processes.
                </p>
                <p>
                  Speaker Kubo brings a background in youth civic engagement, debate, and constitutional
                  governance. His leadership style is grounded in fairness, procedural discipline, and a
                  deep commitment to ensuring every voice in the Assembly is heard and respected.
                </p>
                <p>
                  Prior to his election as Speaker, Ali Kubo was an active participant in youth governance
                  forums across Mombasa County, championing parliamentary procedure training and civic
                  education among young people.
                </p>
              </div>
            </section>

            {/* Role of the Speaker */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-5">
                <div style={{ backgroundColor: 'var(--primary)' }} className="w-1 h-7 flex-shrink-0" />
                <h2 className="text-2xl font-black text-gray-900">Role of the Speaker</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: '🏛️', title: 'Presiding Officer', desc: 'Chairs all Youth Assembly sessions and ensures orderly conduct of proceedings.' },
                  { icon: '⚖️', title: 'Impartiality', desc: 'Maintains neutrality and fairness in all legislative debates and decisions.' },
                  { icon: '📜', title: 'Legislative Oversight', desc: 'Oversees the passage of Council resolutions, motions, and policies.' },
                  { icon: '🗣️', title: 'Debate Management', desc: 'Facilitates structured debate, allocates speaking time, and upholds parliamentary rules.' },
                  { icon: '🤝', title: 'Representation', desc: 'Represents the Youth Assembly in official and ceremonial Council functions.' },
                  { icon: '📋', title: 'Agenda Setting', desc: 'Sets and manages the Assembly agenda in consultation with the Council leadership.' },
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
                <h2 className="text-2xl font-black text-gray-900">Speaker&apos;s Statement</h2>
              </div>
              <div className="p-6 border-l-4" style={{ borderColor: 'var(--primary)', backgroundColor: 'var(--bg-alt)' }}>
                <p className="text-gray-800 italic leading-relaxed text-lg">
                  "The Youth Assembly is the voice of every young person in Mombasa. My role as Speaker is
                  to protect that voice — ensuring that our debates are fair, our decisions are just, and
                  our assembly remains a space where democracy truly lives."
                </p>
                <p className="text-sm font-bold text-teal-700 mt-3">— Speaker Ali Kubo, MYC Youth Assembly</p>
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
                <Link href="/minority-leader" className="block text-sm text-teal-700 hover:underline">Minority Leader →</Link>
                <Link href="/governance/youth-assembly" className="block text-sm text-teal-700 hover:underline">Youth Assembly →</Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
