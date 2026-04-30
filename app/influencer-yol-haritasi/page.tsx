'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

function SonucKarti({ icerik }: { icerik: string }) {
  const satirlar = icerik.split('\n').filter(s => s.trim());
  const [acikAsamalar, setAcikAsamalar] = useState<number[]>([0]);

  const asamalar: { baslik: string; satirlar: string[]; index: number }[] = [];
  let mevcutAsama: { baslik: string; satirlar: string[]; index: number } | null = null;
  const genelSatirlar: { satir: string; i: number }[] = [];

  satirlar.forEach((satir, i) => {
    if (satir.startsWith('[ASAMA]')) {
      if (mevcutAsama) asamalar.push(mevcutAsama);
      mevcutAsama = { baslik: satir, satirlar: [], index: asamalar.length };
    } else if (mevcutAsama) {
      mevcutAsama.satirlar.push(satir);
    } else {
      genelSatirlar.push({ satir, i });
    }
  });
  if (mevcutAsama) asamalar.push(mevcutAsama);

  function satirRender(satir: string, i: number) {
    if (satir.startsWith('[BASLIK]')) {
      return (
        <div key={i} className="bg-gradient-to-r from-pink-600/20 to-violet-600/20 border border-pink-500/40 rounded-xl px-4 py-3 mt-3">
          <p className="text-pink-300 font-semibold">{satir.replace('[BASLIK]', '').trim()}</p>
        </div>
      );
    }
    if (satir.startsWith('[OZET]')) {
      const p = satir.replace('[OZET]', '').trim().split('|');
      return (
        <div key={i} className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 mt-2">
          <p className="text-white font-bold mb-2">🗺️ {p[0]?.trim()}</p>
          <div className="flex gap-3 flex-wrap">
            {p[1] && <span className="bg-violet-500/20 text-violet-300 text-xs px-3 py-1 rounded-full">⏱ {p[1].trim()}</span>}
            {p[2] && <span className="bg-green-500/20 text-green-300 text-xs px-3 py-1 rounded-full">🎯 {p[2].trim()}</span>}
          </div>
        </div>
      );
    }
    if (satir.startsWith('[HAFTALIK]')) {
      const p = satir.replace('[HAFTALIK]', '').trim().split('|');
      return (
        <div key={i} className="flex items-start gap-3 bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1 ml-2">
          <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">
            H{p[0]?.trim()}
          </div>
          <div>
            <p className="text-white text-sm font-medium">{p[1]?.trim()}</p>
            {p[2] && <p className="text-zinc-400 text-xs mt-0.5">{p[2].trim()}</p>}
          </div>
        </div>
      );
    }
    if (satir.startsWith('[FORMAT]')) {
      const p = satir.replace('[FORMAT]', '').trim().split('|');
      return (
        <div key={i} className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-3 mt-1">
          <p className="text-violet-400 font-semibold text-sm mb-1">🎬 {p[0]?.trim()}</p>
          {p[1] && <p className="text-zinc-300 text-xs mb-1">{p[1].trim()}</p>}
          {p[2] && <p className="text-zinc-500 text-xs italic">Örnek: {p[2].trim()}</p>}
        </div>
      );
    }
    if (satir.startsWith('[ALGORITMA]')) {
      const p = satir.replace('[ALGORITMA]', '').trim().split('|');
      return (
        <div key={i} className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 mt-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{p[0]?.trim()}</span>
            <p className="text-blue-400 font-semibold text-sm">{p[1]?.trim()}</p>
          </div>
          {p[2] && <p className="text-zinc-300 text-xs">{p[2].trim()}</p>}
        </div>
      );
    }
    if (satir.startsWith('[MONETIZASYON]')) {
      const p = satir.replace('[MONETIZASYON]', '').trim().split('|');
      return (
        <div key={i} className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mt-1">
          <p className="text-amber-400 font-semibold text-sm mb-1">💰 {p[0]?.trim()}</p>
          {p[1] && <p className="text-zinc-400 text-xs mb-1">Ne zaman: {p[1].trim()}</p>}
          {p[2] && (
            <div className="bg-amber-500/10 rounded-lg px-2 py-1 mt-1">
              <p className="text-amber-300 text-xs font-bold">{p[2].trim()}</p>
            </div>
          )}
        </div>
      );
    }
    if (satir.startsWith('[HATA]')) {
      const p = satir.replace('[HATA]', '').trim().split('|');
      return (
        <div key={i} className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mt-1">
          <p className="text-red-400 font-semibold text-sm mb-1">⚠️ {p[0]?.trim()}</p>
          {p[1] && <p className="text-zinc-400 text-xs mb-1">{p[1].trim()}</p>}
          {p[2] && <p className="text-green-400 text-xs">✓ Doğrusu: {p[2].trim()}</p>}
        </div>
      );
    }
    if (satir.startsWith('[ORNEK]')) {
      const p = satir.replace('[ORNEK]', '').trim().split('|');
      return (
        <div key={i} className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1">
          <p className="text-white font-semibold text-sm mb-1">👤 {p[0]?.trim()}</p>
          {p[1] && <p className="text-zinc-300 text-xs mb-1">{p[1].trim()}</p>}
          {p[2] && <p className="text-zinc-500 text-xs italic">{p[2].trim()}</p>}
        </div>
      );
    }
    if (satir.startsWith('[IPUCU]')) {
      return (
        <div key={i} className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 mt-1">
          <p className="text-zinc-300 text-xs">📌 {satir.replace('[IPUCU]', '').trim()}</p>
        </div>
      );
    }
    return null;
  }

  const asamaRenkleri = [
    { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', badge: 'bg-blue-600' },
    { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-400', badge: 'bg-violet-600' },
    { bg: 'bg-pink-500/10', border: 'border-pink-500/30', text: 'text-pink-400', badge: 'bg-pink-600' },
    { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', badge: 'bg-amber-600' },
  ];

  return (
    <div className="space-y-2">
      {genelSatirlar.map(({ satir, i }) => satirRender(satir, i))}

      {asamalar.length > 0 && (
        <div className="mt-6">
          <p className="text-xs text-zinc-500 mb-3">🗺️ Büyüme Yol Haritası ({asamalar.length} aşama)</p>

          {/* İlerleme çubuğu */}
          <div className="flex gap-1 mb-4">
            {asamalar.map((_, ai) => (
              <div key={ai} className={`h-1.5 flex-1 rounded-full ${asamaRenkleri[ai % asamaRenkleri.length].badge}`} />
            ))}
          </div>

          <div className="space-y-3">
            {asamalar.map((asama, ai) => {
              const p = asama.baslik.replace('[ASAMA]', '').trim().split('|');
              const renk = asamaRenkleri[ai % asamaRenkleri.length];
              const acik = acikAsamalar.includes(ai);
              return (
                <div key={ai} className={`${renk.bg} border ${renk.border} rounded-2xl overflow-hidden`}>
                  <button
                    onClick={() => setAcikAsamalar(prev =>
                      prev.includes(ai) ? prev.filter(x => x !== ai) : [...prev, ai]
                    )}
                    className="w-full flex items-center justify-between px-4 py-3 hover:brightness-110 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`${renk.badge} text-white text-xs font-bold px-3 py-1 rounded-lg`}>
                        {p[1]?.trim()}
                      </div>
                      <div className="text-left">
                        <p className={`${renk.text} font-bold text-sm`}>{p[0]?.trim()}</p>
                        {p[2] && <p className="text-zinc-500 text-xs">{p[2].trim()}</p>}
                      </div>
                    </div>
                    <span className="text-zinc-500 text-xs">{acik ? '▲' : '▼'}</span>
                  </button>
                  {acik && (
                    <div className="px-4 pb-4 space-y-2">
                      {asama.satirlar.map((satir, si) => satirRender(satir, si + ai * 100))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function InfluencerYolHaritasi() {
  const [profil, setProfil] = useState<any>(null);
  const [sonuc, setSonuc] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);
  const [form, setForm] = useState({
    mevcutTakipci: '',
    hedefTakipci: '',
    sure: '6 ay',
  });

  useEffect(() => {
    async function profilGetir() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/giris'; return; }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfil(data);
    }
    profilGetir();
  }, []);

  async function yolHaritasiOlustur() {
    if (yukleniyor) return;
    setYukleniyor(true);
    setSonuc('');

    try {
      const res = await fetch('/api/influencer-yol-haritasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profil, ...form }),
      });
      const data = await res.json();
      setSonuc(data.cevap);
    } catch {
      setSonuc('[IPUCU] Bir hata oluştu, tekrar dene.');
    }
    setYukleniyor(false);
  }

  const sureler = ['1 ay', '3 ay', '6 ay', '1 yıl', '2 yıl'];

  const takipciSecenekleri = [
    '0', '100', '500', '1.000', '5.000', '10.000', '50.000', '100.000'
  ];
  const hedefSecenekleri = [
    '1.000', '5.000', '10.000', '50.000', '100.000', '500.000', '1.000.000'
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-black/90 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <a href="/sahis-dashboard" className="text-zinc-500 hover:text-white transition text-sm">← Dashboard</a>
          <div className="text-lg font-bold">VIA<span className="text-violet-500">.AI</span></div>
        </div>
        <p className="text-xs text-zinc-500">Influencer Yol Haritası</p>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Influencer Yol Haritası 🗺️</h1>
          <p className="text-zinc-400 text-sm">Mevcut takipçinden hedefine giden adım adım büyüme planı.</p>
        </div>

        {!sonuc && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-6">
            {profil && (
              <div className="bg-zinc-800 rounded-xl p-3 mb-4">
                <p className="text-xs text-zinc-500 mb-1">Niş / Alan</p>
                <p className="text-white font-semibold">{profil.isletme_adi}</p>
                <p className="text-zinc-400 text-xs">{profil.sektor} · {profil.sehir}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs text-zinc-500 mb-2 block">Mevcut Takipçi Sayısı</label>
                <div className="flex flex-wrap gap-2">
                  {takipciSecenekleri.map(s => (
                    <button
                      key={s}
                      onClick={() => setForm(prev => ({ ...prev, mevcutTakipci: s }))}
                      className={`px-3 py-1.5 rounded-xl text-sm transition ${
                        form.mevcutTakipci === s
                          ? 'bg-pink-600 text-white font-semibold'
                          : 'bg-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Veya manuel gir..."
                  value={form.mevcutTakipci}
                  onChange={e => setForm(prev => ({ ...prev, mevcutTakipci: e.target.value }))}
                  className="w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-pink-500 transition"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-500 mb-2 block">Hedef Takipçi Sayısı</label>
                <div className="flex flex-wrap gap-2">
                  {hedefSecenekleri.map(s => (
                    <button
                      key={s}
                      onClick={() => setForm(prev => ({ ...prev, hedefTakipci: s }))}
                      className={`px-3 py-1.5 rounded-xl text-sm transition ${
                        form.hedefTakipci === s
                          ? 'bg-violet-600 text-white font-semibold'
                          : 'bg-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Veya manuel gir..."
                  value={form.hedefTakipci}
                  onChange={e => setForm(prev => ({ ...prev, hedefTakipci: e.target.value }))}
                  className="w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-500 mb-2 block">Süre Hedefi</label>
                <div className="flex flex-wrap gap-2">
                  {sureler.map(s => (
                    <button
                      key={s}
                      onClick={() => setForm(prev => ({ ...prev, sure: s }))}
                      className={`px-4 py-2 rounded-xl text-sm transition ${
                        form.sure === s
                          ? 'bg-violet-600 text-white font-semibold'
                          : 'bg-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={yolHaritasiOlustur}
                disabled={yukleniyor || !form.mevcutTakipci || !form.hedefTakipci}
                className="w-full bg-gradient-to-r from-pink-600 to-violet-600 hover:opacity-90 disabled:from-zinc-700 disabled:to-zinc-700 disabled:text-zinc-500 py-3 rounded-xl text-sm font-semibold transition"
              >
                {yukleniyor ? 'Yol haritası hazırlanıyor...' : '🗺️ Yol Haritamı Oluştur'}
              </button>
            </div>
          </div>
        )}

        {yukleniyor && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center mb-4">
            <div className="flex justify-center gap-1 mb-3">
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}/>
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}/>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}/>
            </div>
            <p className="text-zinc-400 text-sm">Başarılı influencer stratejileri araştırılıyor...</p>
            <p className="text-zinc-600 text-xs mt-1">{profil?.sektor} nişi için özel yol haritası hazırlanıyor</p>
          </div>
        )}

        {sonuc && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-zinc-400">Yol haritanız hazır 🗺️</p>
              <button onClick={() => setSonuc('')}
                className="text-xs text-zinc-500 hover:text-white transition">
                ← Yeniden Oluştur
              </button>
            </div>
            <SonucKarti icerik={sonuc} />
          </div>
        )}
      </div>
    </main>
  );
}