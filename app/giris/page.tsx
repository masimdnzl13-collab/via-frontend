'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function Giris() {
  const [yukleniyor, setYukleniyor] = useState(false);
  const [form, setForm] = useState({
    email: '',
    sifre: '',
  });

  async function girisYap() {
    setYukleniyor(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.sifre,
    });

    if (error) {
      alert('Hata: ' + error.message);
      setYukleniyor(false);
      return;
    }

    window.location.href = '/dashboard';
    setYukleniyor(false);
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      
      <div className="text-2xl font-bold mb-10">
        via<span className="text-violet-500">.ai</span>
      </div>

      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2">Giriş yap</h2>
        <p className="text-zinc-400 mb-8">Hesabına devam et.</p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="E-posta adresin"
            value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition"
          />
          <input
            type="password"
            placeholder="Şifre"
            value={form.sifre}
            onChange={e => setForm({...form, sifre: e.target.value})}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition"
          />
          <button
            onClick={girisYap}
            disabled={yukleniyor || !form.email || !form.sifre}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-700 disabled:text-zinc-500 py-3 rounded-xl font-semibold transition"
          >
            {yukleniyor ? '⏳ Giriş yapılıyor...' : 'Giriş Yap →'}
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