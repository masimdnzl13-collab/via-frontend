'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function Giris() {
  const [yukleniyor, setYukleniyor] = useState(false);
  const [form, setForm] = useState({ email: '', sifre: '' });
  const router = useRouter();

  // ADIM: Oturum kontrolü - Eğer kullanıcı zaten giriş yapmışsa direkt yönlendir
  useEffect(() => {
    const oturumKontrol = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        yonlendir(session.user.id);
      }
    };
    oturumKontrol();
  }, []);

  // YARDIMCI FONKSİYON: Kullanıcıyı profiles tablosundaki rolüne göre yönlendirir
  async function yonlendir(userId) {
    try {
      const { data: profil, error } = await supabase
        .from('profiles')
        .select('kullanici_turu')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Profil çekilemedi:", error);
        // Profil bulunamazsa güvenli bir varsayılan sayfaya at
        router.push('/dashboard');
        return;
      }

      // Rol kontrolü yaparak ilgili sayfaya gönder
      if (profil?.kullanici_turu === 'sahis') {
        router.push('/sahis-dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error("Yönlendirme hatası:", err);
      router.push('/dashboard');
    }
  }

  // E-posta ve Şifre ile giriş
  async function girisYap() {
    setYukleniyor(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.sifre,
    });

    if (error) {
      alert('Hata: ' + error.message);
      setYukleniyor(false);
      return;
    }

    if (data?.user) {
      // Başarılı girişte rol kontrolüne git
      await yonlendir(data.user.id);
    }
    
    setYukleniyor(false);
  }

  // OAuth ile giriş
  async function googleIleGiris() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { 
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        }
      },
    });
    if (error) alert('Hata: ' + error.message);
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <a href="/" className="text-2xl font-bold mb-10">
        VIA<span className="text-violet-500">.AI</span>
      </a>

      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2">Giriş yap</h2>
        <p className="text-zinc-400 mb-8">Hesabına devam et.</p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="E-posta adresin"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition"
          />
          <input
            type="password"
            placeholder="Şifre"
            value={form.sifre}
            onChange={e => setForm({ ...form, sifre: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && girisYap()}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition"
          />
          <button
            onClick={girisYap}
            disabled={yukleniyor || !form.email || !form.sifre}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-700 disabled:text-zinc-500 py-3 rounded-xl font-semibold transition flex items-center justify-center"
          >
            {yukleniyor ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Giriş yapılıyor...
              </span>
            ) : 'Giriş Yap →'}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-zinc-600 text-xs">veya</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          <button
            onClick={googleIleGiris}
            className="w-full bg-white text-black py-3 rounded-xl font-semibold transition hover:bg-zinc-100 flex items-center justify-center gap-3"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
              <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
              <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
              <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
            </svg>
            Google ile Giriş Yap
          </button>

          <p className="text-center text-zinc-500 text-sm">
            Hesabın yok mu?{' '}
            <a href="/kayit" className="text-violet-400 hover:text-violet-300 transition">
              Ücretsiz kaydol
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}