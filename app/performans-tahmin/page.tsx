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
          const skorMetin = parcalar[0]?.trim() || '';
          const sayi = parseInt(skorMetin.replace('%', ''));
          const renk = sayi >= 70 ? 'text-green-400' : sayi >= 40 ? 'text-amber-400' : 'text-red-400';
          const bg = sayi >= 70 ? 'bg-green-500/10 border-green-500/30' : sayi >= 40 ? 'bg-amber-500/10 border-amber-500/30' : 'bg-red-500/10 border-red-500/30';
          const cubukRenk = sayi >= 70 ? 'bg-green-500' : sayi >= 40 ? 'bg-amber-500' : 'bg-red-500';
          return (
            <div key={i} className={`${bg} border rounded-xl p-4 mt-2`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-white font-semibold text-sm">🎯 Viral Olma İhtimali</p>
                <p className={`${renk} font-bold text-3xl`}>{skorMetin}</p>
              </div>
              <div className="w-full bg-zinc-700 rounded-full h-2 mb-3">
                <div
                  className={`${cubukRenk} h-2 rounded-full transition-all`}
                  style={{ width: `${Math.min(sayi, 100)}%` }}
                />
              </div>
              {parcalar[1] && <p className="text-zinc-400 text-xs">{parcalar[1].trim()}</p>}
            </div>
          );
        }

        if (satir.startsWith('[GERCEKCE]')) {
          const metin = satir.replace('[GERCEKCE]', '').trim();
          const parcalar = metin.split('|');
          return (
            <div key={i} className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1">
              <p className="text-white font-semibold text-sm mb-1">📊 {parcalar[0]?.trim()}</p>
              {parcalar[1] && <p className="text-zinc-400 text-xs">{parcalar[1].trim()}</p>}
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

        if (satir.startsWith('[DUZELTME]')) {
          const metin = satir.replace('[DUZELTME]', '').trim();
          const parcalar = metin.split('|');
          return (
            <div key={i} className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 mt-1">
              <p className="text-blue-400 font-semibold text-sm mb-1">🔧 {parcalar[0]?.trim()}</p>
              {parcalar[1] && <p className="text-zinc-300 text-xs">{parcalar[1].trim()}</p>}
            </div>
          );
        }

        if (satir.startsWith('[OPTIMIZE]')) {
          const metin = satir.replace('[OPTIMIZE]', '').trim();
          const parcalar = metin.split('|');
          return (
            <div key={i} className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 mt-1">
              <p className="text-green-400 font-semibold text-sm mb-1">✨ Optimize Edilmiş Versiyon</p>
              {parcalar[0] && <p className="text-zinc-300 text-xs mb-2">{parcalar[0].trim()}</p>}
              {parcalar[1] && (
                <div className="bg-green-500/20 rounded-lg px-3 py-1 inline-block">
                  <p className="text-green-300 font-bold text-sm">Yeni Tahmini Skor: {parcalar[1].trim()}</p>
                </div>
              )}
            </div>
          );
        }

        if (satir.startsWith('[PLATFORM]')) {
          const metin = satir.replace('[PLATFORM]', '').trim();
          const parcalar = metin.split('|');
          return (
            <div key={i} className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-3 mt-1">
              <p className="text-violet-400 font-semibold text-sm mb-1">📱 {parcalar[0]?.trim()}</p>
              {parcalar[1] && <p className="text-zinc-400 text-xs mb-1">{parcalar[1].trim()}</p>}
              {parcalar[2] && <p className="text-zinc-300 text-xs">⏰ {parcalar[2].trim()}</p>}
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

export default function PerformansTahmin() {
  const [icerikFikri, setIcerikFikri] = useState('');
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

  async function tahminEt() {
    if (!icerikFikri.trim() || yukleniyor) return;
    setYukleniyor(true);
    setSonuc('');

    try {
      const res = await fetch('/api/performans-tahmin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ icerikFikri, profil }),
      });
      const data = await res.json();
      setSonuc(data.cevap);
    } catch {
      setSonuc('[IPUCU] Bir hata oluştu, tekrar dene.');
    }
    setYukleniyor(false);
  }

  const ornekler = [
    'Müşterimin saç boyama öncesi ve sonrasını gösteren 30 saniyelik reels',
    'Restoranımızın mutfağında yemek yapılırken çekilen behind the scenes video',
    'Ürünümüzü kullanan müşterinin tepkisini gösteren video',
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-black/90 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <a href="/dashboard" className="text-zinc-500 hover:text-white transition text-sm">← Dashboard</a>
          <div className="text-lg font-bold">via<span className="text-violet-500">.ai</span></div>
        </div>
        <p className="text-xs text-zinc-500">Performans Tahmini</p>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Performans Tahmini 🎯</h1>
          <p className="text-zinc-400 text-sm">İçerik fikrini yaz, yayınlamadan önce viral olma ihtimalini öğren.</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-4">
          <label className="text-xs text-zinc-500 mb-2 block">İçerik Fikrin</label>
          <textarea
            value={icerikFikri}
            onChange={e => setIcerikFikri(e.target.value)}
            placeholder="Çekeceğin videoyu veya gönderiyi anlat. Ne göstereceksin, nasıl başlayacak, nasıl bitecek?"
            rows={4}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition resize-none mb-3"
          />
          <button
            onClick={tahminEt}
            disabled={yukleniyor || !icerikFikri.trim()}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-700 disabled:text-zinc-500 py-3 rounded-xl text-sm font-semibold transition"
          >
            {yukleniyor ? 'Analiz ediliyor...' : 'Viral İhtimalini Hesapla →'}
          </button>
        </div>

        {!sonuc && !yukleniyor && (
          <div className="mb-6">
            <p className="text-xs text-zinc-500 mb-2">Örnek fikirler:</p>
            <div className="space-y-2">
              {ornekler.map((ornek, i) => (
                <button
                  key={i}
                  onClick={() => setIcerikFikri(ornek)}
                  className="w-full text-left text-xs bg-zinc-900 border border-zinc-800 hover:border-violet-500 px-3 py-2 rounded-xl text-zinc-400 hover:text-white transition"
                >
                  {ornek}
                </button>
              ))}
            </div>
          </div>
        )}

        {yukleniyor && (
          <div className="flex items-center gap-3 text-zinc-400 text-sm px-2 mb-4">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}/>
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}/>
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}/>
            </div>
            İçerik analiz ediliyor...
          </div>
        )}

        {sonuc && <SonucKarti icerik={sonuc} />}
      </div>
    </main>
  );
}