'use client';
import { useEffect, useRef } from 'react';

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, []);

  return (
    <main className="bg-black text-white">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 bg-black/60 backdrop-blur-md border-b border-white/10">
        <div className="text-xl font-bold tracking-wider">
          VİA<span className="text-violet-500">.AI</span>
        </div>
        <div className="flex gap-3">
          <a href="/giris" className="text-zinc-300 hover:text-white px-4 py-2 rounded-lg transition text-sm">
            Giriş Yap
          </a>
          <a href="/kayit" className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-lg transition text-sm font-semibold">
            Kaydol
          </a>
        </div>
      </nav>

      {/* Hero — video arka plan */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        
        {/* Video arka plan */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        {/* Gradient overlay — aşağı doğru kararır */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black pointer-events-none" />

        {/* İçerik */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs px-4 py-1.5 rounded-full mb-8 tracking-widest">
            ✦ YAPAY ZEKA SOSYAL MEDYA MÜHENDİSİ
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-none tracking-tight">
            YOLUNUZU<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-violet-600">
              VİA İLE ÇİZİN.
            </span>
          </h1>
          <p className="text-zinc-300 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            İşletmenizin dijital sokağını biz inşa edelim.{' '}
            <span className="text-white font-semibold">7 günlük strateji</span> ve{' '}
            <span className="text-violet-400">viral içerik planları</span>{' '}
            sadece bir tık uzağınızda.
          </p>
          
            href="/kayit"
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 rounded-xl text-lg font-bold tracking-wide transition"
          >
            HEMEN BAŞLA →
          </a>
        </div>

        {/* Aşağı kaydırma göstergesi */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-zinc-500 text-xs tracking-widest">
          ↓ AŞAĞI KAYDIR
        </div>
      </section>

      {/* Özellikler bölümü */}
      <section className="px-8 py-24 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4">Ne yapıyor?</h2>
          <p className="text-zinc-400 max-w-lg mx-auto">Küçük işletmeler için tasarlandı. Büyük sonuçlar için.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8 hover:border-violet-500/50 transition">
            <div className="w-12 h-12 bg-violet-600/20 rounded-xl flex items-center justify-center text-2xl mb-6">📅</div>
            <h3 className="text-lg font-bold mb-3">Haftalık içerik planı</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">Sektörüne göre 7 günlük içerik planı, caption ve hashtag otomatik üretilir.</p>
          </div>
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8 hover:border-violet-500/50 transition">
            <div className="w-12 h-12 bg-violet-600/20 rounded-xl flex items-center justify-center text-2xl mb-6">🎬</div>
            <h3 className="text-lg font-bold mb-3">AI video üretici</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">Ham videoları yükle, AI en iyi sahneleri seçer, reels formatına dönüştürür.</p>
          </div>
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8 hover:border-violet-500/50 transition">
            <div className="w-12 h-12 bg-violet-600/20 rounded-xl flex items-center justify-center text-2xl mb-6">📊</div>
            <h3 className="text-lg font-bold mb-3">Performans analizi</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">Hangi içerik işe yaradı? AI yorumlar ve bir sonrakini daha iyi yapar.</p>
          </div>
        </div>
      </section>

      {/* Fiyatlandırma */}
      <section className="px-8 py-24 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4">Fiyatlandırma</h2>
          <p className="text-zinc-400">14 gün ücretsiz, kredi kartı gerekmez.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
            <h3 className="text-lg font-bold mb-2">Starter</h3>
            <div className="text-4xl font-black mb-6">$19<span className="text-sm text-zinc-400 font-normal">/ay</span></div>
            <ul className="text-zinc-400 text-sm space-y-3 mb-8">
              <li className="flex items-center gap-2"><span className="text-violet-400">✓</span> Haftalık içerik planı</li>
              <li className="flex items-center gap-2"><span className="text-violet-400">✓</span> Caption + hashtag üretimi</li>
              <li className="flex items-center gap-2"><span className="text-violet-400">✓</span> 10 video analizi/ay</li>
            </ul>
            <a href="/kayit" className="block w-full border border-zinc-700 hover:border-violet-500 py-3 rounded-xl transition text-center text-sm font-semibold">
              Başla
            </a>
          </div>
          <div className="bg-violet-600 rounded-2xl p-8 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-violet-600 text-xs font-black px-4 py-1.5 rounded-full tracking-wide">
              EN POPÜLER
            </div>
            <h3 className="text-lg font-bold mb-2">Pro</h3>
            <div className="text-4xl font-black mb-6">$39<span className="text-sm text-white/70 font-normal">/ay</span></div>
            <ul className="text-white/80 text-sm space-y-3 mb-8">
              <li className="flex items-center gap-2"><span className="text-white">✓</span> Sınırsız içerik planı</li>
              <li className="flex items-center gap-2"><span className="text-white">✓</span> AI video üretici</li>
              <li className="flex items-center gap-2"><span className="text-white">✓</span> Performans analizi</li>
              <li className="flex items-center gap-2"><span className="text-white">✓</span> Rakip analizi</li>
            </ul>
            <a href="/kayit" className="block w-full bg-white text-violet-600 font-black py-3 rounded-xl hover:bg-zinc-100 transition text-center text-sm">
              Başla
            </a>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
            <h3 className="text-lg font-bold mb-2">Premium</h3>
            <div className="text-4xl font-black mb-6">$79<span className="text-sm text-zinc-400 font-normal">/ay</span></div>
            <ul className="text-zinc-400 text-sm space-y-3 mb-8">
              <li className="flex items-center gap-2"><span className="text-violet-400">✓</span> Her şey dahil</li>
              <li className="flex items-center gap-2"><span className="text-violet-400">✓</span> DM otomasyonu</li>
              <li className="flex items-center gap-2"><span className="text-violet-400">✓</span> Reklam yönetimi</li>
              <li className="flex items-center gap-2"><span className="text-violet-400">✓</span> Öncelikli destek</li>
            </ul>
            <a href="/kayit" className="block w-full border border-zinc-700 hover:border-violet-500 py-3 rounded-xl transition text-center text-sm font-semibold">
              Başla
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-24 border-t border-zinc-800">
        <h2 className="text-4xl font-black mb-4">Başlamak için kredi kartı gerekmez.</h2>
        <p className="text-zinc-400 mb-10">İlk 14 gün tamamen ücretsiz.</p>
        <a href="/kayit" className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-10 py-4 rounded-xl text-lg font-bold tracking-wide transition">
          ÜCRETSİZ DENE →
        </a>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 border-t border-zinc-800 text-zinc-600 text-sm">
        © 2026 via.ai — Tüm hakları saklıdır.
      </footer>

    </main>
  );
}