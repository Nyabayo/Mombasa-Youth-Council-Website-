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
    const particles = Array.from({ length: 28 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.8 + 0.4,
      dx: (Math.random() - 0.5) * 0.3, dy: -(Math.random() * 0.5 + 0.15),
      o: Math.random() * 0.4 + 0.08,
    }))
    let raf: number
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of particles) {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${p.o})`; ctx.fill()
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
      className="relative"
      style={{
        marginTop: '-100px',
        minHeight: '100svh',
        overflow: 'hidden',
      }}
    >
      {/* ── Background images ─────────────────────────────────── */}
      {slides.map((s, i) => (
        <img
          key={s.bg}
          src={s.bg}
          alt={`Slide ${i + 1}`}
          className="absolute inset-0 w-full h-full"
          style={{
            objectFit: 'cover',
            objectPosition: s.position ?? 'center 20%',
            opacity: i === current ? 1 : 0,
            transition: 'opacity 1.4s ease-in-out',
          }}
        />
      ))}

      {/* ── Gradient overlay ──────────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.10) 100%)',
          zIndex: 1,
        }}
      />

      {/* Gold left accent */}
      <div
        className="absolute left-0 inset-y-0 w-1"
        style={{ backgroundColor: '#F5A300', zIndex: 2 }}
      />

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 2 }}
      />

      {/* ── Text content ──────────────────────────────────────── */}
      {/*
        Uses flex-col on the outer absolute div so padding-top clears the
        fixed header, and flex-1 + justify-center on the inner wrapper
        vertically centres the text block in the remaining space.
        This works on every screen size without clipping.
      */}
      <div
        className="absolute inset-0 flex flex-col"
        style={{
          zIndex: 3,
          paddingTop: 'clamp(108px, 14vh, 180px)',
          paddingBottom: 'clamp(70px, 10vh, 120px)',
        }}
      >
        <div className="flex-1 flex flex-col justify-center w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="w-full max-w-xl lg:max-w-2xl">

            {/* Badge */}
            <div className="flex flex-wrap items-center gap-2 mb-4 hero-fade-1">
              <span
                className="px-3 py-1 text-xs font-black tracking-widest uppercase rounded-full whitespace-nowrap"
                style={{ backgroundColor: '#F5A300', color: '#002B3D' }}
              >
                Mombasa Youth Rising · 2026
              </span>
              <span className="text-white/50 text-xs font-semibold tabular-nums">
                {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-white font-black leading-tight mb-4 hero-fade-2"
              style={{
                fontSize: 'clamp(1.5rem, 4.5vw, 3.25rem)',
                textShadow: '0 2px 16px rgba(0,0,0,0.55)',
              }}
            >
              Inside the Movement
              <br />
              <span style={{ color: '#F5A300' }}>Powering Innovation,</span>
              <br />
              Governance &amp; Change
            </h1>

            {/* Body copy */}
            <p
              className="text-white/90 leading-relaxed mb-6 hero-fade-3"
              style={{
                fontSize: 'clamp(0.875rem, 1.8vw, 1.125rem)',
                textShadow: '0 1px 8px rgba(0,0,0,0.5)',
              }}
            >
              The Mombasa Youth Council is redefining youth engagement across the
              county — turning young voices into{' '}
              <strong className="text-white">leaders of development</strong>,
              not just participants.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-8 hero-fade-4">
              <Link
                href="/register"
                className="inline-block font-bold rounded-lg hover:opacity-90 transition-opacity"
                style={{
                  backgroundColor: '#F5A300',
                  color: '#002B3D',
                  padding: 'clamp(10px,1.5vh,14px) clamp(18px,3vw,28px)',
                  fontSize: 'clamp(0.8rem,1.4vw,0.9375rem)',
                }}
              >
                Join MYC Today
              </Link>
              <Link
                href="/about"
                className="inline-block border-2 text-white font-semibold rounded-lg hover:bg-white/10 transition-all"
                style={{
                  borderColor: 'rgba(255,255,255,0.55)',
                  padding: 'clamp(10px,1.5vh,14px) clamp(18px,3vw,28px)',
                  fontSize: 'clamp(0.8rem,1.4vw,0.9375rem)',
                }}
              >
                Read the Story
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-x-6 gap-y-3 hero-fade-4">
              {[
                { value: '18–34', label: 'Age range' },
                { value: '5 000+', label: 'Youth engaged' },
                { value: '2026', label: 'Innovation Festival' },
              ].map((st) => (
                <div key={st.label} className="flex items-center gap-2">
                  <div className="w-px h-7 opacity-30 bg-white" />
                  <div>
                    <div
                      className="font-black leading-none text-white"
                      style={{ fontSize: 'clamp(1rem,2vw,1.25rem)' }}
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

      {/* ── Dot / arrow navigation ────────────────────────────── */}
      <div
        className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-3"
        style={{ zIndex: 4 }}
      >
        <button
          onClick={() => goTo((current - 1 + slides.length) % slides.length)}
          className="w-7 h-7 flex items-center justify-center rounded-full border border-white/30 text-white/70 hover:bg-white/20 hover:text-white transition-all"
          aria-label="Previous"
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
              aria-label={`Go to slide ${i + 1}`}
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
          aria-label="Next"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* ── Progress bar ──────────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{ backgroundColor: 'rgba(255,255,255,0.12)', zIndex: 4 }}
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

      {/* ── Bottom wave ───────────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none"
        style={{ zIndex: 5 }}
      >
        <svg
          viewBox="0 0 1440 56"
          xmlns="http://www.w3.org/2000/svg"
          className="block w-full"
          preserveAspectRatio="none"
          style={{ height: '28px' }}
        >
          <path d="M0,28 C360,56 1080,0 1440,28 L1440,56 L0,56 Z" fill="var(--bg)" />
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
