import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ThemeProvider } from '@/components/ThemeProvider'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: {
    default: 'Mombasa Youth Council | Office of the President',
    template: '%s | Mombasa Youth Council',
  },
  description:
    'Official website of the Mombasa Youth Council. By youth, for youth. Empowering young people aged 18–34 across Mombasa County through governance, innovation, and advocacy.',
  keywords: ['Mombasa Youth Council', 'MYC', 'Antigoals Ray', 'Khadija Jilo', 'Youth Kenya', 'SheriaYaVijana'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased">
        <ThemeProvider>
          <Header />
          <main className="flex-1 main-content">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
