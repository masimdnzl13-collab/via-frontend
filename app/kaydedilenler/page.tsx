'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export const dynamic = 'force-dynamic';

interface Kayit {
  id: string;
  baslik: string;
  mesajlar: { rol: string; icerik: string }[];
  olusturma_tarihi: string;
}

export default function Kaydedilenler() {
  const [kayitlar, setKayitlar] = useState<Kayit[]>([]);
  const [secili, setSecili] = useState<Kayit | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    async function getir() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/giris'; return; }
      const { data } = await supabase
        .from('kaydedilenler')
        .select('*')
        .eq('user_id', user.id)
        .order('olusturma_tarihi', { ascending: false });
      setKayitlar(data || []);
      setYukleniyor(false);
    }
    getir();
  }, []);

  async function sil(id: string) {
    await supabase.from('kaydedilenler').delete().eq('id', id);
    setKayitlar(prev => prev.filter(k => k.id !== id));
    if (secili?.id === id) setSecili(null);
  }

  function tarihFormat(tarih: string) {
    return new Date(tarih).toLocaleDateString('tr-TR', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 sticky top-0 bg-black/90 backdrop-blur z-10">
        <div className="flex items-center gap-4">
          <a href="/dashboard" className="text-zinc-500 hover:text-white transition text-sm">← Dashboard</a>
          <div className="text-lg font-bold">via<span className="text-violet-500">.ai</span></div>
        </div>
        <p className="text-xs text-zinc-500">🔖 Kaydedilenler</p>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {yukleniyor ? (
          <div className="text-zinc-500 text-center py-20">Yükleniyor...</div>
        ) : kayitlar.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔖</p>
            <p className="text-zinc-400 text-sm mb-2">Henüz kaydedilen sohbet yok.</p>
            <a href="/icerik" className="text-violet-400 text-sm hover:text-violet-300">
              AI ile konuş ve kaydet →
            </a>
          </div>
        ) : !secili ? (
          <div>
            <h1 className="text-lg font-bold mb-6">Kaydedilen Sohbetler</h1>
            <div className="space-y-3">
              {kayitlar.map(k => (
                <div key={k.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-violet-500 transition cursor-pointer group"
                  onClick={() => setSecili(k)}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{k.baslik}</p>
                      <p className="text-zinc-500 text-xs mt-1">
                        {tarihFormat(k.olusturma_tarihi)} · {k.mesajlar.length} mesaj
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-violet-400 text-xs opacity-0 group-hover:opacity-100 transition">
                        Görüntüle →
                      </span>
                      <button
                        onClick={e => { e.stopPropagation(); sil(k.id); }}
                        className="text-zinc-600 hover:text-red-400 transition text-lg px-1">
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <button onClick={() => setSecili(null)}
              className="text-zinc-500 hover:text-white text-sm mb-6 transition flex items-center gap-2">
              ← Geri
            </button>
            <h1 className="text-lg font-bold mb-2">{secili.baslik}</h1>
            <p className="text-zinc-500 text-xs mb-6">{tarihFormat(secili.olusturma_tarihi)}</p>
            <div className="space-y-4">
              {secili.mesajlar.map((m, i) => (
                <div key={i} className={`flex ${m.rol === 'kullanici' ? 'justify-end' : 'justify-start'}`}>
                  {m.rol === 'ai' && (
                    <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 mt-1">
                      AI
                    </div>
                  )}
                  <div className={`max-w-xl text-sm rounded-2xl ${
                    m.rol === 'kullanici'
                      ? 'bg-violet-600 text-white px-4 py-3 rounded-br-sm'
                      : 'text-zinc-300 bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-bl-sm'
                  }`}>
                    {m.icerik}
                  </div>
                  {m.rol === 'kullanici' && (
                    <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center text-xs font-bold ml-3 flex-shrink-0 mt-1">
                      S
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-8 flex gap-3">
              <a href="/icerik"
                className="flex-1 text-center bg-violet-600 hover:bg-violet-700 py-3 rounded-xl text-sm font-semibold transition">
                Yeni sohbet başlat →
              </a>
              <button onClick={() => sil(secili.id)}
                className="px-4 py-3 border border-red-500/30 hover:bg-red-500/10 rounded-xl text-red-400 text-sm transition">
                Sil
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}