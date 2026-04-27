'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function Dashboard() {
  const [profil, setProfil] = useState<any>(null);

  useEffect(() => {
    async function profilGetir() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/giris';
        return;
      }
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfil(data);
    }
    profilGetir();
  }, []);

  if (!profil) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-zinc-500">Yükleniyor...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      
      <nav className="flex items-center justify-between px-8 py-4 border-b border-zinc-800">
        <div className="text-xl font-bold">via<span className="text-violet-500">.ai</span></div>
        <div className="flex items-center gap-4">
          <span className="text-zinc-400 text-sm">Merhaba, {profil.isletme_adi} 👋</span>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = '/';
            }}
            className="text-zinc-500 hover:text-white text-sm transition"
          >
            Çıkış
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-10">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-500 text-sm mb-1">Sektör</p>
            <p className="text-2xl font-bold">{profil.sektor}</p>
            <p className="text-zinc-500 text-sm mt-1">{profil.sehir}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-500 text-sm mb-1">Hedefin</p>
            <p className="text-lg font-bold">{profil.hedef}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-500 text-sm mb-1">Bu hafta içerik</p>
            <p className="text-3xl font-bold">5</p>
            <p className="text-green-400 text-sm mt-1">↑ Planlandı</p>
          </div>
          <div className="bg-violet-600 rounded-2xl p-5">
            <p className="text-white/70 text-sm mb-1">AI önerisi</p>
            <p className="text-sm font-semibold">Bu hafta 2 dönüşüm videosu çek 🎬</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="md:col-span-2 space-y-6">

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">📋 Bugün ne yapmalısın?</h2>
              <div className="space-y-3">
                {[
                  { icon: '🎬', gorev: 'Before/after videosu çek', sure: '~10 dk', durum: 'bekliyor' },
                  { icon: '✍️', gorev: 'Caption hazır — paylaşıma hazır', sure: 'Hemen', durum: 'hazir' },
                  { icon: '📊', gorev: 'Dünkü videonun performansını gör', sure: '~2 dk', durum: 'bekliyor' },
                ].map((g, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-zinc-800 rounded-xl">
                    <span className="text-2xl">{g.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{g.gorev}</p>
                      <p className="text-xs text-zinc-500">{g.sure}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      g.durum === 'hazir'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-zinc-700 text-zinc-400'
                    }`}>
                      {g.durum === 'hazir' ? '✓ Hazır' : 'Bekliyor'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">📅 Haftalık içerik planı</h2>
              <div className="space-y-2">
                {[
                  { gun: 'Pazartesi', icerik: 'Before/after dönüşümü', durum: 'tamamlandi' },
                  { gun: 'Salı', icerik: 'Story anketi', durum: 'bekliyor' },
                  { gun: 'Çarşamba', icerik: 'Müşteri yorumu repost', durum: 'bekliyor' },
                  { gun: 'Perşembe', icerik: 'Kampanya postu', durum: 'bekliyor' },
                  { gun: 'Cuma', icerik: 'Trend geçiş videosu', durum: 'bekliyor' },
                  { gun: 'Cumartesi', icerik: 'Dükkan atmosferi videosu', durum: 'bekliyor' },
                  { gun: 'Pazar', icerik: 'Haftanın en iyi dönüşümü', durum: 'bekliyor' },
                ].map((g, i) => (
                  <div key={i} className={`flex items-center gap-4 p-3 rounded-xl ${
                    g.durum === 'tamamlandi' ? 'bg-green-500/10 border border-green-500/20' : 'bg-zinc-800'
                  }`}>
                    <span className="text-xs text-zinc-500 w-20">{g.gun}</span>
                    <span className="text-sm flex-1">{g.icerik}</span>
                    <span className={`text-xs ${g.durum === 'tamamlandi' ? 'text-green-400' : 'text-zinc-600'}`}>
                      {g.durum === 'tamamlandi' ? '✓' : '○'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-violet-600/10 border border-violet-500/30 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-2">✨ İçerik üret</h2>
              <p className="text-zinc-400 text-sm mb-4">AI sana özel içerik planı üretsin.</p>
              <a href="/icerik" className="block w-full bg-violet-600 hover:bg-violet-700 py-3 rounded-xl font-semibold transition text-sm text-center">
                İçerik Üret →
              </a>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">📊 Son performans</h2>
              <div className="space-y-3">
                {[
                  { icerik: 'Dönüşüm videosu', izlenme: '4.2K', artis: '+38%' },
                  { icerik: 'Müşteri reaksiyonu', izlenme: '2.8K', artis: '+12%' },
                  { icerik: 'Kampanya postu', izlenme: '890', artis: '-5%' },
                ].map((p, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">{p.icerik}</p>
                      <p className="text-xs text-zinc-500">{p.izlenme} izlenme</p>
                    </div>
                    <span className={`text-xs font-semibold ${
                      p.artis.startsWith('+') ? 'text-green-400' : 'text-red-400'
                    }`}>{p.artis}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-3">🤖 AI Koç</h2>
              <div className="space-y-2 text-sm text-zinc-400">
                <p>💡 Dönüşüm videoların çok iyi çalışıyor.</p>
                <p>⚠️ Kampanya postların zayıf — daha güçlü CTA kullan.</p>
                <p>🎯 Bu hafta 3 reels hedefle.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}