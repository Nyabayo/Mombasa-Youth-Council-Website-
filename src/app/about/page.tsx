import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About MYC | Mombasa Youth Council',
  description: 'About the Mombasa Youth Council — By youth, for youth, rooted in Mombasa',
}

export default function AboutPage() {
  return (
    <>
      <div style={{ backgroundColor: '#004B6B' }} className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-teal-200 text-xs font-bold tracking-widest uppercase mb-2">Who We Are</p>
          <h1 className="text-white text-3xl sm:text-4xl font-black mb-1">About MYC</h1>
          <p className="text-teal-200 text-sm">A structured space where young people lead</p>
        </div>
      </div>
      <div style={{ backgroundColor: '#f5f5f5' }} className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-teal-700">Home</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">About MYC</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Mission statement */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <p className="text-gray-700 text-xl leading-relaxed">
            MYC brings together young people aged <strong>18 to 34</strong>, creating an active platform for
            engagement in governance, innovation, and community development — designed to empower youth, not
            to serve political interests.
          </p>
        </div>

        {/* Values */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
          {[
            { tag: 'By youth, for youth', icon: '👑' },
            { tag: 'Rooted in Mombasa', icon: '🌊' },
            { tag: 'Ideas into action', icon: '⚡' },
            { tag: 'Non-partisan', icon: '⚖️' },
          ].map((v) => (
            <div key={v.tag} className="text-center p-6 bg-white border border-gray-200 rounded-xl">
              <div className="text-4xl mb-3">{v.icon}</div>
              <p className="font-bold text-gray-800 text-sm">{v.tag}</p>
            </div>
          ))}
        </div>

        {/* About content */}
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div style={{ backgroundColor: '#004B6B' }} className="w-1 h-7" />
                <h2 className="text-2xl font-black text-gray-900">Our Story</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  The Mombasa Youth Council (MYC) was established to create a credible, structured, and inclusive
                  platform for young people in Mombasa County to actively participate in governance, community
                  development, and civic life.
                </p>
                <p>
                  Rooted in the belief that <strong>youth voices matter</strong>, the Council operates as an
                  independent, non-partisan body that brings together diverse young people from all six
                  sub-counties of Mombasa to collaborate, advocate, and lead.
                </p>
                <p>
                  Under the leadership of President Antigoals Ray and Deputy President Khadija Jilo, the Council
                  is committed to building a movement that is responsive, accountable, and truly representative
                  of the aspirations of young people.
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div style={{ backgroundColor: 'white' }} className="w-1 h-7" />
                <h2 className="text-2xl font-black text-gray-900">Our Mission</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                To champion the interests of young people in Mombasa County through advocacy, capacity building,
                strategic partnerships, and meaningful engagement in governance and development processes —
                positioning youth as active agents of change, not passive recipients.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div style={{ backgroundColor: '#004B6B' }} className="w-1 h-7" />
                <h2 className="text-2xl font-black text-gray-900">Our Vision</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                A united, empowered, and progressive youth movement that serves as the strong and credible voice
                for the youth of Mombasa County — one that promotes transparency, accountability, equal
                representation, and active participation in decision-making.
              </p>
            </div>
          </div>

          <div className="lg:w-80">
            <div style={{ backgroundColor: '#003350' }} className="rounded-xl p-8 text-white mb-6">
              <h3 className="text-white font-black text-lg mb-4">Quick Facts</h3>
              <ul className="space-y-3 text-sm">
                {[
                  ['Founded', '2026'],
                  ['Membership', 'Ages 18–34'],
                  ['Coverage', 'All 6 Sub-Counties of Mombasa'],
                  ['Status', 'Non-partisan, Independent'],
                  ['Structure', 'Administration + Youth Assembly'],
                ].map(([k, v]) => (
                  <li key={k} className="flex justify-between border-b border-teal-800 pb-2">
                    <span className="opacity-70">{k}</span>
                    <span className="font-semibold">{v}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">Get Involved</h3>
              <p className="text-sm text-gray-600 mb-4">
                Are you between 18 and 34 years old and based in Mombasa County? Join the Council and be part of the change.
              </p>
              <Link
                href="/register"
                style={{ backgroundColor: '#004B6B' }}
                className="block text-center text-white font-semibold py-3 rounded hover:opacity-90 transition-opacity"
              >
                Join MYC Today
              </Link>
              <Link href="/contact" className="block text-center text-teal-700 text-sm mt-3 hover:underline">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
