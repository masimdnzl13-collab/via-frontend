'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function SifreYenile() {
  const [sifre, setSifre] = useState('');
  const [sifre2, setSifre2] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);
  const [tamam, setTamam] = useState(false);
  const [hazir, setHazir] = useState(false);

  useEffect(() => {
    // URL'deki token'ı yakala ve session oluştur
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setHazir(true);
      }
    });

    // Hash'ten token al
    const hash = window.location.hash;
    if (hash) {
      setHazir(true);
    }
  }, []);

  async function sifreGuncelle() {
    if (sifre !== sifre2) { alert('Şifreler eşleşmiyor!'); return; }
    if (sifre.length < 6) { alert('Şifre en az 6 karakter olmalı!'); return; }
    setYukleniyor(true);

    const { error } = await supabase.auth.updateUser({ password: sifre });

    if (error) {
      alert('Hata: ' + error.message);
      setYukleniyor(false);
      return;
    }

    setTamam(true);
    setYukleniyor(false);
    setTimeout(() => { window.location.href = '/giris'; }, 2000);
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <a href="/" className="text-2xl font-bold mb-10">
        VIA<span className="text-violet-500">.AI</span>
      </a>

      <div className="w-full max-w-md">
        {tamam ? (
          <div className="text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-2">Şifre güncellendi!</h2>
            <p className="text-zinc-400">Giriş sayfasına yönlendiriliyorsunuz...</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-2">Yeni şifre belirle</h2>
            <p className="text-zinc-400 mb-8">En az 6 karakter olsun.</p>
            <div className="space-y-4">
              <input
                type="password"
                placeholder="Yeni şifre"
                value={sifre}
                onChange={e => setSifre(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition"
              />
              <input
                type="password"
                placeholder="Şifreyi tekrarla"
                value={sifre2}
                onChange={e => setSifre2(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sifreGuncelle()}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition"
              />
              <button
                onClick={sifreGuncelle}
                disabled={yukleniyor || !sifre || !sifre2}
                className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-700 disabled:text-zinc-500 py-3 rounded-xl font-semibold transition"
              >
                {yukleniyor ? '⏳ Güncelleniyor...' : 'Şifreyi Güncelle →'}
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}