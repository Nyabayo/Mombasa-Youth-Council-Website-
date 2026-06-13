import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/session'

const protectedRoutes = ['/dashboard']

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isProtected = protectedRoutes.some((r) => path.startsWith(r))

  if (!isProtected) return NextResponse.next()

  const token = request.cookies.get('myc_session')?.value
  const session = await decrypt(token)

  if (!session?.userId) {
    const loginUrl = new URL('/login', request.nextUrl)
    loginUrl.searchParams.set('from', path)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
