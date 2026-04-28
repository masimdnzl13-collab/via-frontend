'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

function SonucKarti({ icerik }: { icerik: string }) {
  const satirlar = icerik.split('\n').filter(s => s.trim());

  return (
    <div className="space-y-2">
      {satirlar.map((satir, i) => {
        if (satir.startsWith('[BASLIK]')) {
          const metin = satir.replace('[BASLIK]', '').trim();
          return (
            <div key={i} className="bg-violet-600/20 border border-violet-500/40 rounded-xl px-4 py-3 mt-3">
              <p className="text-violet-300 font-semibold">{metin}</p>
            </div>
          );
        }
        if (satir.startsWith('[RAKIP]')) {
          const metin = satir.replace('[RAKIP]', '').trim();
          const parcalar = metin.split('|');
          return (
            <div key={i} className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1">
              <p className="text-white font-semibold text-sm mb-1">👤 {parcalar[0]?.trim()}</p>
              {parcalar[1] && <p className="text-zinc-400 text-xs">Takipçi: {parcalar[1].trim()}</p>}
              {parcalar[2] && <p className="text-zinc-400 text-xs">Sıklık: {parcalar[2].trim()}</p>}
            </div>
          );
        }
        if (satir.startsWith('[FORMAT]')) {
          const metin = satir.replace('[FORMAT]', '').trim();
          const parcalar = metin.split('|');
          return (
            <div key={i} className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 mt-1">
              <p className="text-blue-400 font-semibold text-sm mb-1">🎬 {parcalar[0]?.trim()}</p>
              {parcalar[1] && <p className="text-zinc-400 text-xs mb-1">{parcalar[1].trim()}</p>}
              {parcalar[2] && <p className="text-zinc-300 text-xs">Etkileşim: {parcalar[2].trim()}</p>}
            </div>
          );
        }
        if (satir.startsWith('[BOSLUK]')) {
          const metin = satir.replace('[BOSLUK]', '').trim();
          const parcalar = metin.split('|');
          return (
            <div key={i} className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 mt-1">
              <p className="text-green-400 font-semibold text-sm mb-1">🎯 Fırsat: {parcalar[0]?.trim()}</p>
              {parcalar[1] && <p className="text-zinc-400 text-xs mb-1">{parcalar[1].trim()}</p>}
              {parcalar[2] && <p className="text-zinc-300 text-xs">{parcalar[2].trim()}</p>}
            </div>
          );
        }
        if (satir.startsWith('[ONERI]')) {
          const metin = satir.replace('[ONERI]', '').trim();
          const parcalar = metin.split('|');
          return (
            <div key={i} className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-3 mt-1">
              <p className="text-violet-400 font-semibold text-sm mb-1">💡 {parcalar[0]?.trim()}</p>
              {parcalar[1] && <p className="text-zinc-300 text-xs">{parcalar[1].trim()}</p>}
            </div>
          );
        }
        if (satir.startsWith('[IPUCU]')) {
          const metin = satir.replace('[IPUCU]', '').trim();
          return (
            <div key={i} className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2 mt-1">
              <p className="text-amber-400 text-sm">⚡ {metin}</p>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

export default function RakipAnalizi() {
  const [rakipLink, setRakipLink] = useState('');
  const [sonuc, setSonuc] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);
  const [profil, setProfil] = useState<any>(null);

  useEffect(() => {
    async function profilGetir() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/giris'; return; }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfil(data);
    }
    profilGetir();
  }, []);

  async function analizeEt() {
    if (!rakipLink.trim() || yukleniyor) return;
    setYukleniyor(true);
    setSonuc('');

    try {
      const res = await fetch('/api/rakip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rakipLink, profil }),
      });
      const data = await res.json();
      setSonuc(data.cevap);
    } catch {
      setSonuc('[IPUCU] Bir hata oluştu, tekrar dene.');
    }
    setYukleniyor(false);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-black/90 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <a href="/dashboard" className="text-zinc-500 hover:text-white transition text-sm">← Dashboard</a>
          <div className="text-lg font-bold">via<span className="text-violet-500">.ai</span></div>
        </div>
        <p className="text-xs text-zinc-500">Rakip Analizi</p>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Rakip Analizi 🔍</h1>
          <p className="text-zinc-400 text-sm">Rakibinin Instagram veya TikTok linkini gir, AI stratejini belirlesin.</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-6">
          <label className="text-xs text-zinc-500 mb-2 block">Rakip Hesap Linki</label>
          <input
            type="text"
            value={rakipLink}
            onChange={e => setRakipLink(e.target.value)}
            placeholder="https://instagram.com/rakiphesap"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition mb-3"
          />
          <button
            onClick={analizeEt}
            disabled={yukleniyor || !rakipLink.trim()}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-700 disabled:text-zinc-500 py-3 rounded-xl text-sm font-semibold transition"
          >
            {yukleniyor ? 'Analiz ediliyor...' : 'Analiz Et →'}
          </button>
        </div>

        {yukleniyor && (
          <div className="flex items-center gap-3 text-zinc-400 text-sm px-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}/>
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}/>
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}/>
            </div>
            Rakip hesap araştırılıyor...
          </div>
        )}

        {sonuc && <SonucKarti icerik={sonuc} />}
      </div>
    </main>
  );
}