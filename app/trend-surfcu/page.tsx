'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

function SonucKarti({ icerik }: { icerik: string }) {
  const satirlar = icerik.split('\n').filter(s => s.trim());
  const [kopyalanan, setKopyalanan] = useState<string | null>(null);

  function kopyala(metin: string, key: string) {
    navigator.clipboard.writeText(metin);
    setKopyalanan(key);
    setTimeout(() => setKopyalanan(null), 2000);
  }

  // Trendleri grupla
  const trendGruplari: { baslik: string; index: number; satirlar: string[] }[] = [];
  let mevcutTrend: { baslik: string; index: number; satirlar: string[] } | null = null;
  const genelSatirlar: { satir: string; i: number }[] = [];

  satirlar.forEach((satir, i) => {
    if (satir.startsWith('[TREND]')) {
      if (mevcutTrend) trendGruplari.push(mevcutTrend);
      mevcutTrend = { baslik: satir, index: trendGruplari.length, satirlar: [] };
    } else if (mevcutTrend) {
      mevcutTrend.satirlar.push(satir);
    } else {
      genelSatirlar.push({ satir, i });
    }
  });
  if (mevcutTrend) trendGruplari.push(mevcutTrend);

  function satirRender(satir: string, i: number) {
    if (satir.startsWith('[BASLIK]')) {
      const metin = satir.replace('[BASLIK]', '').trim();
      return (
        <div key={i} className="bg-violet-600/20 border border-violet-500/40 rounded-xl px-4 py-3 mt-3">
          <p className="text-violet-300 font-semibold">{metin}</p>
        </div>
      );
    }
    if (satir.startsWith('[NEDEN]')) {
      const metin = satir.replace('[NEDEN]', '').trim();
      const parcalar = metin.split('|');
      return (
        <div key={i} className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1">
          <p className="text-white font-semibold text-xs mb-2">🧠 Neden Viral?</p>
          {parcalar[0] && <p className="text-zinc-300 text-xs mb-1">{parcalar[0].trim()}</p>}
          {parcalar[1] && (
            <div className="bg-violet-500/10 rounded-lg px-2 py-1 mt-1">
              <p className="text-violet-300 text-xs">Psikoloji: {parcalar[1].trim()}</p>
            </div>
          )}
          {parcalar[2] && (
            <div className="bg-green-500/10 rounded-lg px-2 py-1 mt-1">
              <p className="text-green-300 text-xs">📈 {parcalar[2].trim()}</p>
            </div>
          )}
        </div>
      );
    }
    if (satir.startsWith('[UYARLAMA]')) {
      const metin = satir.replace('[UYARLAMA]', '').trim();
      const parcalar = metin.split('|');
      const zorluk = parcalar[1]?.trim() || '';
      const zorlukRenk = zorluk.toLowerCase().includes('kolay') ? 'text-green-400 bg-green-500/20' :
        zorluk.toLowerCase().includes('orta') ? 'text-amber-400 bg-amber-500/20' : 'text-red-400 bg-red-500/20';
      return (
        <div key={i} className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 mt-1">
          <p className="text-blue-400 font-semibold text-sm mb-2">🎯 İşletmene Uyarlama</p>
          {parcalar[0] && <p className="text-zinc-300 text-sm mb-2">{parcalar[0].trim()}</p>}
          <div className="flex gap-2">
            {parcalar[1] && (
              <span className={`text-xs px-2 py-1 rounded-lg ${zorlukRenk}`}>
                {parcalar[1].trim()}
              </span>
            )}
            {parcalar[2] && (
              <span className="text-xs px-2 py-1 rounded-lg bg-zinc-700 text-zinc-300">
                ⏱ {parcalar[2].trim()}
              </span>
            )}
          </div>
        </div>
      );
    }
    if (satir.startsWith('[ILK3]')) {
      const metin = satir.replace('[ILK3]', '').trim();
      const parcalar = metin.split('|');
      return (
        <div key={i} className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mt-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">İLK 3 SANİYE</div>
          </div>
          <p className="text-amber-300 text-sm font-medium mb-1">{parcalar[0]?.trim()}</p>
          {parcalar[1] && <p className="text-zinc-400 text-xs mb-1">📸 {parcalar[1].trim()}</p>}
          {parcalar[2] && <p className="text-zinc-400 text-xs">🎵 {parcalar[2].trim()}</p>}
        </div>
      );
    }
    if (satir.startsWith('[SENARYO]')) {
      const metin = satir.replace('[SENARYO]', '').trim();
      const parcalar = metin.split('|');
      return (
        <div key={i} className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1 ml-3">
          <p className="text-white font-semibold text-xs mb-1">🎥 {parcalar[0]?.trim()}</p>
          {parcalar[1] && <p className="text-zinc-300 text-xs mb-1">{parcalar[1].trim()}</p>}
          {parcalar[2] && <p className="text-zinc-500 text-xs italic">Kamera: {parcalar[2].trim()}</p>}
        </div>
      );
    }
    if (satir.startsWith('[CAPTION]')) {
      const metin = satir.replace('[CAPTION]', '').trim();
      const parcalar = metin.split('|');
      const captionMetni = parcalar[0]?.trim() || '';
      return (
        <div key={i} className="bg-zinc-800 border border-violet-500/30 rounded-xl p-3 mt-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-violet-400 text-xs font-semibold">📝 Hazır Caption</p>
            <button
              onClick={() => kopyala(captionMetni, `caption-${i}`)}
              className="text-xs bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 px-2 py-1 rounded-lg transition"
            >
              {kopyalanan === `caption-${i}` ? '✓ Kopyalandı' : 'Kopyala'}
            </button>
          </div>
          <p className="text-zinc-300 text-sm">{captionMetni}</p>
          {parcalar[1] && <p className="text-zinc-500 text-xs mt-1">{parcalar[1].trim()}</p>}
        </div>
      );
    }
    if (satir.startsWith('[HASHTAG]')) {
      const metin = satir.replace('[HASHTAG]', '').trim();
      const parcalar = metin.split('|');
      const tumHashtagler = parcalar.join(' ').trim();
      return (
        <div key={i} className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-violet-400 text-xs font-semibold"># Hashtagler</p>
            <button
              onClick={() => kopyala(tumHashtagler, `hashtag-${i}`)}
              className="text-xs bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 px-2 py-1 rounded-lg transition"
            >
              {kopyalanan === `hashtag-${i}` ? '✓ Kopyalandı' : 'Tümünü Kopyala'}
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            {parcalar.map((p, pi) =>
              p.trim().split(' ').map((tag, ti) => tag && (
                <span key={`${pi}-${ti}`} className="text-xs bg-violet-500/10 text-violet-300 px-2 py-0.5 rounded-full">
                  {tag.trim()}
                </span>
              ))
            )}
          </div>
        </div>
      );
    }
    if (satir.startsWith('[SURE]')) {
      const metin = satir.replace('[SURE]', '').trim();
      const parcalar = metin.split('|');
      const aciliyet = parcalar[1]?.trim() || '';
      const aciliyetRenk = aciliyet.toLowerCase().includes('çok yüksek') ? 'bg-red-500' :
        aciliyet.toLowerCase().includes('yüksek') ? 'bg-amber-500' : 'bg-green-500';
      return (
        <div key={i} className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mt-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-400 font-semibold text-sm">⏰ {parcalar[0]?.trim()}</p>
              {parcalar[2] && <p className="text-zinc-400 text-xs mt-1">{parcalar[2].trim()}</p>}
            </div>
            {parcalar[1] && (
              <span className={`${aciliyetRenk} text-white text-xs font-bold px-2 py-1 rounded-lg`}>
                {parcalar[1].trim()}
              </span>
            )}
          </div>
        </div>
      );
    }
    if (satir.startsWith('[IPUCU]')) {
      const metin = satir.replace('[IPUCU]', '').trim();
      return (
        <div key={i} className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 mt-1">
          <p className="text-zinc-300 text-xs">📌 {metin}</p>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="space-y-2">
      {genelSatirlar.map(({ satir, i }) => satirRender(satir, i))}

      {trendGruplari.map((trend, ti) => {
        const parcalar = trend.baslik.replace('[TREND]', '').trim().split('|');
        const omur = parseInt(parcalar[3]?.trim() || '7');
        const omurRenk = omur <= 2 ? 'text-red-400' : omur <= 5 ? 'text-amber-400' : 'text-green-400';
        return (
          <div key={ti} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden mt-4">
            <div className="bg-gradient-to-r from-violet-600/10 to-pink-600/10 border-b border-zinc-800 px-4 py-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-violet-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      Trend #{ti + 1}
                    </span>
                    {parcalar[1] && (
                      <span className="bg-zinc-700 text-zinc-300 text-xs px-2 py-0.5 rounded-full">
                        {parcalar[1].trim()}
                      </span>
                    )}
                  </div>
                  <p className="text-white font-bold">{parcalar[0]?.trim()}</p>
                  {parcalar[2] && (
                    <p className="text-zinc-400 text-xs mt-0.5">📈 {parcalar[2].trim()}</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <p className={`${omurRenk} font-bold text-lg`}>{omur}</p>
                  <p className="text-zinc-500 text-xs">gün kaldı</p>
                </div>
              </div>
            </div>
            <div className="px-4 pb-4 space-y-2 pt-2">
              {trend.satirlar.map((satir, si) => satirRender(satir, si))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function TrendSurfcu() {
  const [profil, setProfil] = useState<any>(null);
  const [platform, setPlatform] = useState('Instagram & TikTok');
  const [sonuc, setSonuc] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);
  const [sonGuncelleme, setSonGuncelleme] = useState<string | null>(null);

  useEffect(() => {
    async function profilGetir() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/giris'; return; }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfil(data);
    }
    profilGetir();
  }, []);

  async function trendleriGetir() {
    if (yukleniyor) return;
    setYukleniyor(true);
    setSonuc('');

    try {
      const res = await fetch('/api/trend-surfcu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profil, platform }),
      });
      const data = await res.json();
      setSonuc(data.cevap);
      setSonGuncelleme(new Date().toLocaleTimeString('tr-TR'));
    } catch {
      setSonuc('[IPUCU] Bir hata oluştu, tekrar dene.');
    }
    setYukleniyor(false);
  }

  const platformlar = [
    'Instagram & TikTok',
    'Sadece Instagram',
    'Sadece TikTok',
    'YouTube Shorts',
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-black/90 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <a href="/dashboard" className="text-zinc-500 hover:text-white transition text-sm">← Dashboard</a>
          <div className="text-lg font-bold">via<span className="text-violet-500">.ai</span></div>
        </div>
        <div className="flex items-center gap-2">
          {sonGuncelleme && (
            <span className="text-xs text-zinc-500">Son güncelleme: {sonGuncelleme}</span>
          )}
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold">Trend Sürfçüsü 🏄</h1>
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">CANLI</span>
          </div>
          <p className="text-zinc-400 text-sm">Bugün patlayan trendleri yakala, 24 saat içinde uygula, rakiplerden önce ol.</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-6">
          <label className="text-xs text-zinc-500 mb-2 block">Platform</label>
          <div className="flex flex-wrap gap-2 mb-4">
            {platformlar.map((p) => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={`text-sm px-4 py-2 rounded-xl transition ${
                  platform === p
                    ? 'bg-violet-600 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {profil && (
            <div className="bg-zinc-800 rounded-xl p-3 mb-4">
              <p className="text-xs text-zinc-500 mb-1">Sektörüne özel trendler aranacak:</p>
              <p className="text-white text-sm font-semibold">{profil.sektor} · {profil.sehir}</p>
            </div>
          )}

          <button
            onClick={trendleriGetir}
            disabled={yukleniyor}
            className="w-full bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 disabled:from-zinc-700 disabled:to-zinc-700 disabled:text-zinc-500 py-3 rounded-xl text-sm font-semibold transition"
          >
            {yukleniyor ? 'Trendler taranıyor...' : '🔥 Bugünün Trendlerini Getir'}
          </button>
        </div>

        {yukleniyor && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center mb-4">
            <div className="flex justify-center gap-1 mb-3">
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}/>
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}/>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}/>
            </div>
            <p className="text-zinc-400 text-sm">Instagram ve TikTok taranıyor...</p>
            <p className="text-zinc-600 text-xs mt-1">Bugün patlayan trendler ve sektöre uyarlama analiz ediliyor</p>
          </div>
        )}

        {sonuc && <SonucKarti icerik={sonuc} />}
      </div>
    </main>
  );
}