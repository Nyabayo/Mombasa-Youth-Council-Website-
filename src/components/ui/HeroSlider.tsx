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
  position?: string
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
    }, 700)
  }, [transitioning])

  const next = useCallback(() => {
    goTo((current + 1) % slides.length)
  }, [current, slides.length, goTo])

  useEffect(() => {
    timerRef.current = setTimeout(next, 6500)
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
    const resize = () => {
      w = canvas.width = canvas.offsetWidth
      h = canvas.height = canvas.offsetHeight
    }
    window.addEventListener('resize', resize)
    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.8 + 0.4,
      dx: (Math.random() - 0.5) * 0.3, dy: -(Math.random() * 0.5 + 0.15),
      opacity: Math.random() * 0.4 + 0.08,
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
    <section
      className="hero-section relative overflow-hidden"
      style={{ marginTop: '-100px' }}
    >
      {/*
        Ghost image (invisible) — on desktop this sets the section height to the
        image's natural aspect ratio at 100% viewport width (zero left/right crop).
        On mobile the .hero-section CSS class forces min-height: 100svh instead,
        giving enough room for the full text content.
      */}
      <img
        src={slides[0]?.bg ?? '/hero1.jpg'}
        alt=""
        aria-hidden="true"
        className="w-full block"
        style={{ opacity: 0, pointerEvents: 'none', userSelect: 'none' }}
      />

      {/* Slide images — absolute, fill the section exactly */}
      {slides.map((s, i) => (
        <img
          key={s.bg}
          src={s.bg}
          alt={`Hero slide ${i + 1}`}
          className="absolute inset-0 w-full h-full"
          style={{
            objectFit: 'cover',
            objectPosition: s.position ?? 'center 20%',
            opacity: i === current ? 1 : 0,
            transition: 'opacity 1.4s ease-in-out',
          }}
        />
      ))}

      {/*
        Gradient overlay:
        - Mobile: stronger (rgba 0.75 → 0.55) so white text stays legible
          over whatever part of the image shows behind the text
        - Desktop: subtle left-side only so the image shines through on the right
      */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            /* mobile-first strong overlay */
            'linear-gradient(to bottom, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.55) 100%)',
          ].join(','),
          zIndex: 1,
        }}
      />
      {/* Desktop: replace with left-side gradient (via inline media — handled by sm class below) */}
      <div
        className="absolute inset-0 hidden sm:block"
        style={{
          background:
            'linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.30) 48%, rgba(0,0,0,0.04) 100%)',
          zIndex: 2,
        }}
      />

      {/* Gold left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ backgroundColor: '#F5A300', zIndex: 3 }}
      />

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 3 }}
      />

      {/* ── Content overlay ── */}
      <div
        className="absolute inset-0 flex flex-col justify-start sm:justify-center"
        style={{ zIndex: 4 }}
      >
        <div
          className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12"
          style={{
            paddingTop: 'clamp(108px, 18vw, 190px)',
            paddingBottom: '80px',
          }}
        >
          <div className="max-w-xl lg:max-w-2xl">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-3 sm:mb-5 hero-fade-1">
              <span
                className="px-3 py-1 text-xs font-black tracking-widest uppercase rounded-full"
                style={{ backgroundColor: '#F5A300', color: '#002B3D' }}
              >
                Mombasa Youth Rising · 2026
              </span>
              <span className="text-white/50 text-xs font-semibold hidden sm:inline">
                {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-white font-black leading-tight mb-3 sm:mb-4 hero-fade-2"
              style={{
                fontSize: 'clamp(1.45rem, 5vw, 3.25rem)',
                textShadow: '0 2px 14px rgba(0,0,0,0.5)',
              }}
            >
              Inside the Movement{' '}
              <br className="hidden sm:block" />
              <span style={{ color: '#F5A300' }}>Powering Innovation,</span>
              <br className="hidden sm:block" />
              Governance &amp; Change
            </h1>

            {/* Body copy */}
            <p
              className="text-white/90 text-sm sm:text-base lg:text-lg leading-relaxed mb-5 sm:mb-8 hero-fade-3"
              style={{ textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}
            >
              The Mombasa Youth Council is redefining youth engagement across the
              county — turning young voices into{' '}
              <strong className="text-white">leaders of development</strong>,
              not just participants.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8 hero-fade-4">
              <Link
                href="/register"
                className="inline-block px-5 sm:px-7 py-2.5 sm:py-3 font-bold text-sm rounded-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#F5A300', color: '#002B3D' }}
              >
                Join MYC Today
              </Link>
              <Link
                href="/about"
                className="inline-block px-5 sm:px-7 py-2.5 sm:py-3 border-2 text-white font-semibold text-sm rounded-lg hover:bg-white/10 transition-all"
                style={{ borderColor: 'rgba(255,255,255,0.55)' }}
              >
                Read the Story
              </Link>
            </div>

            {/* Stats — hidden on small phones to save vertical space */}
            <div className="hidden sm:flex flex-wrap gap-4 sm:gap-6 hero-fade-4">
              {[
                { value: '18–34', label: 'Age range' },
                { value: '5 000+', label: 'Youth engaged' },
                { value: '2026', label: 'Innovation Festival' },
              ].map((st) => (
                <div key={st.label} className="flex items-center gap-3">
                  <div
                    className="w-px h-8"
                    style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
                  />
                  <div>
                    <div
                      className="text-white font-black text-lg sm:text-xl leading-none"
                      style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}
                    >
                      {st.value}
                    </div>
                    <div
                      className="text-xs mt-0.5 uppercase tracking-wide"
                      style={{ color: '#00A8C8' }}
                    >
                      {st.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* ── Slide navigation ── */}
      <div
        className="absolute bottom-6 sm:bottom-8 left-0 right-0 flex items-center justify-center gap-3"
        style={{ zIndex: 5 }}
      >
        <button
          onClick={() => goTo((current - 1 + slides.length) % slides.length)}
          className="w-7 h-7 flex items-center justify-center rounded-full border border-white/30 text-white/70 hover:bg-white/20 hover:text-white transition-all"
          aria-label="Previous slide"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              className="rounded-full transition-all duration-500"
              style={{
                width: i === current ? '28px' : '8px',
                height: '8px',
                backgroundColor: i === current ? '#F5A300' : 'rgba(255,255,255,0.45)',
              }}
            />
          ))}
        </div>

        <button
          onClick={() => goTo((current + 1) % slides.length)}
          className="w-7 h-7 flex items-center justify-center rounded-full border border-white/30 text-white/70 hover:bg-white/20 hover:text-white transition-all"
          aria-label="Next slide"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Gold progress bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{ backgroundColor: 'rgba(255,255,255,0.1)', zIndex: 5 }}
      >
        <div
          key={current}
          className="h-full"
          style={{
            backgroundColor: '#F5A300',
            animation: 'heroProgress 6.5s linear forwards',
          }}
        />
      </div>

      {/* Bottom wave */}
      <div
        className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none"
        style={{ zIndex: 6 }}
      >
        <svg
          viewBox="0 0 1440 60"
          xmlns="http://www.w3.org/2000/svg"
          className="block w-full"
          preserveAspectRatio="none"
          style={{ height: '32px' }}
        >
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="var(--bg)" />
        </svg>
      </div>

      <style>{`
        @keyframes heroProgress {
          from { width: 0% }
          to   { width: 100% }
        }
      `}</style>
    </section>
  )
}
