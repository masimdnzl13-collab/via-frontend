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
        if (satir.startsWith('[SKOR]')) {
          const metin = satir.replace('[SKOR]', '').trim();
          const parcalar = metin.split('|');
          const puan = parseInt(parcalar[1]?.trim() || '0');
          const renk = puan >= 8 ? 'text-green-400' : puan >= 5 ? 'text-amber-400' : 'text-red-400';
          const bg = puan >= 8 ? 'bg-green-500/10 border-green-500/30' : puan >= 5 ? 'bg-amber-500/10 border-amber-500/30' : 'bg-red-500/10 border-red-500/30';
          return (
            <div key={i} className={`${bg} border rounded-xl p-3 mt-1 flex items-center justify-between`}>
              <div>
                <p className="text-white font-semibold text-sm">{parcalar[0]?.trim()}</p>
                {parcalar[2] && <p className="text-zinc-400 text-xs mt-0.5">{parcalar[2].trim()}</p>}
              </div>
              <p className={`${renk} font-bold text-lg`}>{parcalar[1]?.trim()}</p>
            </div>
          );
        }
        if (satir.startsWith('[SORUN]')) {
          const metin = satir.replace('[SORUN]', '').trim();
          const parcalar = metin.split('|');
          return (
            <div key={i} className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mt-1">
              <p className="text-red-400 font-semibold text-sm mb-1">⚠️ {parcalar[0]?.trim()}</p>
              {parcalar[1] && <p className="text-zinc-400 text-xs">{parcalar[1].trim()}</p>}
            </div>
          );
        }
        if (satir.startsWith('[ONERI]')) {
          const metin = satir.replace('[ONERI]', '').trim();
          const parcalar = metin.split('|');
          return (
            <div key={i} className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-3 mt-1">
              <p className="text-violet-400 font-semibold text-sm mb-1">✅ {parcalar[0]?.trim()}</p>
              {parcalar[1] && <p className="text-zinc-300 text-xs">{parcalar[1].trim()}</p>}
            </div>
          );
        }
        if (satir.startsWith('[BIYOGRAFI]')) {
          const metin = satir.replace('[BIYOGRAFI]', '').trim();
          const parcalar = metin.split('|');
          return (
            <div key={i} className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1">
              <p className="text-xs text-zinc-500 mb-2">📝 Bio Analizi</p>
              {parcalar[0] && (
                <div className="mb-2">
                  <p className="text-xs text-zinc-500 mb-1">Mevcut:</p>
                  <p className="text-zinc-400 text-xs">{parcalar[0].trim()}</p>
                </div>
              )}
              {parcalar[1] && (
                <div>
                  <p className="text-xs text-green-400 mb-1">Önerilen:</p>
                  <p className="text-white text-sm font-medium">{parcalar[1].trim()}</p>
                </div>
              )}
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

export default function ProfilDenetim() {
  const [kullaniciAdi, setKullaniciAdi] = useState('');
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

  async function denetle() {
    if (!kullaniciAdi.trim() || yukleniyor) return;
    setYukleniyor(true);
    setSonuc('');

    try {
      const temizAd = kullaniciAdi.replace('@', '').replace('https://instagram.com/', '').replace('/', '').trim();
      const res = await fetch('/api/profil-denetim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kullaniciAdi: temizAd, profil }),
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
        <p className="text-xs text-zinc-500">Profil Denetimi</p>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Profil Denetimi 📋</h1>
          <p className="text-zinc-400 text-sm">Instagram kullanıcı adını gir, AI profilini baştan aşağı analiz etsin.</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-6">
          <label className="text-xs text-zinc-500 mb-2 block">Instagram Kullanıcı Adı</label>
          <div className="flex gap-2">
            <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-xl px-3 text-zinc-500 text-sm">@</div>
            <input
              type="text"
              value={kullaniciAdi}
              onChange={e => setKullaniciAdi(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && denetle()}
              placeholder="kullaniciadi"
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition"
            />
          </div>
          <button
            onClick={denetle}
            disabled={yukleniyor || !kullaniciAdi.trim()}
            className="w-full mt-3 bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-700 disabled:text-zinc-500 py-3 rounded-xl text-sm font-semibold transition"
          >
            {yukleniyor ? 'Analiz ediliyor...' : 'Profili Denetle →'}
          </button>
        </div>

        {yukleniyor && (
          <div className="flex items-center gap-3 text-zinc-400 text-sm px-2 mb-4">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}/>
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}/>
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}/>
            </div>
            Profil inceleniyor...
          </div>
        )}

        {sonuc && <SonucKarti icerik={sonuc} />}
      </div>
    </main>
  );
}