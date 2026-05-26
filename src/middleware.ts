import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/login', '/api/auth/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route))

  if (isPublic) return NextResponse.next()

  const session = request.cookies.get('repuestos_session')
  if (session?.value !== 'authenticated') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
