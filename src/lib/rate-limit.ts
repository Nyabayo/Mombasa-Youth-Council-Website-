import 'server-only'

interface Entry { count: number; reset: number }
const store = new Map<string, Entry>()

setInterval(() => {
  const now = Date.now()
  for (const [key, e] of store) if (now > e.reset) store.delete(key)
}, 60_000).unref?.()

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; retryAfter: number } {
  const now = Date.now()
  const e = store.get(key)

  if (!e || now > e.reset) {
    store.set(key, { count: 1, reset: now + windowMs })
    return { allowed: true, retryAfter: 0 }
  }

  if (e.count >= limit) {
    return { allowed: false, retryAfter: Math.ceil((e.reset - now) / 1000) }
  }

  e.count++
  return { allowed: true, retryAfter: 0 }
}
