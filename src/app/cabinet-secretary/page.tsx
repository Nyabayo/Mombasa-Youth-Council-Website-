import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cabinet Secretary of Finance & Economic Planning | Mombasa Youth Council',
  description: 'Yusuf Ali, Cabinet Secretary of Finance and Economic Planning, Mombasa Youth Council',
}

export default function CabinetSecretaryPage() {
  return (
    <>
      {/* Banner */}
      <div style={{ backgroundColor: 'var(--primary)' }} className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-[#00A8C8] text-xs font-bold tracking-widest uppercase mb-2">Mombasa Youth Council</p>
          <h1 className="text-white text-3xl sm:text-4xl font-black mb-1">Yusuf Ali</h1>
          <p className="text-[#00A8C8] text-sm">Cabinet Secretary of Finance &amp; Economic Planning, Mombasa Youth Council (MYC)</p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={{ backgroundColor: '#f5f5f5' }} className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-teal-700">Home</Link>
          <span>/</span>
          <Link href="/governance/administration" className="hover:text-teal-700">Administration</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">Cabinet Secretary of Finance</span>
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
                    src="/Cabinet secretary of finance and economic planing.jpeg"
                    alt="Cabinet Secretary of Finance and Economic Planning"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-white p-8 flex flex-col justify-center">
                  <p className="text-[#00A8C8] text-xs tracking-widest uppercase font-bold mb-2">Cabinet Secretary</p>
                  <h2 className="text-4xl font-black mb-2">Yusuf Ali</h2>
                  <p className="text-xl font-semibold opacity-90 mb-2">CS Finance &amp; Economic Planning</p>
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
                  The Cabinet Secretary of Finance and Economic Planning is a senior member of the Mombasa Youth
                  Council executive, responsible for overseeing the financial health, budgeting, and economic
                  strategy of the Council.
                </p>
                <p>
                  This office ensures that MYC&apos;s resources are managed with transparency, accountability, and
                  efficiency, enabling programmes and initiatives to be delivered effectively for the youth of
                  Mombasa County.
                </p>
                <p>
                  The CS Finance works closely with the President, Deputy President, and the Council&apos;s
                  committees to develop fiscal policies, manage expenditure, and plan for sustainable economic
                  growth within the Council&apos;s mandate.
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
                  { icon: '💰', title: 'Budgeting & Finance', desc: 'Preparing, managing, and overseeing MYC annual budgets and financial plans.' },
                  { icon: '📊', title: 'Economic Planning', desc: 'Developing economic frameworks that support sustainable youth-led initiatives.' },
                  { icon: '🔍', title: 'Accountability', desc: 'Ensuring all Council expenditure is transparent, documented, and auditable.' },
                  { icon: '🤝', title: 'Resource Mobilisation', desc: 'Identifying funding opportunities, grants, and partnerships to support MYC work.' },
                  { icon: '📈', title: 'Financial Reporting', desc: 'Presenting regular financial reports to the Council, assembly, and stakeholders.' },
                  { icon: '🏗️', title: 'Economic Empowerment', desc: 'Driving programmes that build financial literacy and economic opportunity for youth.' },
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
                <h2 className="text-2xl font-black text-gray-900">Statement from the Office</h2>
              </div>
              <div className="p-6 border-l-4" style={{ borderColor: 'var(--primary)', backgroundColor: 'var(--bg-alt)' }}>
                <p className="text-gray-800 italic leading-relaxed text-lg">
                  "Sound financial management is the backbone of every successful institution. Our commitment
                  is to ensure every shilling entrusted to the Mombasa Youth Council is used to create
                  meaningful change in the lives of young people across our county."
                </p>
                <p className="text-sm font-bold text-teal-700 mt-3">Cabinet Secretary, Finance &amp; Economic Planning, MYC</p>
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
