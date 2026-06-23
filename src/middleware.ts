import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/session'

const protectedRoutes = ['/dashboard']

const SECURITY_HEADERS: Record<string, string> = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isProtected = protectedRoutes.some((r) => path.startsWith(r))

  let response: NextResponse

  if (isProtected) {
    const token = request.cookies.get('myc_session')?.value
    const session = await decrypt(token)

    if (!session?.userId) {
      const loginUrl = new URL('/login', request.nextUrl)
      // Only allow safe internal paths as redirect targets
      if (path.startsWith('/') && !path.startsWith('//')) {
        loginUrl.searchParams.set('from', path)
      }
      response = NextResponse.redirect(loginUrl)
    } else {
      response = NextResponse.next()
    }
  } else {
    response = NextResponse.next()
  }

  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value)
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
