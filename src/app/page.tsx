import Link from 'next/link'
import HeroSlider from '@/components/ui/HeroSlider'
import NewsTicker from '@/components/ui/NewsTicker'
import NewsCard from '@/components/ui/NewsCard'
import { store } from '@/lib/store'

const heroImages = [
  { bg: '/hero1.jpg',   position: 'center 15%' },
  { bg: '/hero2.jpg',   position: 'center 10%' },
  { bg: '/hero3.jpeg',  position: 'center 30%' },
]

export default function HomePage() {
  const allPosts = store.getPublishedPosts()
  const latest3 = allPosts.slice(0, 3)
  const featured = latest3
  const sidebar = allPosts.slice(3, 8)

  const heroSlides = heroImages.map(({ bg, position }, i) => ({
    bg,
    position,
    post: latest3[i]
      ? {
          title: latest3[i].title,
          excerpt: latest3[i].excerpt,
          category: latest3[i].category,
          slug: latest3[i].slug,
        }
      : null,
  }))

  const quickLinks = [
    { label: "President's Office", href: '/president', icon: '🏛️', desc: 'His Excellency Antigoals Ray' },
    { label: 'Youth Assembly', href: '/governance/youth-assembly', icon: '🗳️', desc: 'Representative Organ' },
    { label: 'Innovation Festival', href: '/programmes/innovation-festival', icon: '💡', desc: '2026 · Mombasa' },
    { label: '#SheriaYaVijana', href: '/programmes/sheria-ya-vijana', icon: '📢', desc: 'Youth Policy Advocacy' },
    { label: 'Join MYC', href: '/register', icon: '✅', desc: 'Become a Member' },
    { label: 'Posts & Media', href: '/posts', icon: '📰', desc: 'Latest Updates' },
  ]

  return (
    <>
      <HeroSlider slides={heroSlides} />
      <NewsTicker />

      {/* Quick Links */}
      <section className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickLinks.map((ql) => (
              <Link
                key={ql.href}
                href={ql.href}
                className="group bg-white border border-gray-200 rounded p-4 text-center hover:border-teal-700 hover:shadow-md transition-all"
              >
                <div className="text-3xl mb-2">{ql.icon}</div>
                <div className="text-xs font-bold text-gray-800 group-hover:text-teal-700 leading-tight">
                  {ql.label}
                </div>
                <div className="text-xs text-gray-400 mt-1 hidden sm:block">{ql.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* News grid + Sidebar */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <div style={{ backgroundColor: 'var(--primary)' }} className="w-1 h-7" />
              <h2 className="text-xl font-bold text-gray-900">Latest Posts</h2>
              <Link href="/posts" className="ml-auto text-sm text-teal-700 hover:underline font-medium">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((post) => (
                <NewsCard key={post.id} post={post} featured />
              ))}
            </div>
          </div>

          <div className="lg:w-72">
            <div className="bg-white border border-gray-200 mb-6">
              <div style={{ backgroundColor: 'var(--primary)' }} className="px-4 py-3">
                <h3 className="text-white font-bold text-sm">More Posts</h3>
              </div>
              <div className="px-2">
                {sidebar.map((post) => (
                  <NewsCard key={post.id} post={post} />
                ))}
                {sidebar.length === 0 && (
                  <p className="text-gray-400 text-sm px-2 py-4">No more articles.</p>
                )}
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-3">About MYC</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                A structured space where young people lead. MYC brings together young people aged{' '}
                <strong>18 to 34</strong>, creating an active platform for engagement in governance,
                innovation, and community development.
              </p>
              <div className="flex flex-wrap gap-2 text-xs mb-4">
                {['By youth, for youth', 'Rooted in Mombasa', 'Non-partisan', 'Ideas into action'].map((t) => (
                  <span
                    key={t}
                    className="border px-2 py-1 rounded-full font-medium"
                    style={{ backgroundColor: 'var(--bg-alt)', color: 'var(--primary)', borderColor: '#bfdbfe' }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <Link
                href="/about"
                style={{ backgroundColor: 'var(--gold)', color: 'var(--primary-dark)' }}
                className="block text-center text-sm font-bold py-2 rounded hover:opacity-90 transition-opacity"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section style={{ backgroundColor: 'var(--bg-alt)' }} className="py-14 border-t border-teal-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-teal-700 text-xs font-bold tracking-widest uppercase mb-2">Our Work</p>
            <h2 className="text-3xl font-black text-gray-900 mb-3">What We Do</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Driving innovation, advocacy &amp; action for young people across Mombasa County.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '💡',
                title: 'Innovation & Workplans',
                desc: 'Strategic workplans that turn youth-led ideas — entrepreneurship, creative industries, social impact — into tangible action.',
                link: '/programmes/innovation-festival',
                tag: 'Innovation Festival 2026',
              },
              {
                icon: '📢',
                title: 'Advocacy & Policy',
                desc: 'Through #SheriaYaVijana, we engage young people in policy conversations so they understand and influence the laws that shape their lives.',
                link: '/programmes/sheria-ya-vijana',
                tag: '#SheriaYaVijana',
              },
              {
                icon: '🌱',
                title: 'Leadership Training',
                desc: 'Partnerships with the Kenya Red Cross equip young people to become grassroots change-makers in their communities.',
                link: '/programmes/leadership-training',
                tag: 'With Kenya Red Cross',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white border border-teal-100 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{item.desc}</p>
                <Link href={item.link} className="text-teal-700 text-sm font-semibold hover:underline">
                  {item.tag} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advocacy Banner */}
      <section style={{ backgroundColor: 'var(--primary-dark)' }} className="py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1">
              <p className="text-[#00A8C8] text-xs font-bold tracking-widest uppercase mb-3">Advocacy That Matters</p>
              <h2 className="text-white text-3xl font-black mb-4 leading-tight">
                Youth voices in Mombasa<br />are growing stronger.
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Through initiatives like <strong className="text-white">#SheriaYaVijana</strong>, MYC is actively engaging young
                people in policy conversations — ensuring they understand and influence the laws that affect their lives.
              </p>
              <blockquote className="border-l-4 pl-4 text-gray-300 italic text-sm mb-6" style={{ borderColor: 'var(--gold)' }}>
                &ldquo;Support from allied leaders has reinforced the council&apos;s legitimacy, pushing back against efforts to sideline youth participation in governance.&rdquo;
              </blockquote>
              <Link
                href="/programmes/sheria-ya-vijana"
                style={{ backgroundColor: 'var(--gold)', color: 'var(--primary-dark)' }}
                className="inline-block px-6 py-3 font-bold rounded hover:opacity-90 transition-opacity"
              >
                Our Advocacy Work →
              </Link>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4 text-center">
              {[
                { number: '18–34', label: 'Age Range' },
                { number: '6', label: 'Sub-Counties' },
                { number: '3', label: 'Core Organs' },
                { number: '∞', label: 'Potential' },
              ].map((s) => (
                <div key={s.label} style={{ backgroundColor: 'var(--primary-dark)' }} className="rounded-lg p-6">
                  <div className="text-white text-4xl font-black mb-1">{s.number}</div>
                  <div className="text-gray-300 text-sm">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership snapshot */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-teal-700 text-xs font-bold tracking-widest uppercase mb-2">Leadership</p>
            <h2 className="text-3xl font-black text-gray-900">Office of the President</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: 'His Excellency',
                name: 'Antigoals Ray',
                role: 'President, Mombasa Youth Council',
                desc: 'President Ray leads on a platform centered on youth empowerment, inclusivity, leadership development, civic participation, innovation, and sustainable opportunities.',
                href: '/president',
                photo: '/president.jpeg',
              },
              {
                title: 'Her Excellency',
                name: 'Khadija Jilo',
                role: 'Deputy President, Mombasa Youth Council',
                desc: 'Deputy President Jilo serves as the principal assistant to the President and supports the implementation of the vision, mission, and objectives of the Council.',
                href: '/deputy-president',
                photo: '/deputy.jpg',
              },
            ].map((leader) => (
              <div key={leader.name} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div style={{ backgroundColor: 'var(--primary)' }} className="p-8 flex items-center gap-5">
                  <div className="w-20 h-20 rounded-full border-4 border-white flex-shrink-0 overflow-hidden">
                    <img src={leader.photo} alt={leader.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-white">
                    <p className="text-[#00A8C8] text-xs tracking-widest uppercase">{leader.title}</p>
                    <h3 className="font-black text-xl">{leader.name}</h3>
                    <p className="text-sm opacity-80">{leader.role}</p>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{leader.desc}</p>
                  <Link href={leader.href} className="text-teal-700 text-sm font-semibold hover:underline">
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))' }} className="py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-white text-3xl font-black mb-4">Join the Mombasa Youth Council</h2>
          <p className="text-white/90 text-lg mb-8">
            Be part of a united, empowered, and progressive youth movement. Open to young people aged 18–34 in Mombasa County.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/register" style={{ backgroundColor: 'var(--gold)', color: 'var(--primary-dark)' }} className="px-8 py-3 font-bold rounded hover:opacity-90 transition-opacity">
              Join MYC Today
            </Link>
            <Link href="/about" className="px-8 py-3 border-2 border-white text-white font-semibold rounded hover:bg-white/10 transition-colors">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
