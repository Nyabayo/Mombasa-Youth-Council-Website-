import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact Us | Mombasa Youth Council',
  description: 'Get in touch with the Mombasa Youth Council',
}

export default function ContactPage() {
  return (
    <>
      <div style={{ backgroundColor: 'var(--primary)' }} className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-[#00A8C8] text-xs font-bold tracking-widest uppercase mb-2">Get In Touch</p>
          <h1 className="text-white text-3xl sm:text-4xl font-black mb-1">Contact Us</h1>
          <p className="text-[#00A8C8] text-sm">Mombasa Youth Council. We&apos;d love to hear from you</p>
        </div>
      </div>
      <div style={{ backgroundColor: '#f5f5f5' }} className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-teal-700">Home</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">Contact</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-6">Get in Touch</h2>
            <div className="space-y-5">
              {[
                { icon: '📍', label: 'Address', value: 'Mombasa County, Kenya' },
                { icon: '📧', label: 'Email', value: 'info@myc.co.ke' },
                { icon: '📞', label: 'Phone', value: '+254 700 000 000' },
                { icon: '🕐', label: 'Office Hours', value: 'Mon–Fri: 8:00 AM – 5:00 PM' },
              ].map((item) => (
                <div key={item.label} className="flex gap-4 p-4 bg-white border border-gray-200 rounded-lg">
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{item.label}</p>
                    <p className="text-gray-800 font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ backgroundColor: 'var(--primary-dark)' }} className="rounded-xl p-6 mt-8 text-white">
              <h3 className="font-black text-lg mb-3">Join the Council</h3>
              <p className="text-sm text-gray-300 mb-4">
                Are you aged 18–34 and based in Mombasa County? Register as a member of the Mombasa Youth Council
                and be part of the change.
              </p>
              <Link href="/register" style={{ backgroundColor: 'white', color: 'var(--primary)' }} className="inline-block px-5 py-2.5 font-bold rounded hover:opacity-90 transition-opacity">
                Join MYC Today
              </Link>
            </div>
          </div>

          {/* Contact form */}
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-6">Send a Message</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Your full name"
                    className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="How can we help you?"
                  className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Message *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Your message..."
                  className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <button
                type="submit"
                style={{ backgroundColor: 'var(--primary)' }}
                className="w-full py-3 text-white font-bold rounded hover:opacity-90 transition-opacity"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
