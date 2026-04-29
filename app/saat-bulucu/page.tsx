'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const GUNLER = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

function SonucKarti({ icerik }: { icerik: string }) {
  const satirlar = icerik.split('\n').filter(s => s.trim());
  const [aktifGun, setAktifGun] = useState<string | null>(null);

  const gunVerileri: Record<string, { skor: string; yorum: string; satirlar: string[] }> = {};
  const genelSatirlar: { satir: string; i: number }[] = [];
  let mevcutGun: string | null = null;

  satirlar.forEach((satir, i) => {
    if (satir.startsWith('[GUN]')) {
      const parcalar = satir.replace('[GUN]', '').trim().split('|');
      mevcutGun = parcalar[0]?.trim();
      if (mevcutGun) {
        gunVerileri[mevcutGun] = {
          skor: parcalar[1]?.trim() || '0',
          yorum: parcalar[2]?.trim() || '',
          satirlar: []
        };
      }
    } else if (mevcutGun && gunVerileri[mevcutGun]) {
      gunVerileri[mevcutGun].satirlar.push(satir);
    } else if (!satir.startsWith('[GUN]')) {
      genelSatirlar.push({ satir, i });
    }
  });

  function satirRender(satir: string, i: number) {
    if (satir.startsWith('[BASLIK]')) {
      const metin = satir.replace('[BASLIK]', '').trim();
      return (
        <div key={i} className="bg-violet-600/20 border border-violet-500/40 rounded-xl px-4 py-3 mt-3">
          <p className="text-violet-300 font-semibold">{metin}</p>
        </div>
      );
    }
    if (satir.startsWith('[OZET]')) {
      const metin = satir.replace('[OZET]', '').trim();
      const parcalar = metin.split('|');
      return (
        <div key={i} className="bg-gradient-to-r from-violet-600/20 to-blue-600/20 border border-violet-500/40 rounded-xl p-4 mt-2">
          <p className="text-white font-bold mb-2">🎯 {parcalar[0]?.trim()}</p>
          {parcalar[1] && (
            <div className="bg-amber-500/20 border border-amber-500/30 rounded-lg px-3 py-2 mb-2">
              <p className="text-amber-300 text-sm">⚡ {parcalar[1].trim()}</p>
            </div>
          )}
          {parcalar[2] && <p className="text-zinc-400 text-xs">{parcalar[2].trim()}</p>}
        </div>
      );
    }
    if (satir.startsWith('[SAAT]')) {
      const metin = satir.replace('[SAAT]', '').trim();
      const parcalar = metin.split('|');
      const skor = parseInt(parcalar[1]?.trim() || '0');
      const skorRenk = skor >= 8 ? 'text-green-400' : skor >= 6 ? 'text-amber-400' : 'text-red-400';
      const cubukRenk = skor >= 8 ? 'bg-green-500' : skor >= 6 ? 'bg-amber-500' : 'bg-red-500';
      return (
        <div key={i} className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="bg-zinc-900 rounded-lg px-3 py-1">
                <p className="text-white font-bold text-lg">{parcalar[0]?.trim()}</p>
              </div>
              {parcalar[3] && (
                <span className="text-xs bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full">
                  {parcalar[3].trim()}
                </span>
              )}
            </div>
            <div className="text-right">
              <p className={`${skorRenk} font-bold text-xl`}>{parcalar[1]?.trim()}/10</p>
            </div>
          </div>
          <div className="w-full bg-zinc-700 rounded-full h-1.5 mb-2">
            <div className={`${cubukRenk} h-1.5 rounded-full`} style={{ width: `${skor * 10}%` }} />
          </div>
          {parcalar[2] && <p className="text-zinc-400 text-xs mb-1">{parcalar[2].trim()}</p>}
          {parcalar[4] && (
            <div className="bg-zinc-900 rounded-lg px-2 py-1 mt-1">
              <p className="text-zinc-300 text-xs italic">{parcalar[4].trim()}</p>
            </div>
          )}
        </div>
      );
    }
    if (satir.startsWith('[KACIN]')) {
      const metin = satir.replace('[KACIN]', '').trim();
      const parcalar = metin.split('|');
      return (
        <div key={i} className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mt-1">
          <p className="text-red-400 font-semibold text-sm mb-1">🚫 Kaçın: {parcalar[0]?.trim()}</p>
          {parcalar[1] && <p className="text-zinc-400 text-xs mb-1">{parcalar[1].trim()}</p>}
          {parcalar[2] && <p className="text-green-400 text-xs">✓ Alternatif: {parcalar[2].trim()}</p>}
        </div>
      );
    }
    if (satir.startsWith('[ICERIK_SAATI]')) {
      const metin = satir.replace('[ICERIK_SAATI]', '').trim();
      const parcalar = metin.split('|');
      return (
        <div key={i} className="flex items-center justify-between bg-blue-500/10 border border-blue-500/30 rounded-xl px-3 py-2 mt-1">
          <div>
            <p className="text-blue-400 font-semibold text-sm">{parcalar[0]?.trim()}</p>
            {parcalar[3] && <p className="text-zinc-500 text-xs">{parcalar[3].trim()}</p>}
          </div>
          <div className="text-right">
            <p className="text-white font-bold text-sm">{parcalar[2]?.trim()}</p>
            <p className="text-zinc-500 text-xs">{parcalar[1]?.trim()}</p>
          </div>
        </div>
      );
    }
    if (satir.startsWith('[OZEL_DURUM]')) {
      const metin = satir.replace('[OZEL_DURUM]', '').trim();
      const parcalar = metin.split('|');
      return (
        <div key={i} className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mt-1">
          <p className="text-amber-400 font-semibold text-sm mb-1">📅 {parcalar[0]?.trim()}</p>
          {parcalar[1] && <p className="text-zinc-300 text-xs mb-1">{parcalar[1].trim()}</p>}
          {parcalar[2] && <p className="text-zinc-500 text-xs italic">{parcalar[2].trim()}</p>}
        </div>
      );
    }
    if (satir.startsWith('[ALGORITMA]')) {
      const metin = satir.replace('[ALGORITMA]', '').trim();
      const parcalar = metin.split('|');
      return (
        <div key={i} className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 mt-1">
          <p className="text-green-400 font-semibold text-sm mb-1">⚙️ {parcalar[0]?.trim()}</p>
          {parcalar[1] && <p className="text-zinc-300 text-xs">{parcalar[1].trim()}</p>}
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

  const gunSkorlari = Object.entries(gunVerileri).map(([gun, veri]) => ({
    gun,
    skor: parseInt(veri.skor) || 0,
    yorum: veri.yorum
  }));

  return (
    <div className="space-y-3">
      {genelSatirlar.map(({ satir, i }) => satirRender(satir, i))}

      {gunSkorlari.length > 0 && (
        <div className="mt-6">
          {/* Haftalık Isı Haritası */}
          <p className="text-xs text-zinc-500 mb-3">📅 Haftalık Performans Haritası</p>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {GUNLER.map((gun) => {
              const veri = gunVerileri[gun] || gunVerileri[Object.keys(gunVerileri).find(k => k.toLowerCase().includes(gun.toLowerCase().slice(0, 3))) || ''];
              const skor = veri ? parseInt(veri.skor) || 0 : 0;
              const yogunluk = skor >= 9 ? 'bg-green-500' : skor >= 7 ? 'bg-green-400/70' :
                skor >= 5 ? 'bg-amber-500/70' : skor >= 3 ? 'bg-red-400/50' : 'bg-zinc-700';
              const aktif = aktifGun === gun;
              return (
                <button
                  key={gun}
                  onClick={() => setAktifGun(aktif ? null : gun)}
                  className={`rounded-xl p-2 text-center transition border-2 ${yogunluk} ${aktif ? 'border-white scale-105' : 'border-transparent'}`}
                >
                  <p className="text-white text-xs font-bold">{gun.slice(0, 3)}</p>
                  <p className="text-white/80 text-xs mt-0.5">{skor}/10</p>
                </button>
              );
            })}
          </div>

          {/* Seçili Gün Detayı */}
          {aktifGun && gunVerileri[aktifGun] && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white font-bold">{aktifGun}</p>
                <div className="flex items-center gap-2">
                  <p className="text-zinc-400 text-xs">{gunVerileri[aktifGun].yorum}</p>
                  <span className="text-violet-400 font-bold">{gunVerileri[aktifGun].skor}/10</span>
                </div>
              </div>
              <div className="space-y-2">
                {gunVerileri[aktifGun].satirlar.map((satir, si) => satirRender(satir, si))}
              </div>
            </div>
          )}

          {!aktifGun && (
            <p className="text-xs text-zinc-600 text-center mb-4">Detayları görmek için bir güne tıkla</p>
          )}
        </div>
      )}

      {/* Genel Tavsiyeler */}
      <div className="mt-2 space-y-2">
        {satirlar.filter(s =>
          s.startsWith('[ICERIK_SAATI]') ||
          s.startsWith('[OZEL_DURUM]') ||
          s.startsWith('[ALGORITMA]') ||
          s.startsWith('[IPUCU]') ||
          s.startsWith('[KACIN]')
        ).map((satir, i) => satirRender(satir, i + 1000))}
      </div>
    </div>
  );
}

export default function SaatBulucu() {
  const [profil, setProfil] = useState<any>(null);
  const [platform, setPlatform] = useState('Instagram');
  const [icerikTuru, setIcerikTuru] = useState('Reels / Kısa Video');
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

  async function saatleriHesapla() {
    if (yukleniyor) return;
    setYukleniyor(true);
    setSonuc('');

    try {
      const res = await fetch('/api/saat-bulucu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profil, platform, icerikTuru }),
      });
      const data = await res.json();
      setSonuc(data.cevap);
    } catch {
      setSonuc('[IPUCU] Bir hata oluştu, tekrar dene.');
    }
    setYukleniyor(false);
  }

  const platformlar = ['Instagram', 'TikTok', 'YouTube Shorts', 'Facebook'];
  const icerikTurleri = [
    'Reels / Kısa Video',
    'Fotoğraf / Carousel',
    'Story',
    'Canlı Yayın',
    'Uzun Video',
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-black/90 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <a href="/dashboard" className="text-zinc-500 hover:text-white transition text-sm">← Dashboard</a>
          <div className="text-lg font-bold">via<span className="text-violet-500">.ai</span></div>
        </div>
        <p className="text-xs text-zinc-500">En İyi Saat Bulucu</p>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">En İyi Saat Bulucu ⏰</h1>
          <p className="text-zinc-400 text-sm">Sektörüne ve şehrine özel en iyi paylaşım saatlerini öğren. Genel değil, sadece senin işletmene özgü.</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-6">
          {profil && (
            <div className="bg-zinc-800 rounded-xl p-3 mb-4">
              <p className="text-xs text-zinc-500 mb-1">Analiz yapılacak işletme:</p>
              <p className="text-white font-semibold">{profil.isletme_adi}</p>
              <p className="text-zinc-400 text-xs">{profil.sektor} · {profil.sehir}</p>
            </div>
          )}

          <div className="mb-4">
            <label className="text-xs text-zinc-500 mb-2 block">Platform</label>
            <div className="grid grid-cols-2 gap-2">
              {platformlar.map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`py-2 rounded-xl text-sm transition ${
                    platform === p
                      ? 'bg-violet-600 text-white font-semibold'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs text-zinc-500 mb-2 block">İçerik Türü</label>
            <div className="flex flex-wrap gap-2">
              {icerikTurleri.map((t) => (
                <button
                  key={t}
                  onClick={() => setIcerikTuru(t)}
                  className={`text-sm px-3 py-1.5 rounded-xl transition ${
                    icerikTuru === t
                      ? 'bg-violet-600 text-white font-semibold'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={saatleriHesapla}
            disabled={yukleniyor}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-700 disabled:text-zinc-500 py-3 rounded-xl text-sm font-semibold transition"
          >
            {yukleniyor ? 'Hesaplanıyor...' : '⏰ En İyi Saatleri Hesapla'}
          </button>
        </div>

        {yukleniyor && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center mb-4">
            <div className="flex justify-center gap-1 mb-3">
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}/>
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}/>
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}/>
            </div>
            <p className="text-zinc-400 text-sm">{profil?.sehir} ve {profil?.sektor} sektörü analiz ediliyor...</p>
            <p className="text-zinc-600 text-xs mt-1">Platform algoritması ve hedef kitle davranışları hesaplanıyor</p>
          </div>
        )}

        {sonuc && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-zinc-400">Analizin hazır 📊</p>
              <button
                onClick={() => setSonuc('')}
                className="text-xs text-zinc-500 hover:text-white transition"
              >
                ← Yeniden Hesapla
              </button>
            </div>
            <SonucKarti icerik={sonuc} />
          </div>
        )}
      </div>
    </main>
  );
}