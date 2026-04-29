'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

function AlgoritmaSonuc({ icerik }: { icerik: string }) {
  const satirlar = icerik.split('\n').filter(s => s.trim());
  const [kopyalanan, setKopyalanan] = useState<string | null>(null);

  function kopyala(metin: string, key: string) {
    navigator.clipboard.writeText(metin);
    setKopyalanan(key);
    setTimeout(() => setKopyalanan(null), 2000);
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

    // ALGORITMA TAGLARI
    if (satir.startsWith('[ALGORITMA_OZET]')) {
      const metin = satir.replace('[ALGORITMA_OZET]', '').trim();
      const parcalar = metin.split('|');
      const skor = parseInt(parcalar[2]?.trim() || '0');
      const skorRenk = skor >= 8 ? 'text-green-400' : skor >= 5 ? 'text-amber-400' : 'text-red-400';
      const cubukRenk = skor >= 8 ? 'bg-green-500' : skor >= 5 ? 'bg-amber-500' : 'bg-red-500';
      return (
        <div key={i} className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 mt-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-white font-bold">{parcalar[0]?.trim()}</p>
              {parcalar[1] && <p className="text-zinc-400 text-xs mt-0.5">{parcalar[1].trim()}</p>}
            </div>
            <div className="text-right">
              <p className={`${skorRenk} font-bold text-2xl`}>{parcalar[2]?.trim()}/10</p>
              <p className="text-zinc-500 text-xs">fırsat skoru</p>
            </div>
          </div>
          <div className="w-full bg-zinc-700 rounded-full h-1.5">
            <div className={`${cubukRenk} h-1.5 rounded-full`} style={{ width: `${skor * 10}%` }} />
          </div>
        </div>
      );
    }
    if (satir.startsWith('[ONE_CIKAN]')) {
      const metin = satir.replace('[ONE_CIKAN]', '').trim();
      const parcalar = metin.split('|');
      return (
        <div key={i} className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 mt-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">↑ ÖNE ÇIKIYOR</span>
            <p className="text-green-400 font-semibold text-sm">{parcalar[0]?.trim()}</p>
          </div>
          {parcalar[1] && <p className="text-zinc-300 text-xs mb-1">{parcalar[1].trim()}</p>}
          {parcalar[2] && (
            <div className="bg-green-500/10 rounded-lg px-2 py-1">
              <p className="text-green-300 text-xs">Avantaj: {parcalar[2].trim()}</p>
            </div>
          )}
        </div>
      );
    }
    if (satir.startsWith('[GOMULEN]')) {
      const metin = satir.replace('[GOMULEN]', '').trim();
      const parcalar = metin.split('|');
      return (
        <div key={i} className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mt-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">↓ GÖMÜLlüyor</span>
            <p className="text-red-400 font-semibold text-sm">{parcalar[0]?.trim()}</p>
          </div>
          {parcalar[1] && <p className="text-zinc-300 text-xs mb-1">{parcalar[1].trim()}</p>}
          {parcalar[2] && <p className="text-green-400 text-xs">✓ Alternatif: {parcalar[2].trim()}</p>}
        </div>
      );
    }
    if (satir.startsWith('[SINYAL]')) {
      const metin = satir.replace('[SINYAL]', '').trim();
      const parcalar = metin.split('|');
      return (
        <div key={i} className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 mt-1">
          <div className="flex items-center justify-between mb-1">
            <p className="text-blue-400 font-semibold text-sm">{parcalar[0]?.trim()}</p>
            {parcalar[1] && (
              <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded-full">
                {parcalar[1].trim()}
              </span>
            )}
          </div>
          {parcalar[2] && <p className="text-zinc-300 text-xs">{parcalar[2].trim()}</p>}
        </div>
      );
    }
    if (satir.startsWith('[OZELLIK]')) {
      const metin = satir.replace('[OZELLIK]', '').trim();
      const parcalar = metin.split('|');
      return (
        <div key={i} className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-3 mt-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-violet-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">YENİ</span>
            <p className="text-violet-400 font-semibold text-sm">{parcalar[0]?.trim()}</p>
          </div>
          {parcalar[1] && <p className="text-zinc-300 text-xs mb-1">{parcalar[1].trim()}</p>}
          {parcalar[2] && <p className="text-zinc-400 text-xs italic">{parcalar[2].trim()}</p>}
        </div>
      );
    }
    if (satir.startsWith('[SEKTOR]')) {
      const metin = satir.replace('[SEKTOR]', '').trim();
      const parcalar = metin.split('|');
      return (
        <div key={i} className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mt-1">
          <p className="text-amber-400 font-semibold text-sm mb-1">🎯 {parcalar[0]?.trim()}</p>
          {parcalar[1] && <p className="text-zinc-300 text-xs mb-1">{parcalar[1].trim()}</p>}
          {parcalar[2] && (
            <div className="bg-amber-500/10 rounded-lg px-2 py-1">
              <p className="text-amber-300 text-xs">Beklenen: {parcalar[2].trim()}</p>
            </div>
          )}
        </div>
      );
    }
    if (satir.startsWith('[HATA]')) {
      const metin = satir.replace('[HATA]', '').trim();
      const parcalar = metin.split('|');
      return (
        <div key={i} className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mt-1">
          <p className="text-red-400 font-semibold text-sm mb-1">⚠️ {parcalar[0]?.trim()}</p>
          {parcalar[1] && <p className="text-zinc-400 text-xs mb-1">{parcalar[1].trim()}</p>}
          {parcalar[2] && <p className="text-green-400 text-xs">✓ Doğrusu: {parcalar[2].trim()}</p>}
        </div>
      );
    }

    // SEO TAGLARI
    if (satir.startsWith('[KEYWORD]')) {
      const metin = satir.replace('[KEYWORD]', '').trim();
      const parcalar = metin.split('|');
      const rekabet = parcalar[2]?.trim() || '';
      const rekabetRenk = rekabet.toLowerCase().includes('düşük') ? 'text-green-400 bg-green-500/20' :
        rekabet.toLowerCase().includes('orta') ? 'text-amber-400 bg-amber-500/20' : 'text-red-400 bg-red-500/20';
      return (
        <div key={i} className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-bold text-sm">{parcalar[0]?.trim()}</p>
              {parcalar[1] && <p className="text-zinc-400 text-xs mt-0.5">📊 {parcalar[1].trim()} aylık arama</p>}
            </div>
            {parcalar[2] && (
              <span className={`text-xs px-2 py-1 rounded-lg font-semibold ${rekabetRenk}`}>
                {parcalar[2].trim()}
              </span>
            )}
          </div>
        </div>
      );
    }
    if (satir.startsWith('[SEO_BASLIK]')) {
      const metin = satir.replace('[SEO_BASLIK]', '').trim();
      const parcalar = metin.split('|');
      const baslikMetni = parcalar[0]?.trim() || '';
      return (
        <div key={i} className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 mt-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-white font-semibold text-sm mb-1">{baslikMetni}</p>
              {parcalar[1] && (
                <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                  {parcalar[1].trim()}
                </span>
              )}
              {parcalar[2] && <p className="text-zinc-400 text-xs mt-2">{parcalar[2].trim()}</p>}
              {parcalar[3] && <p className="text-zinc-500 text-xs mt-1 italic">Kitle: {parcalar[3].trim()}</p>}
            </div>
            <button
              onClick={() => kopyala(baslikMetni, `baslik-${i}`)}
              className="text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-2 py-1 rounded-lg transition flex-shrink-0"
            >
              {kopyalanan === `baslik-${i}` ? '✓' : 'Kopyala'}
            </button>
          </div>
        </div>
      );
    }
    if (satir.startsWith('[LONGTAIL]')) {
      const metin = satir.replace('[LONGTAIL]', '').trim();
      const parcalar = metin.split('|');
      return (
        <div key={i} className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 mt-1">
          <p className="text-green-400 font-semibold text-sm mb-1">🎯 {parcalar[0]?.trim()}</p>
          {parcalar[1] && <p className="text-zinc-300 text-xs mb-1">{parcalar[1].trim()}</p>}
          {parcalar[2] && <p className="text-zinc-400 text-xs italic">{parcalar[2].trim()}</p>}
        </div>
      );
    }
    if (satir.startsWith('[RAKIP_BOSLUK]')) {
      const metin = satir.replace('[RAKIP_BOSLUK]', '').trim();
      const parcalar = metin.split('|');
      return (
        <div key={i} className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mt-1">
          <p className="text-amber-400 font-semibold text-sm mb-1">💡 Rakip Boşluğu: {parcalar[0]?.trim()}</p>
          {parcalar[1] && <p className="text-zinc-300 text-xs mb-1">{parcalar[1].trim()}</p>}
          {parcalar[2] && (
            <div className="bg-amber-500/10 rounded-lg px-2 py-1 mt-1">
              <p className="text-amber-300 text-xs font-semibold">"{parcalar[2].trim()}"</p>
            </div>
          )}
        </div>
      );
    }
    if (satir.startsWith('[CAPTION]')) {
      const metin = satir.replace('[CAPTION]', '').trim();
      const parcalar = metin.split('|');
      const captionMetni = parcalar[1]?.trim() || parcalar[0]?.trim() || '';
      return (
        <div key={i} className="bg-zinc-800 border border-violet-500/30 rounded-xl p-3 mt-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-violet-400 text-xs font-semibold">📱 Sosyal Medya Versiyonu</p>
            <button
              onClick={() => kopyala(captionMetni, `caption-${i}`)}
              className="text-xs bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 px-2 py-1 rounded-lg transition"
            >
              {kopyalanan === `caption-${i}` ? '✓ Kopyalandı' : 'Kopyala'}
            </button>
          </div>
          <p className="text-zinc-300 text-sm">{captionMetni}</p>
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
      {satirlar.map((satir, i) => satirRender(satir, i))}
    </div>
  );
}

export default function AlgoritmaSeo() {
  const [profil, setProfil] = useState<any>(null);
  const [mod, setMod] = useState<'algoritma' | 'seo'>('algoritma');
  const [icerikKonusu, setIcerikKonusu] = useState('');
  const [sonuc, setSonuc] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);

  const bugunTarih = new Date().toLocaleDateString('tr-TR', {
    month: 'long', year: 'numeric'
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

  async function analizeEt() {
    if (yukleniyor) return;
    if (mod === 'seo' && !icerikKonusu.trim()) return;
    setYukleniyor(true);
    setSonuc('');

    try {
      const res = await fetch('/api/algoritma-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profil, mod, icerikKonusu }),
      });
      const data = await res.json();
      setSonuc(data.cevap);
    } catch {
      setSonuc('[IPUCU] Bir hata oluştu, tekrar dene.');
    }
    setYukleniyor(false);
  }

  const seoOrnekler = [
    'Saç boyama ve bakım hizmetleri',
    'El yapımı pasta ve tatlı siparişi',
    'Ev temizlik hizmeti fiyatları',
    'Düğün fotoğrafçısı',
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-black/90 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <a href="/dashboard" className="text-zinc-500 hover:text-white transition text-sm">← Dashboard</a>
          <div className="text-lg font-bold">via<span className="text-violet-500">.ai</span></div>
        </div>
        <p className="text-xs text-zinc-500">Algoritma & SEO</p>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Algoritma & SEO Merkezi 🔍</h1>
          <p className="text-zinc-400 text-sm">Algoritmaları yeni ve Google'da üst sıralara çık.</p>
        </div>

        {/* Mod Seçici */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => { setMod('algoritma'); setSonuc(''); }}
            className={`p-4 rounded-2xl border-2 transition text-left ${
              mod === 'algoritma'
                ? 'border-violet-500 bg-violet-600/10'
                : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
            }`}
          >
            <p className="text-2xl mb-2">⚙️</p>
            <p className="text-white font-semibold text-sm">Algoritma Raporu</p>
            <p className="text-zinc-500 text-xs mt-1">{bugunTarih} güncel analiz</p>
          </button>
          <button
            onClick={() => { setMod('seo'); setSonuc(''); }}
            className={`p-4 rounded-2xl border-2 transition text-left ${
              mod === 'seo'
                ? 'border-blue-500 bg-blue-600/10'
                : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
            }`}
          >
            <p className="text-2xl mb-2">🔍</p>
            <p className="text-white font-semibold text-sm">SEO Başlık Üretici</p>
            <p className="text-zinc-500 text-xs mt-1">Google'da üst sıra başlıklar</p>
          </button>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-6">
          {profil && (
            <div className="bg-zinc-800 rounded-xl p-3 mb-4">
              <p className="text-xs text-zinc-500 mb-1">Analiz yapılacak işletme:</p>
              <p className="text-white font-semibold">{profil.isletme_adi}</p>
              <p className="text-zinc-400 text-xs">{profil.sektor} · {profil.sehir}</p>
            </div>
          )}

          {mod === 'algoritma' && (
            <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-3 mb-4">
              <p className="text-violet-400 text-sm font-semibold mb-1">⚙️ {bugunTarih} Algoritma Raporu</p>
              <p className="text-zinc-400 text-xs">Bu ay Instagram ve TikTok algoritmalarında neler değişti, hangi içerikler öne çıkıyor — güncel web araştırmasıyla analiz edilecek.</p>
            </div>
          )}

          {mod === 'seo' && (
            <div className="mb-4">
              <label className="text-xs text-zinc-500 mb-2 block">İçerik Konusu</label>
              <input
                type="text"
                value={icerikKonusu}
                onChange={e => setIcerikKonusu(e.target.value)}
                placeholder="Örn: saç bakımı, düğün fotoğrafçısı, el yapımı pasta..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition mb-3"
              />
              {!icerikKonusu && (
                <div>
                  <p className="text-xs text-zinc-600 mb-2">Örnek konular:</p>
                  <div className="flex flex-wrap gap-2">
                    {seoOrnekler.map((ornek) => (
                      <button
                        key={ornek}
                        onClick={() => setIcerikKonusu(ornek)}
                        className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg transition"
                      >
                        {ornek}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            onClick={analizeEt}
            disabled={yukleniyor || (mod === 'seo' && !icerikKonusu.trim())}
            className={`w-full py-3 rounded-xl text-sm font-semibold transition disabled:bg-zinc-700 disabled:text-zinc-500 ${
              mod === 'algoritma'
                ? 'bg-violet-600 hover:bg-violet-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {yukleniyor
              ? 'Analiz ediliyor...'
              : mod === 'algoritma'
              ? '⚙️ Algoritma Raporunu Getir'
              : '🔍 SEO Başlıkları Üret'
            }
          </button>
        </div>

        {yukleniyor && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center mb-4">
            <div className="flex justify-center gap-1 mb-3">
              <div className={`w-2 h-2 ${mod === 'algoritma' ? 'bg-violet-500' : 'bg-blue-500'} rounded-full animate-bounce`} style={{animationDelay: '0ms'}}/>
              <div className={`w-2 h-2 ${mod === 'algoritma' ? 'bg-violet-500' : 'bg-blue-500'} rounded-full animate-bounce`} style={{animationDelay: '150ms'}}/>
              <div className={`w-2 h-2 ${mod === 'algoritma' ? 'bg-violet-500' : 'bg-blue-500'} rounded-full animate-bounce`} style={{animationDelay: '300ms'}}/>
            </div>
            {mod === 'algoritma' ? (
              <>
                <p className="text-zinc-400 text-sm">Instagram ve TikTok algoritmaları araştırılıyor...</p>
                <p className="text-zinc-600 text-xs mt-1">{bugunTarih} güncel verileri toplanıyor</p>
              </>
            ) : (
              <>
                <p className="text-zinc-400 text-sm">Google arama verileri analiz ediliyor...</p>
                <p className="text-zinc-600 text-xs mt-1">{profil?.sehir} ve {profil?.sektor} için SEO fırsatları bulunuyor</p>
              </>
            )}
          </div>
        )}

        {sonuc && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-zinc-400">
                {mod === 'algoritma' ? 'Algoritma raporu hazır 📊' : 'SEO başlıklar hazır 🔍'}
              </p>
              <button
                onClick={() => setSonuc('')}
                className="text-xs text-zinc-500 hover:text-white transition"
              >
                ← Yenile
              </button>
            </div>
            <AlgoritmaSonuc icerik={sonuc} />
          </div>
        )}
      </div>
    </main>
  );
}