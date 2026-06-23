import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The President | Mombasa Youth Council',
  description: 'His Excellency Antigoals Ray, President of the Mombasa Youth Council',
}

export default function PresidentPage() {
  return (
    <>
      {/* Banner */}
      <div style={{ backgroundColor: 'var(--primary)' }} className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-[#00A8C8] text-xs font-bold tracking-widest uppercase mb-2">Mombasa Youth Council</p>
          <h1 className="text-white text-3xl sm:text-4xl font-black mb-1">His Excellency Antigoals Ray</h1>
          <p className="text-[#00A8C8] text-sm">President of the Mombasa Youth Council (MYC)</p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={{ backgroundColor: '#f5f5f5' }} className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-teal-700">Home</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">The President</span>
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
                  <img src="/president.jpeg" alt="President Antigoals Ray" className="w-full h-full object-cover" />
                </div>
                <div className="text-white p-8 flex flex-col justify-center">
                  <p className="text-[#00A8C8] text-xs tracking-widest uppercase font-bold mb-2">His Excellency</p>
                  <h2 className="text-4xl font-black mb-2">Antigoals Ray</h2>
                  <p className="text-xl font-semibold opacity-90 mb-2">President</p>
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
              <div className="prose prose-gray max-w-none space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Antigoals Ray is the elected President of the Mombasa Youth Council (MYC), a position he assumed
                  in 2026 following a mandate from young people across Mombasa County. He is a passionate youth
                  advocate, community leader, and champion of good governance, social justice, and inclusive
                  development.
                </p>
                <p>
                  Born and raised in Mombasa County, President Ray developed an early interest in civic engagement
                  and community service. His journey in youth leadership began at the grassroots level, where he
                  organized youth forums, led community outreach programmes, and mobilized young people to
                  participate actively in governance and decision-making processes.
                </p>
                <p>
                  Prior to his election as President, he served in various leadership roles that shaped his
                  understanding of the challenges and opportunities facing Mombasa's youth, including youth
                  unemployment, access to quality education, limited economic opportunities, and the need for
                  stronger representation in county and national governance structures.
                </p>
                <p>
                  President Ray holds a strong belief that <strong>youth are not just leaders of tomorrow, but
                  active agents of change today</strong>. He envisions a Mombasa Youth Council that is
                  accountable, transparent, and deeply connected to the communities it serves, one that delivers
                  real, measurable impact for young people across all sub-counties of Mombasa.
                </p>
                <p>
                  Under his leadership, the Council has embraced a results-oriented approach to youth
                  empowerment, working collaboratively with government, civil society, development partners,
                  and the private sector to advance the interests and welfare of Mombasa's youth.
                </p>
              </div>
            </section>

            {/* ── Policy Platform ──────────────────────── */}
            <section id="policy-platform" className="mb-12 scroll-mt-4">
              <div className="flex items-center gap-3 mb-5">
                <div style={{ backgroundColor: 'var(--primary)' }} className="w-1 h-7 flex-shrink-0" />
                <h2 className="text-2xl font-black text-gray-900">Policy Platform</h2>
              </div>
              <div className="prose prose-gray max-w-none space-y-4 text-gray-700 leading-relaxed">
                <p>
                  President Ray was elected on a platform centered on <strong>youth empowerment, inclusivity,
                  leadership development, civic participation, innovation, and sustainable opportunities</strong>{' '}
                  for young people across Mombasa County.
                </p>
                <p>
                  His leadership vision is anchored on creating a united and independent youth movement that
                  champions the interests of young people through advocacy, capacity building, strategic
                  partnerships, and meaningful engagement in governance and development processes.
                </p>
                <p>
                  Under his administration, the Council seeks to promote transparency, accountability, equal
                  representation, and active participation of all youth in decision-making. The President
                  remains committed to advancing policies and programs that address youth unemployment,
                  entrepreneurship, climate action, education, talent development, and social inclusion.
                </p>
                <p>
                  Through collaboration with government institutions, development partners, community
                  organizations, and youth-led initiatives, President Ray aims to position the Mombasa Youth
                  Council as a <strong>strong and credible voice</strong> for the youth of Mombasa County.
                </p>
              </div>
            </section>

            {/* ── Priority Areas ───────────────────────── */}
            <section id="priority-areas" className="mb-12 scroll-mt-4">
              <div className="flex items-center gap-3 mb-5">
                <div style={{ backgroundColor: 'var(--primary)' }} className="w-1 h-7 flex-shrink-0" />
                <h2 className="text-2xl font-black text-gray-900">Priority Areas</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: '💼', title: 'Youth Employment', desc: 'Creating pathways to employment and entrepreneurship for young people.' },
                  { icon: '🏫', title: 'Education', desc: 'Advocating for quality education and skills development opportunities.' },
                  { icon: '🌿', title: 'Climate Action', desc: 'Engaging youth in climate resilience and environmental sustainability.' },
                  { icon: '🎓', title: 'Talent Development', desc: 'Nurturing talent in sports, arts, culture, and creative industries.' },
                  { icon: '⚖️', title: 'Social Inclusion', desc: 'Ensuring no young person is left behind regardless of background.' },
                  { icon: '🤝', title: 'Civic Participation', desc: 'Building a culture of active youth engagement in governance.' },
                ].map((p) => (
                  <div key={p.title} className="flex gap-4 p-4 bg-gray-50 border border-gray-200">
                    <span className="text-2xl flex-shrink-0">{p.icon}</span>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">{p.title}</h4>
                      <p className="text-sm text-gray-600">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Speeches & Statements ────────────────── */}
            <section id="speeches" className="mb-12 scroll-mt-4">
              <div className="flex items-center gap-3 mb-5">
                <div style={{ backgroundColor: 'var(--primary)' }} className="w-1 h-7 flex-shrink-0" />
                <h2 className="text-2xl font-black text-gray-900">Speeches &amp; Statements</h2>
              </div>
              <div className="space-y-5">
                {[
                  {
                    date: 'June 2026',
                    title: 'Inaugural Address, Mombasa Youth Council',
                    excerpt:
                      'Fellow young people of Mombasa, today marks the beginning of a new chapter. We did not come here to occupy seats. We came to serve, to deliver, and to transform the reality of every young person in this county.',
                  },
                  {
                    date: 'May 2026',
                    title: 'Statement on Youth Unemployment in Mombasa County',
                    excerpt:
                      'The youth unemployment crisis in Mombasa demands urgent, coordinated action. The MYC calls on county and national government to prioritize youth-friendly economic policies and create dedicated employment programmes.',
                  },
                  {
                    date: 'April 2026',
                    title: 'Message on International Youth Day',
                    excerpt:
                      'On this International Youth Day, we reaffirm our commitment to building a Mombasa where every young person has a seat at the table, access to opportunities, and the freedom to dream and achieve.',
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
                <Link href="/deputy-president" className="block text-sm text-teal-700 hover:underline">The Deputy President →</Link>
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
