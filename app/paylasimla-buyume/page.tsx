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

  // Videoları grupla
  const videolar: { baslik: string; index: number; ton: string; satirlar: string[] }[] = [];
  let mevcutVideo: { baslik: string; index: number; ton: string; satirlar: string[] } | null = null;
  const genelSatirlar: { satir: string; i: number }[] = [];

  satirlar.forEach((satir, i) => {
    if (satir.startsWith('[VIDEO]')) {
      if (mevcutVideo) videolar.push(mevcutVideo);
      const parcalar = satir.replace('[VIDEO]', '').trim().split('|');
      mevcutVideo = {
        baslik: parcalar[0]?.trim() || '',
        ton: parcalar[1]?.trim() || '',
        index: videolar.length,
        satirlar: []
      };
    } else if (mevcutVideo) {
      mevcutVideo.satirlar.push(satir);
    } else {
      genelSatirlar.push({ satir, i });
    }
  });
  if (mevcutVideo) videolar.push(mevcutVideo);

  function tonEmoji(ton: string) {
    if (ton.toLowerCase().includes('komik')) return { emoji: '😂', renk: 'bg-yellow-500', text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' };
    if (ton.toLowerCase().includes('şaşırt')) return { emoji: '😲', renk: 'bg-blue-500', text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' };
    if (ton.toLowerCase().includes('duygusal')) return { emoji: '🥺', renk: 'bg-pink-500', text: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/30' };
    if (ton.toLowerCase().includes('kışkırt')) return { emoji: '🔥', renk: 'bg-red-500', text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' };
    return { emoji: '🎬', renk: 'bg-violet-500', text: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/30' };
  }

  function satirRender(satir: string, i: number) {
    if (satir.startsWith('[BASLIK]')) {
      const metin = satir.replace('[BASLIK]', '').trim();
      return (
        <div key={i} className="bg-violet-600/20 border border-violet-500/40 rounded-xl px-4 py-3 mt-3">
          <p className="text-violet-300 font-semibold">{metin}</p>
        </div>
      );
    }
    if (satir.startsWith('[PSIKOLOJI]')) {
      const metin = satir.replace('[PSIKOLOJI]', '').trim();
      const parcalar = metin.split('|');
      return (
        <div key={i} className="bg-gradient-to-r from-violet-600/20 to-pink-600/20 border border-violet-500/40 rounded-xl p-4 mt-2">
          <p className="text-white font-bold mb-2">🧠 {parcalar[0]?.trim()}</p>
          {parcalar[1] && <p className="text-zinc-300 text-xs mb-2">{parcalar[1].trim()}</p>}
          {parcalar[2] && (
            <div className="bg-pink-500/20 rounded-lg px-3 py-1">
              <p className="text-pink-300 text-xs">🎯 Hedef duygu: {parcalar[2].trim()}</p>
            </div>
          )}
        </div>
      );
    }
    if (satir.startsWith('[ACILIS]')) {
      const metin = satir.replace('[ACILIS]', '').trim();
      const parcalar = metin.split('|');
      return (
        <div key={i} className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mt-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">İLK 3 SANİYE</div>
          </div>
          <p className="text-amber-300 font-medium text-sm mb-1">{parcalar[0]?.trim()}</p>
          {parcalar[1] && <p className="text-zinc-400 text-xs mb-1">📸 {parcalar[1].trim()}</p>}
          {parcalar[2] && <p className="text-zinc-400 text-xs">🔊 {parcalar[2].trim()}</p>}
        </div>
      );
    }
    if (satir.startsWith('[SAHNE]')) {
      const metin = satir.replace('[SAHNE]', '').trim();
      const parcalar = metin.split('|');
      return (
        <div key={i} className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1 ml-2">
          <p className="text-white font-semibold text-xs mb-1">🎥 {parcalar[0]?.trim()}</p>
          {parcalar[1] && <p className="text-zinc-300 text-xs mb-1">{parcalar[1].trim()}</p>}
          {parcalar[2] && <p className="text-zinc-500 text-xs italic mb-1">Kamera: {parcalar[2].trim()}</p>}
          {parcalar[3] && (
            <div className="bg-green-500/10 rounded-lg px-2 py-1 mt-1">
              <p className="text-green-400 text-xs">↗ {parcalar[3].trim()}</p>
            </div>
          )}
        </div>
      );
    }
    if (satir.startsWith('[TWIST]')) {
      const metin = satir.replace('[TWIST]', '').trim();
      const parcalar = metin.split('|');
      return (
        <div key={i} className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mt-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">TWIST</div>
          </div>
          <p className="text-red-300 font-medium text-sm mb-1">{parcalar[0]?.trim()}</p>
          {parcalar[1] && <p className="text-zinc-300 text-xs mb-1">{parcalar[1].trim()}</p>}
          {parcalar[2] && (
            <div className="bg-red-500/10 rounded-lg px-2 py-1 mt-1">
              <p className="text-zinc-300 text-xs italic">İzleyici tepkisi: {parcalar[2].trim()}</p>
            </div>
          )}
        </div>
      );
    }
    if (satir.startsWith('[PAYLASIM_KANCASI]')) {
      const metin = satir.replace('[PAYLASIM_KANCASI]', '').trim();
      const parcalar = metin.split('|');
      return (
        <div key={i} className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 mt-1">
          <p className="text-green-400 font-bold text-sm mb-2">📤 Neden Paylaşır?</p>
          {parcalar[0] && <p className="text-zinc-300 text-xs mb-1">Hissedilen: {parcalar[0].trim()}</p>}
          {parcalar[1] && <p className="text-zinc-300 text-xs mb-1">Neden: {parcalar[1].trim()}</p>}
          {parcalar[2] && (
            <div className="bg-green-500/10 rounded-lg px-2 py-1 mt-1">
              <p className="text-green-300 text-xs">Kime gönderir: {parcalar[2].trim()}</p>
            </div>
          )}
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
          {parcalar[1] && <p className="text-zinc-500 text-xs mt-1 italic">{parcalar[1].trim()}</p>}
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

      {videolar.length > 0 && (
        <div className="mt-4 space-y-4">
          <p className="text-xs text-zinc-500">{videolar.length} viral video fikri hazır 🔥</p>
          {videolar.map((video, vi) => {
            const stil = tonEmoji(video.ton);
            return (
              <div key={vi} className={`${stil.bg} border ${stil.border} rounded-2xl overflow-hidden`}>
                <div className="px-4 py-3 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`${stil.renk} text-white text-sm w-8 h-8 rounded-xl flex items-center justify-center font-bold`}>
                        {stil.emoji}
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">{video.baslik}</p>
                        <span className={`text-xs ${stil.text} font-semibold`}>{video.ton}</span>
                      </div>
                    </div>
                    <div className="bg-black/20 rounded-lg px-2 py-1">
                      <p className="text-white text-xs font-bold">#{vi + 1}</p>
                    </div>
                  </div>
                </div>
                <div className="px-4 pb-4 pt-2 space-y-2">
                  {video.satirlar.map((satir, si) => satirRender(satir, si + vi * 100))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function PaylasimlaByume() {
  const [profil, setProfil] = useState<any>(null);
  const [icerikTonu, setIcerikTonu] = useState('Komik & Eğlenceli');
  const [sonuc, setSonuc] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);

  useEffect(() => {
    async function profilGetir() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/giris'; return; }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfil(data);
    }
    profilGetir();
  }, []);

  async function fikirleriUret() {
    if (yukleniyor) return;
    setYukleniyor(true);
    setSonuc('');

    try {
      const res = await fetch('/api/paylasimla-buyume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profil, icerikTonu }),
      });
      const data = await res.json();
      setSonuc(data.cevap);
    } catch {
      setSonuc('[IPUCU] Bir hata oluştu, tekrar dene.');
    }
    setYukleniyor(false);
  }

  const tonlar = [
    { ad: 'Komik & Eğlenceli', emoji: '😂', aciklama: 'Güldüren, "bunu görmeden geçme" dedirten' },
    { ad: 'Şaşırtıcı & Beklenmedik', emoji: '😲', aciklama: 'Twist\'li, "bu nasıl oldu?" dedirten' },
    { ad: 'Duygusal & Sıcak', emoji: '🥺', aciklama: 'İçi sıkışan, nostalji, aidiyet hissi' },
    { ad: 'Kışkırtıcı & Tartışmalı', emoji: '🔥', aciklama: '"Buna ne dersin?" dedirten, fikir ayrılığı yaratan' },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-black/90 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <a href="/dashboard" className="text-zinc-500 hover:text-white transition text-sm">← Dashboard</a>
          <div className="text-lg font-bold">via<span className="text-violet-500">.ai</span></div>
        </div>
        <p className="text-xs text-zinc-500">Paylaşımla Büyüme</p>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Paylaşımla Büyüme 📤</h1>
          <p className="text-zinc-400 text-sm">"Bunu arkadaşıma göndermem lazım" dedirten video fikirleri. İzleyici paylaşır, sen büyürsün.</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-6">
          {profil && (
            <div className="bg-zinc-800 rounded-xl p-3 mb-4">
              <p className="text-xs text-zinc-500 mb-1">İşletmen için üretilecek:</p>
              <p className="text-white font-semibold">{profil.isletme_adi}</p>
              <p className="text-zinc-400 text-xs">{profil.sektor} · {profil.sehir}</p>
            </div>
          )}

          <label className="text-xs text-zinc-500 mb-3 block">Video Tonu Seç</label>
          <div className="space-y-2 mb-4">
            {tonlar.map((ton) => (
              <button
                key={ton.ad}
                onClick={() => setIcerikTonu(ton.ad)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition text-left ${
                  icerikTonu === ton.ad
                    ? 'bg-violet-600/20 border-violet-500 text-white'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-white'
                }`}
              >
                <span className="text-2xl">{ton.emoji}</span>
                <div>
                  <p className="font-semibold text-sm">{ton.ad}</p>
                  <p className="text-xs opacity-70">{ton.aciklama}</p>
                </div>
                {icerikTonu === ton.ad && (
                  <span className="ml-auto text-violet-400">✓</span>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={fikirleriUret}
            disabled={yukleniyor}
            className="w-full bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 disabled:from-zinc-700 disabled:to-zinc-700 disabled:text-zinc-500 py-3 rounded-xl text-sm font-semibold transition"
          >
            {yukleniyor ? 'Fikirler üretiliyor...' : '🔥 Viral Video Fikirleri Üret'}
          </button>
        </div>

        {yukleniyor && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center mb-4">
            <div className="flex justify-center gap-1 mb-3">
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}/>
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}/>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}/>
            </div>
            <p className="text-zinc-400 text-sm">En çok paylaşılan viral formatlar analiz ediliyor...</p>
            <p className="text-zinc-600 text-xs mt-1">Sinirli aslan vs küçük kedi gibi beklenmedik zıtlıklar aranıyor 😄</p>
          </div>
        )}

        {sonuc && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-zinc-400">Fikirler hazır, çekmeye başla! 🎬</p>
              <button
                onClick={() => setSonuc('')}
                className="text-xs text-zinc-500 hover:text-white transition"
              >
                ← Yeni Fikirler
              </button>
            </div>
            <SonucKarti icerik={sonuc} />
          </div>
        )}
      </div>
    </main>
  );
}