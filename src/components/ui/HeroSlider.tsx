'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = (canvas.width = canvas.offsetWidth)
    let h = (canvas.height = canvas.offsetHeight)

    const resize = () => { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight }
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: -(Math.random() * 0.6 + 0.2),
      opacity: Math.random() * 0.5 + 0.1,
    }))

    let raf: number
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`
        ctx.fill()
        p.x += p.dx
        p.y += p.dy
        if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w }
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <section className="relative overflow-hidden" style={{ minHeight: '100vh', marginTop: '-100px' }}>
      {/* Background image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/hero.jpeg')" }} />

      {/* Logo-color overlay: dark teal → bright teal gradient */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, rgba(0,75,107,0.92) 0%, rgba(0,168,200,0.70) 55%, rgba(0,43,61,0.95) 100%)' }}
      />

      {/* Gold accent left bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: 'var(--gold)' }} />

      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex flex-col justify-center h-full" style={{ minHeight: '100vh' }}>
        <div className="max-w-3xl w-full" style={{ paddingTop: 'clamp(120px, 20vw, 200px)', paddingBottom: '60px' }}>

          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 mb-5 sm:mb-6 hero-fade-1">
            <span
              className="px-3 py-1 text-xs font-black tracking-widest uppercase rounded-full"
              style={{ backgroundColor: 'var(--gold)', color: 'var(--primary-dark)' }}
            >
              Mombasa Youth Rising · 2026
            </span>
          </div>

          {/* Main headline */}
          <h1 className="text-white font-black leading-tight mb-4 hero-fade-2" style={{ fontSize: 'clamp(1.75rem, 5vw, 3.75rem)' }}>
            Inside the Movement <br className="hidden sm:block" />
            <span style={{ color: 'var(--gold)' }}>Powering Innovation,</span><br className="hidden sm:block" />
            Governance &amp; Change
          </h1>

          {/* Body copy */}
          <p className="text-white/85 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8 max-w-2xl hero-fade-3">
            The Mombasa Youth Council (MYC) is redefining youth engagement across the county —
            turning young voices into <strong className="text-white">leaders of development</strong>,
            not just participants.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 sm:gap-4 mb-10 sm:mb-14 hero-fade-4">
            <Link
              href="/register"
              className="inline-block px-5 sm:px-7 py-3 sm:py-3.5 font-bold text-sm rounded-lg transition-all duration-300 hover:opacity-90"
              style={{ backgroundColor: 'var(--gold)', color: 'var(--primary-dark)' }}
            >
              Join MYC Today
            </Link>
            <Link
              href="/about"
              className="inline-block px-5 sm:px-7 py-3 sm:py-3.5 border-2 text-white font-semibold text-sm rounded-lg transition-all duration-300 hover:bg-white/10"
              style={{ borderColor: 'rgba(255,255,255,0.6)' }}
            >
              Read the Story
            </Link>
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap gap-4 sm:gap-6 hero-fade-4">
            {[
              { value: '18–34', label: 'Age range' },
              { value: '5000+', label: 'Youth engaged' },
              { value: '2026', label: 'Innovation Festival' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="w-px h-8 hidden sm:block" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
                <div>
                  <div className="text-white font-black text-lg sm:text-2xl leading-none">{s.value}</div>
                  <div className="text-xs mt-0.5 uppercase tracking-wide" style={{ color: 'var(--accent)' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" className="block w-full" preserveAspectRatio="none" style={{ height: '40px' }}>
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="var(--bg)" />
        </svg>
      </div>
    </section>
  )
}
