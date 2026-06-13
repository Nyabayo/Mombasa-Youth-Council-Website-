'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

const headlines = [
  'President Ray launches Innovation Festival 2026 · ',
  '#SheriaYaVijana rally unites youth across Mombasa · ',
  'MYC formalizes partnership with Kenya Red Cross · ',
  'Governance structure of MYC officially adopted · ',
  'Deputy President Jilo champions gender equality at Youth Forum · ',
]

export default function NewsTicker() {
  const tickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ticker = tickerRef.current
    if (!ticker) return
    let pos = 0
    const speed = 0.5
    const frame = () => {
      pos -= speed
      if (pos < -ticker.scrollWidth / 2) pos = 0
      ticker.style.transform = `translateX(${pos}px)`
      requestAnimationFrame(frame)
    }
    const raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [])

  const doubled = [...headlines, ...headlines]

  return (
    <div style={{ backgroundColor: '#001a52' }} className="flex items-stretch overflow-hidden">
      <div
        style={{ backgroundColor: '#003087' }}
        className="flex-shrink-0 px-4 py-2 text-white text-xs font-bold uppercase tracking-widest flex items-center"
      >
        Latest
      </div>
      <div className="flex-1 overflow-hidden relative">
        <div ref={tickerRef} className="whitespace-nowrap inline-flex py-2">
          {doubled.map((h, i) => (
            <Link
              key={i}
              href="/posts"
              className="text-white text-xs px-2 hover:text-blue-300 transition-colors"
            >
              {h}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
