import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const KORUNALI_ROTALAR = [
  '/dashboard',
  '/sahis-dashboard',
  '/icerik',
  '/profil',
  '/ayarlar',
  '/abonelik',
  '/aylik-rapor',
  '/algoritma-seo',
  '/icerik-serisi',
  '/kriz-yonetimi',
  '/lansman',
  '/musteri-analizi',
  '/paylasimla-buyume',
  '/performans-tahmin',
  '/profil-denetim',
  '/rakip-analizi',
  '/saat-bulucu',
  '/trend-surfcu',
  '/influencer-yol-haritasi',
  '/nis-bulucu',
  '/isbirligi-teklif',
  '/gelir-hesaplayici',
  '/viral-kanca',
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;
  const korunuyor = KORUNALI_ROTALAR.some(rota => pathname.startsWith(rota));

  if (korunuyor && !session) {
    const girisUrl = new URL('/giris', req.url);
    girisUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(girisUrl);
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/|giris|kayit|$).*)'],
};