import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Deputy President | Mombasa Youth Council',
  description: 'Her Excellency Khadija Jilo, Deputy President of the Mombasa Youth Council',
}

export default function DeputyPresidentPage() {
  return (
    <>
      {/* Banner */}
      <div style={{ backgroundColor: 'var(--primary)' }} className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-[#00A8C8] text-xs font-bold tracking-widest uppercase mb-2">Mombasa Youth Council</p>
          <h1 className="text-white text-3xl sm:text-4xl font-black mb-1">Her Excellency Khadija Jilo</h1>
          <p className="text-[#00A8C8] text-sm">Deputy President of the Mombasa Youth Council (MYC)</p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={{ backgroundColor: '#f5f5f5' }} className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-teal-700">Home</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">The Deputy President</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main content */}
          <main className="flex-1 min-w-0">

            {/* ── Profile card ─────────────────────────── */}
            <div style={{ backgroundColor: 'var(--primary)' }} className="overflow-hidden mb-12">
              <div className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-80 lg:w-96 aspect-square flex-shrink-0 overflow-hidden profile-photo border-b-4 sm:border-b-0 sm:border-r-4 border-white">
                  <img src="/deputy.jpg" alt="Deputy President Khadija Jilo" className="w-full h-full object-cover" />
                </div>
                <div className="text-white p-8 flex flex-col justify-center">
                  <p className="text-[#00A8C8] text-xs tracking-widest uppercase font-bold mb-2">Her Excellency</p>
                  <h2 className="text-4xl font-black mb-2">Khadija Jilo</h2>
                  <p className="text-xl font-semibold opacity-90 mb-2">Deputy President</p>
                  <p className="opacity-70">Mombasa Youth Council (MYC)</p>
                  <p className="text-sm opacity-70 mt-1">Elected 2026 · Mombasa County, Kenya</p>
                </div>
              </div>
            </div>

            {/* ── Biography ────────────────────────────── */}
            <section id="biography" className="mb-12 scroll-mt-4">
              <div className="flex items-center gap-3 mb-5">
                <div style={{ backgroundColor: 'var(--primary)' }} className="w-1 h-7 flex-shrink-0" />
                <h2 className="text-2xl font-black text-gray-900">Biography</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Khadija Jilo is the elected Deputy President of the Mombasa Youth Council (MYC), having
                  assumed office in 2026 alongside President Antigoals Ray. She is a committed youth leader,
                  gender equality advocate, and community mobilizer with deep roots in Mombasa County.
                </p>
                <p>
                  Growing up in Mombasa, Khadija developed a strong sense of civic responsibility and a passion
                  for uplifting marginalized voices, particularly those of young women and girls who are often
                  excluded from leadership and decision-making spaces. Her work in community organizing and
                  youth advocacy brought her to prominence before her election to the Council's second-highest
                  office.
                </p>
                <p>
                  She has been involved in numerous initiatives spanning education, women's rights, mental
                  health awareness, and youth civic education. Her ability to connect with young people across
                  diverse backgrounds makes her a unifying figure within the Council and across Mombasa's
                  youth communities.
                </p>
                <p>
                  Deputy President Jilo believes that <strong>true leadership is service</strong>, and that
                  the MYC must be an institution that young people trust, feel represented by, and can turn
                  to for support, advocacy, and opportunities. She is deeply committed to ensuring the
                  Council's work is inclusive, impactful, and driven by the real needs of Mombasa's youth.
                </p>
              </div>
            </section>

            {/* ── Leadership Mandate ───────────────────── */}
            <section id="leadership-mandate" className="mb-12 scroll-mt-4">
              <div className="flex items-center gap-3 mb-5">
                <div style={{ backgroundColor: 'var(--primary)' }} className="w-1 h-7 flex-shrink-0" />
                <h2 className="text-2xl font-black text-gray-900">Leadership Mandate</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Deputy President Khadija Jilo serves as the <strong>principal assistant to the President</strong>{' '}
                  and supports the implementation of the vision, mission, and objectives of the Mombasa Youth Council.
                </p>
                <p>
                  Her leadership is founded on inclusivity, youth empowerment, gender equality, community engagement,
                  and effective representation of the diverse voices of young people across Mombasa County. She works
                  closely with the President, Executive Committee, and Youth Assembly to ensure the Council remains
                  responsive to the needs and aspirations of the youth.
                </p>
                <p>
                  The Deputy President plays a key role in coordinating youth programmes, strengthening stakeholder
                  engagement, promoting participation in governance, and supporting initiatives that create
                  opportunities for education, entrepreneurship, innovation, and leadership development.
                </p>
                <div className="p-5 border-l-4" style={{ borderColor: 'var(--primary)', backgroundColor: 'var(--bg-alt)' }}>
                  <p className="text-gray-800">
                    <strong>Constitutional Provision:</strong> In the absence of the President, the Deputy President
                    shall perform the functions and duties of the Office of the President as provided for in the
                    Constitution and policies of the Council.
                  </p>
                </div>
                <p>
                  Through collaborative leadership and service, Deputy President Khadija Jilo remains committed to
                  advancing a <strong>united, empowered, and progressive youth movement</strong> in Mombasa County.
                </p>
              </div>
            </section>

            {/* ── Key Focus Areas ──────────────────────── */}
            <section id="focus-areas" className="mb-12 scroll-mt-4">
              <div className="flex items-center gap-3 mb-5">
                <div style={{ backgroundColor: 'var(--primary)' }} className="w-1 h-7 flex-shrink-0" />
                <h2 className="text-2xl font-black text-gray-900">Key Focus Areas</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: '♀️', title: 'Gender Equality', desc: 'Championing equal representation and opportunities for women and girls in leadership.' },
                  { icon: '🤝', title: 'Community Engagement', desc: 'Building meaningful connections between the Council and youth communities.' },
                  { icon: '📚', title: 'Youth Empowerment', desc: 'Supporting programmes that build youth capacity and leadership skills.' },
                  { icon: '🏛️', title: 'Governance', desc: 'Ensuring transparent, accountable, and inclusive Council operations.' },
                  { icon: '🧠', title: 'Mental Health', desc: 'Raising awareness and reducing stigma around mental health among young people.' },
                  { icon: '🌍', title: 'Civic Education', desc: 'Equipping youth with knowledge to participate effectively in governance.' },
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

            {/* ── Statements ───────────────────────────── */}
            <section id="statements" className="mb-12 scroll-mt-4">
              <div className="flex items-center gap-3 mb-5">
                <div style={{ backgroundColor: 'var(--primary)' }} className="w-1 h-7 flex-shrink-0" />
                <h2 className="text-2xl font-black text-gray-900">Speeches &amp; Statements</h2>
              </div>
              <div className="space-y-5">
                {[
                  {
                    date: 'June 2026',
                    title: 'Inaugural Address, Deputy President, MYC',
                    excerpt:
                      'I stand here not just as Deputy President, but as a young woman from Mombasa who knows what it means to fight for a seat at the table. We will build a Council that leaves no young person behind, especially those the system has long overlooked.',
                  },
                  {
                    date: 'May 2026',
                    title: 'Statement on Gender Equality in Youth Leadership',
                    excerpt:
                      'Meaningful gender equality is not a favour. It is a right. The MYC is committed to creating structures that ensure women and girls in Mombasa have equal access to leadership, resources, and opportunities.',
                  },
                  {
                    date: 'March 2026',
                    title: "Message on International Women's Day",
                    excerpt:
                      "On this day we celebrate the courage, resilience, and brilliance of women everywhere. To every young woman in Mombasa: your voice matters, your leadership matters, and MYC is here to amplify it.",
                  },
                ].map((speech) => (
                  <div key={speech.title} className="border-l-4 pl-5 py-1" style={{ borderColor: 'var(--primary)' }}>
                    <p className="text-xs font-bold text-teal-700 uppercase tracking-widest mb-1">{speech.date}</p>
                    <h4 className="font-bold text-gray-900 mb-2">{speech.title}</h4>
                    <p className="text-sm text-gray-600 italic leading-relaxed">"{speech.excerpt}"</p>
                  </div>
                ))}
              </div>
            </section>

          </main>

          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white border border-gray-200 p-4">
              <h4 className="font-bold text-gray-900 mb-3">Related</h4>
              <div className="space-y-2">
                <Link href="/president" className="block text-sm text-teal-700 hover:underline">The President →</Link>
                <Link href="/governance" className="block text-sm text-teal-700 hover:underline">Governance Structure →</Link>
                <Link href="/programmes" className="block text-sm text-teal-700 hover:underline">Programmes →</Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
