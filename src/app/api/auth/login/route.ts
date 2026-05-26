import { NextResponse } from 'next/server'
import { setAuthCookie } from '@/lib/auth'

export async function POST(request: Request) {
  const { password } = await request.json()
  const correctPassword = process.env.APP_PASSWORD

  if (!correctPassword) {
    return NextResponse.json({ error: 'APP_PASSWORD not configured' }, { status: 500 })
  }

  if (password !== correctPassword) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  setAuthCookie()
  return NextResponse.json({ ok: true })
}
