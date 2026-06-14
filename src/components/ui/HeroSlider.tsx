'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'

interface SlidePost {
  title: string
  excerpt: string
  category: string
  slug: string
}

interface Slide {
  bg: string
  post: SlidePost | null
}

interface Props {
  slides: Slide[]
}

export default function HeroSlider({ slides }: Props) {
  const [current, setCurrent] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const goTo = useCallback((idx: number) => {
    if (transitioning) return
    setTransitioning(true)
    setTimeout(() => {
      setCurrent(idx)
      setTransitioning(false)
    }, 600)
  }, [transitioning])

  const next = useCallback(() => {
    goTo((current + 1) % slides.length)
  }, [current, slides.length, goTo])

  // Auto-advance every 6 seconds
  useEffect(() => {
    timerRef.current = setTimeout(next, 6000)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [next])

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = (canvas.width = canvas.offsetWidth)
    let h = (canvas.height = canvas.offsetHeight)
    const resize = () => { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight }
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 2 + 0.4,
      dx: (Math.random() - 0.5) * 0.35, dy: -(Math.random() * 0.5 + 0.15),
      opacity: Math.random() * 0.45 + 0.08,
    }))

    let raf: number
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of particles) {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`; ctx.fill()
        p.x += p.dx; p.y += p.dy
        if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w }
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])


  return (
    <section className="relative overflow-hidden" style={{ minHeight: '100vh', marginTop: '-100px' }}>

      {/* Background images — crossfade, positioned top so heads are always visible */}
      {slides.map((s, i) => (
        <div
          key={s.bg}
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url('${s.bg}')`,
            backgroundPosition: 'center 20%',
            opacity: i === current ? 1 : 0,
            transition: 'opacity 1.2s ease-in-out',
            zIndex: 0,
          }}
        />
      ))}

      {/* Teal-gold gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(0,75,107,0.91) 0%, rgba(0,168,200,0.62) 50%, rgba(0,43,61,0.94) 100%)',
          zIndex: 1,
        }}
      />

      {/* Gold left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: '#F5A300', zIndex: 2 }} />

      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 2 }} />

      {/* Content */}
      <div
        className="relative flex flex-col justify-center"
        style={{ minHeight: '100vh', zIndex: 3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full"
          style={{ paddingTop: 'clamp(110px, 18vw, 190px)', paddingBottom: '80px' }}
        >
          <div className="max-w-3xl">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-5 hero-fade-1">
              <span
                className="px-3 py-1 text-xs font-black tracking-widest uppercase rounded-full"
                style={{ backgroundColor: '#F5A300', color: '#002B3D' }}
              >
                Mombasa Youth Rising · 2026
              </span>
              <span className="text-white/50 text-xs font-semibold">
                {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
              </span>
            </div>

            {/* Static headline — never changes */}
            <h1 className="text-white font-black leading-tight mb-4 hero-fade-2" style={{ fontSize: 'clamp(1.6rem, 4.5vw, 3.5rem)' }}>
              Inside the Movement <br className="hidden sm:block" />
              <span style={{ color: '#F5A300' }}>Powering Innovation,</span><br className="hidden sm:block" />
              Governance &amp; Change
            </h1>

            {/* Static body copy */}
            <p className="text-white/85 text-sm sm:text-base lg:text-lg leading-relaxed mb-7 max-w-2xl hero-fade-3">
              The Mombasa Youth Council (MYC) is redefining youth engagement across the county —
              turning young voices into <strong className="text-white">leaders of development</strong>,
              not just participants.
            </p>

            {/* Static CTAs */}
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-10 sm:mb-14 hero-fade-4">
              <Link
                href="/register"
                className="inline-block px-5 sm:px-7 py-3 font-bold text-sm rounded-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#F5A300', color: '#002B3D' }}
              >
                Join MYC Today
              </Link>
              <Link
                href="/about"
                className="inline-block px-5 sm:px-7 py-3 border-2 text-white font-semibold text-sm rounded-lg hover:bg-white/10 transition-all"
                style={{ borderColor: 'rgba(255,255,255,0.55)' }}
              >
                Read the Story
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 sm:gap-6">
              {[
                { value: '18–34', label: 'Age range' },
                { value: '5000+', label: 'Youth engaged' },
                { value: '2026', label: 'Innovation Festival' },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className="w-px h-8 hidden sm:block" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
                  <div>
                    <div className="text-white font-black text-lg sm:text-2xl leading-none">{s.value}</div>
                    <div className="text-xs mt-0.5 uppercase tracking-wide" style={{ color: '#00A8C8' }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Slide dots + prev/next */}
        <div className="absolute bottom-16 left-0 right-0 flex items-center justify-center gap-4" style={{ zIndex: 4 }}>
          {/* Prev */}
          <button
            onClick={() => goTo((current - 1 + slides.length) % slides.length)}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-white/30 text-white/70 hover:bg-white/20 hover:text-white transition-all"
            aria-label="Previous slide"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="transition-all duration-500 rounded-full"
                style={{
                  width: i === current ? '28px' : '8px',
                  height: '8px',
                  backgroundColor: i === current ? '#F5A300' : 'rgba(255,255,255,0.4)',
                }}
              />
            ))}
          </div>

          {/* Next */}
          <button
            onClick={() => goTo((current + 1) % slides.length)}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-white/30 text-white/70 hover:bg-white/20 hover:text-white transition-all"
            aria-label="Next slide"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: 'rgba(255,255,255,0.1)', zIndex: 4 }}>
          <div
            key={current}
            className="h-full"
            style={{
              backgroundColor: '#F5A300',
              animation: 'progress 6s linear forwards',
            }}
          />
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none" style={{ zIndex: 5 }}>
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" className="block w-full" preserveAspectRatio="none" style={{ height: '40px' }}>
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="var(--bg)" />
        </svg>
      </div>

      <style>{`
        @keyframes progress {
          from { width: 0% }
          to   { width: 100% }
        }
      `}</style>
    </section>
  )
}
