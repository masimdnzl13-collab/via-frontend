export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      
      <nav className="flex items-center justify-between px-8 py-6 border-b border-zinc-800">
        <div className="text-2xl font-bold text-white">via<span className="text-violet-500">.ai</span></div>
        <div className="flex gap-4">
          <a href="/giris" className="text-zinc-400 hover:text-white transition">Giriş</a>
          <a href="/kayit" className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-lg transition">
            Ücretsiz Başla
          </a>
        </div>
      </nav>

      <section className="flex flex-col items-center justify-center text-center px-4 py-32">
        <div className="bg-violet-600/20 text-violet-400 text-sm px-4 py-1 rounded-full mb-6">
          Küçük işletmeler için AI sosyal medya çalışanı
        </div>
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          Çek, yükle.<br />
          <span className="text-violet-500">Gerisini AI halletsin.</span>
        </h1>
        <p className="text-zinc-400 text-xl max-w-xl mb-10">
          Berberinden kafeye, güzellik salonundan spor salonuna — 
          via.ai işletmene özel içerik üretir, analiz eder, büyütür.
        </p>
        <a href="/kayit" className="inline-block bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition">
          Hemen Başla — Ücretsiz
        </a>
      </section>

      <section className="px-8 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Ne yapıyor?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="text-3xl mb-4">📅</div>
            <h3 className="text-lg font-semibold mb-2">Haftalık içerik planı</h3>
            <p className="text-zinc-400 text-sm">Sektörüne göre 7 günlük içerik planı, caption ve hashtag otomatik üretilir.</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="text-3xl mb-4">🎬</div>
            <h3 className="text-lg font-semibold mb-2">AI video üretici</h3>
            <p className="text-zinc-400 text-sm">Ham videoları yükle, AI en iyi sahneleri seçer, reels formatına dönüştürür.</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-lg font-semibold mb-2">Performans analizi</h3>
            <p className="text-zinc-400 text-sm">Hangi içerik işe yaradı? AI yorumlar ve bir sonrakini daha iyi yapar.</p>
          </div>
        </div>
      </section>

      <section className="px-8 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Fiyatlandırma</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-2">Starter</h3>
            <div className="text-3xl font-bold mb-4">$19<span className="text-sm text-zinc-400">/ay</span></div>
            <ul className="text-zinc-400 text-sm space-y-2 mb-6">
              <li>✓ Haftalık içerik planı</li>
              <li>✓ Caption + hashtag üretimi</li>
              <li>✓ 10 video analizi/ay</li>
            </ul>
            <a href="/kayit" className="block w-full border border-zinc-700 hover:border-violet-500 py-2 rounded-lg transition text-center">
              Başla
            </a>
          </div>
          <div className="bg-violet-600 rounded-2xl p-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-violet-600 text-xs font-bold px-3 py-1 rounded-full">
              EN POPÜLER
            </div>
            <h3 className="text-lg font-semibold mb-2">Pro</h3>
            <div className="text-3xl font-bold mb-4">$39<span className="text-sm text-white/70">/ay</span></div>
            <ul className="text-white/80 text-sm space-y-2 mb-6">
              <li>✓ Sınırsız içerik planı</li>
              <li>✓ AI video üretici</li>
              <li>✓ Performans analizi</li>
              <li>✓ Rakip analizi</li>
            </ul>
            <a href="/kayit" className="block w-full bg-white text-violet-600 font-semibold py-2 rounded-lg hover:bg-zinc-100 transition text-center">
              Başla
            </a>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-2">Premium</h3>
            <div className="text-3xl font-bold mb-4">$79<span className="text-sm text-zinc-400">/ay</span></div>
            <ul className="text-zinc-400 text-sm space-y-2 mb-6">
              <li>✓ Her şey dahil</li>
              <li>✓ DM otomasyonu</li>
              <li>✓ Reklam yönetimi</li>
              <li>✓ Öncelikli destek</li>
            </ul>
            <a href="/kayit" className="block w-full border border-zinc-700 hover:border-violet-500 py-2 rounded-lg transition text-center">
              Başla
            </a>
          </div>
        </div>
      </section>

      <section className="text-center py-20 border-t border-zinc-800">
        <h2 className="text-3xl font-bold mb-4">Başlamak için kredi kartı gerekmez.</h2>
        <p className="text-zinc-400 mb-8">İlk 14 gün tamamen ücretsiz.</p>
        <a href="/kayit" className="inline-block bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition">
          Ücretsiz Dene
        </a>
      </section>

      <footer className="text-center py-8 border-t border-zinc-800 text-zinc-600 text-sm">
        © 2026 via.ai — Tüm hakları saklıdır.
      </footer>

    </main>
  );
}