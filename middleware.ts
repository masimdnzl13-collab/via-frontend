import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  const path = req.nextUrl.pathname

  // Eğer kullanıcı giriş yapmamışsa ve dashboard'a gitmeye çalışıyorsa LOGIN'e at
  if (!session && (path.startsWith('/dashboard') || path.startsWith('/sahis-dashboard'))) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Eğer kullanıcı giriş yapmışsa ve LOGIN sayfasına gitmeye çalışıyorsa DASHBOARD'a at
  if (session && path === '/login') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/sahis-dashboard/:path*', '/login'],
}