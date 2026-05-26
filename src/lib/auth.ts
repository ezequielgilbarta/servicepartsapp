import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const SESSION_COOKIE = 'repuestos_session'
const SESSION_VALUE = 'authenticated'

export function isAuthenticated(): boolean {
  const cookieStore = cookies()
  const session = cookieStore.get(SESSION_COOKIE)
  return session?.value === SESSION_VALUE
}

export function requireAuth() {
  if (!isAuthenticated()) {
    redirect('/login')
  }
}

export function setAuthCookie() {
  cookies().set(SESSION_COOKIE, SESSION_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 días
    path: '/',
  })
}

export function clearAuthCookie() {
  cookies().delete(SESSION_COOKIE)
}
