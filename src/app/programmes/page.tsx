import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Programmes | Mombasa Youth Council',
  description: 'MYC programmes driving innovation, advocacy, and leadership development',
}

export default function ProgrammesPage() {
  return (
    <>
      <div style={{ backgroundColor: 'var(--primary)' }} className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-[#00A8C8] text-xs font-bold tracking-widest uppercase mb-2">Our Work</p>
          <h1 className="text-white text-3xl sm:text-4xl font-black mb-1">Programmes</h1>
          <p className="text-[#00A8C8] text-sm">Driving innovation, advocacy &amp; action</p>
        </div>
      </div>
      <div style={{ backgroundColor: 'var(--bg-alt)' }} className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-teal-700">Home</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">Programmes</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <p className="text-gray-600 text-lg leading-relaxed mb-12 max-w-3xl">
          MYC brings together young people aged 18 to 34, creating an active platform for engagement in
          governance, innovation, and community development, designed to empower youth, not to serve political interests.
        </p>

        <div className="space-y-10">
          {/* Innovation Festival */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-shadow">
            <div className="flex flex-col lg:flex-row">
              <div style={{ backgroundColor: 'var(--primary-dark)' }} className="lg:w-64 p-8 flex flex-col justify-center items-center text-center">
                <span className="text-5xl mb-3">💡</span>
                <h3 className="text-white font-black text-xl">Innovation Festival 2026</h3>
                <p className="text-[#00A8C8] text-sm mt-1">Mombasa · 2026</p>
              </div>
              <div className="flex-1 p-8">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Strategic workplans that turn youth-led ideas in entrepreneurship, creative industries, and social impact
                  into tangible action. Young innovators collaborating at the Mombasa Youth Innovation Festival.
                </p>
                <p className="text-gray-700 leading-relaxed mb-5">
                  The festival features innovation showcases, pitch competitions, mentorship sessions, networking
                  opportunities, and partnerships with leading organizations committed to youth empowerment.
                </p>
                <Link href="/programmes/innovation-festival" style={{ backgroundColor: 'var(--primary)' }} className="inline-block px-5 py-2.5 text-white font-semibold text-sm rounded hover:opacity-90 transition-opacity">
                  Learn More →
                </Link>
              </div>
            </div>
          </div>

          {/* SheriaYaVijana */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-shadow">
            <div className="flex flex-col lg:flex-row">
              <div style={{ backgroundColor: 'var(--primary)' }} className="lg:w-64 p-8 flex flex-col justify-center items-center text-center">
                <span className="text-5xl mb-3">📢</span>
                <h3 className="text-white font-black text-xl">#SheriaYaVijana</h3>
                <p className="text-[#00A8C8] text-sm mt-1">Youth in Policy</p>
              </div>
              <div className="flex-1 p-8">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Through <strong>#SheriaYaVijana</strong>, we engage young people in policy conversations so
                  they understand and influence the laws that shape their lives. Youth advocates rallying for
                  inclusion in Mombasa County governance.
                </p>
                <p className="text-gray-700 leading-relaxed mb-5">
                  Young Mombasa advocates are engaging county and national government institutions, demanding
                  formalized channels for youth input in policy development and resource allocation for
                  youth-led advocacy initiatives.
                </p>
                <Link href="/programmes/sheria-ya-vijana" style={{ backgroundColor: 'var(--primary)' }} className="inline-block px-5 py-2.5 text-white font-semibold text-sm rounded hover:opacity-90 transition-opacity">
                  Learn More →
                </Link>
              </div>
            </div>
          </div>

          {/* Leadership Training */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-shadow">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-64 p-8 flex flex-col justify-center items-center text-center" style={{ backgroundColor: 'var(--primary-dark)' }}>
                <span className="text-5xl mb-3">🌱</span>
                <h3 className="text-white font-black text-xl">Leadership Training</h3>
                <p className="text-[#00A8C8] text-sm mt-1">With Kenya Red Cross</p>
              </div>
              <div className="flex-1 p-8">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Partnerships with the <strong>Kenya Red Cross</strong> equip young people to become grassroots
                  change-makers in their communities. The programme covers disaster response, community health
                  advocacy, leadership skills, and conflict resolution.
                </p>
                <p className="text-gray-700 leading-relaxed mb-5">
                  Participants engage in practical community projects that directly benefit residents of Mombasa
                  County. Applications for training cohorts open periodically. Watch this space.
                </p>
                <Link href="/programmes/leadership-training" style={{ backgroundColor: 'var(--primary)' }} className="inline-block px-5 py-2.5 text-white font-semibold text-sm rounded hover:opacity-90 transition-opacity">
                  Learn More →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
