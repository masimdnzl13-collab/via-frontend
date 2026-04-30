import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const type = searchParams.get('type');

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Şifre sıfırlama ise sifre-yenile sayfasına git
  if (type === 'recovery') {
    return NextResponse.redirect(new URL('/sifre-yenile', req.url));
  }

  // Normal giriş ise profil türüne göre yönlendir
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: profil } = await supabase
      .from('profiles')
      .select('kullanici_turu')
      .eq('id', user.id)
      .single();

    if (profil?.kullanici_turu === 'sahis') {
      return NextResponse.redirect(new URL('/sahis-dashboard', req.url));
    }
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.redirect(new URL('/giris', req.url));
}