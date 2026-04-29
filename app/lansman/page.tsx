'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

function SonucKarti({ icerik }: { icerik: string }) {
  const satirlar = icerik.split('\n').filter(s => s.trim());
  const [kopyalanan, setKopyalanan] = useState<string | null>(null);
  const [acikAsamalar, setAcikAsamalar] = useState<number[]>([0]);

  function kopyala(metin: string, key: string) {
    navigator.clipboard.writeText(metin);
    setKopyalanan(key);
    setTimeout(() => setKopyalanan(null), 2000);
  }

  // Aşamaları grupla
  const asamalar: { baslik: string; index: number; satirlar: string[] }[] = [];
  let mevcutAsama: { baslik: string; index: number; satirlar: string[] } | null = null;
  const genelSatirlar: { satir: string; i: number }[] = [];

  satirlar.forEach((satir, i) => {
    if (satir.startsWith('[ASAMA]')) {
      if (mevcutAsama) asamalar.push(mevcutAsama);
      mevcutAsama = { baslik: satir, index: asamalar.length, satirlar: [] };
    } else if (mevcutAsama) {
      mevcutAsama.satirlar.push(satir);
    } else {
      genelSatirlar.push({ satir, i });
    }
  });
  if (mevcutAsama) asamalar.push(mevcutAsama);

  function satirRender(satir: string, i: number) {
    if (satir.startsWith('[BASLIK]')) {
      const metin = satir.replace('[BASLIK]', '').trim();
      return (
        <div key={i} className="bg-violet-600/20 border border-violet-500/40 rounded-xl px-4 py-3 mt-3">
          <p className="text-violet-300 font-semibold">{metin}</p>
        </div>
      );
    }
    if (satir.startsWith('[STRATEJI]')) {
      const metin = satir.replace('[STRATEJI]', '').trim();
      const parcalar = metin.split('|');
      return (
        <div key={i} className="bg-gradient-to-r from-violet-600/20 to-pink-600/20 border border-violet-500/40 rounded-xl p-4 mt-2">
          <p className="text-white font-bold mb-2">🚀 {parcalar[0]?.trim()}</p>
          {parcalar[1] && (
            <div className="bg-black/20 rounded-lg px-3 py-2 mb-2">
              <p className="text-xs text-zinc-400 mb-1">Ana Mesaj:</p>
              <p className="text-violet-300 font-semibold text-sm">"{parcalar[1].trim()}"</p>
            </div>
          )}
          {parcalar[2] && <p className="text-zinc-400 text-xs">🧠 {parcalar[2].trim()}</p>}
        </div>
      );
    }
    if (satir.startsWith('[GUN]')) {
      const metin = satir.replace('[GUN]', '').trim();
      const parcalar = metin.split('|');
      return (
        <div key={i} className="flex items-start gap-3 bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1">
          <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0">
            G{parcalar[0]?.trim()}
          </div>
          <div className="flex-1">
            {parcalar[1] && <p className="text-violet-400 text-xs font-semibold mb-0.5">{parcalar[1].trim()}</p>}
            {parcalar[2] && <p className="text-zinc-300 text-sm">{parcalar[2].trim()}</p>}
          </div>
        </div>
      );
    }
    if (satir.startsWith('[ICERIK]')) {
      const metin = satir.replace('[ICERIK]', '').trim();
      const parcalar = metin.split('|');
      return (
        <div key={i} className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1 ml-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-white font-semibold text-xs">🎬 {parcalar[0]?.trim()}</p>
            {parcalar[2] && (
              <span className="text-xs bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded-full">
                {parcalar[2].trim()}
              </span>
            )}
          </div>
          {parcalar[1] && <p className="text-zinc-400 text-xs">{parcalar[1].trim()}</p>}
        </div>
      );
    }
    if (satir.startsWith('[REKLAM]')) {
      const metin = satir.replace('[REKLAM]', '').trim();
      const parcalar = metin.split('|');
      const reklamMetni = parcalar.slice(1, 4).join('\n');
      return (
        <div key={i} className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mt-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">REKLAM</span>
              <p className="text-blue-400 font-semibold text-sm">{parcalar[0]?.trim()}</p>
            </div>
            <button
              onClick={() => kopyala(reklamMetni, `reklam-${i}`)}
              className="text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-2 py-1 rounded-lg transition"
            >
              {kopyalanan === `reklam-${i}` ? '✓ Kopyalandı' : 'Kopyala'}
            </button>
          </div>
          {parcalar[1] && (
            <div className="mb-2">
              <p className="text-xs text-zinc-500 mb-0.5">Başlık:</p>
              <p className="text-white font-semibold text-sm">{parcalar[1].trim()}</p>
            </div>
          )}
          {parcalar[2] && (
            <div className="mb-2">
              <p className="text-xs text-zinc-500 mb-0.5">Metin:</p>
              <p className="text-zinc-300 text-sm">{parcalar[2].trim()}</p>
            </div>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {parcalar[3] && (
              <div className="bg-green-500/20 rounded-lg px-2 py-1">
                <p className="text-green-400 text-xs font-semibold">CTA: {parcalar[3].trim()}</p>
              </div>
            )}
            {parcalar[4] && (
              <div className="bg-zinc-700 rounded-lg px-2 py-1">
                <p className="text-zinc-300 text-xs">🎯 {parcalar[4].trim()}</p>
              </div>
            )}
            {parcalar[5] && (
              <div className="bg-amber-500/20 rounded-lg px-2 py-1">
                <p className="text-amber-400 text-xs">💰 {parcalar[5].trim()}</p>
              </div>
            )}
          </div>
        </div>
      );
    }
    if (satir.startsWith('[HYPE]')) {
      const metin = satir.replace('[HYPE]', '').trim();
      const parcalar = metin.split('|');
      return (
        <div key={i} className="bg-pink-500/10 border border-pink-500/30 rounded-xl p-3 mt-1">
          <p className="text-pink-400 font-semibold text-sm mb-1">🔥 {parcalar[0]?.trim()}</p>
          {parcalar[1] && <p className="text-zinc-300 text-xs mb-1">{parcalar[1].trim()}</p>}
          {parcalar[2] && (
            <div className="bg-pink-500/10 rounded-lg px-2 py-1 mt-1">
              <p className="text-pink-300 text-xs">Beklenen: {parcalar[2].trim()}</p>
            </div>
          )}
        </div>
      );
    }
    if (satir.startsWith('[BUTCE]')) {
      const metin = satir.replace('[BUTCE]', '').trim();
      const parcalar = metin.split('|');
      return (
        <div key={i} className="flex items-center justify-between bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 mt-1">
          <p className="text-zinc-300 text-sm">{parcalar[0]?.trim()}</p>
          <div className="flex items-center gap-2">
            {parcalar[1] && <p className="text-amber-400 font-bold text-sm">{parcalar[1].trim()}</p>}
            {parcalar[2] && <p className="text-zinc-500 text-xs">{parcalar[2].trim()}</p>}
          </div>
        </div>
      );
    }
    if (satir.startsWith('[LANSMAN_GUNU]')) {
      const metin = satir.replace('[LANSMAN_GUNU]', '').trim();
      const parcalar = metin.split('|');
      return (
        <div key={i} className="flex items-start gap-3 bg-green-500/10 border border-green-500/30 rounded-xl p-3 mt-1">
          <div className="bg-green-500 text-black text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0">
            {parcalar[0]?.trim()}
          </div>
          <div>
            {parcalar[1] && <p className="text-zinc-300 text-sm">{parcalar[1].trim()}</p>}
            {parcalar[2] && <p className="text-zinc-500 text-xs mt-0.5">{parcalar[2].trim()}</p>}
          </div>
        </div>
      );
    }
    if (satir.startsWith('[KITALIK]')) {
      const metin = satir.replace('[KITALIK]', '').trim();
      const parcalar = metin.split('|');
      return (
        <div key={i} className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mt-1">
          <p className="text-red-400 font-semibold text-sm mb-1">⚡ {parcalar[0]?.trim()}</p>
          {parcalar[1] && <p className="text-zinc-300 text-xs mb-1">{parcalar[1].trim()}</p>}
          {parcalar[2] && <p className="text-zinc-500 text-xs italic">Psikoloji: {parcalar[2].trim()}</p>}
        </div>
      );
    }
    if (satir.startsWith('[HEDEF]')) {
      const metin = satir.replace('[HEDEF]', '').trim();
      const parcalar = metin.split('|');
      return (
        <div key={i} className="flex items-center justify-between bg-violet-500/10 border border-violet-500/30 rounded-xl px-3 py-2 mt-1">
          <p className="text-violet-400 text-sm">{parcalar[0]?.trim()}</p>
          <div className="text-right">
            {parcalar[1] && <p className="text-white font-bold text-sm">{parcalar[1].trim()}</p>}
            {parcalar[2] && <p className="text-zinc-500 text-xs">{parcalar[2].trim()}</p>}
          </div>
        </div>
      );
    }
    if (satir.startsWith('[IPUCU]')) {
      const metin = satir.replace('[IPUCU]', '').trim();
      return (
        <div key={i} className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2 mt-1">
          <p className="text-amber-400 text-sm">💡 {metin}</p>
        </div>
      );
    }
    return null;
  }

  const asamaRenkleri = [
    { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', badge: 'bg-purple-600' },
    { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', badge: 'bg-blue-600' },
    { bg: 'bg-pink-500/10', border: 'border-pink-500/30', text: 'text-pink-400', badge: 'bg-pink-600' },
    { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', badge: 'bg-red-600' },
    { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', badge: 'bg-green-600' },
  ];

  return (
    <div className="space-y-2">
      {genelSatirlar.map(({ satir, i }) => satirRender(satir, i))}

      {asamalar.length > 0 && (
        <div className="mt-6">
          <p className="text-xs text-zinc-500 mb-3">📅 Lansman Takvimi ({asamalar.length} aşama)</p>

          {/* Aşama İlerleme Çubuğu */}
          <div className="flex gap-1 mb-4">
            {asamalar.map((_, ai) => (
              <div
                key={ai}
                className={`h-1.5 flex-1 rounded-full ${asamaRenkleri[ai % asamaRenkleri.length].badge}`}
              />
            ))}
          </div>

          <div className="space-y-3">
            {asamalar.map((asama, ai) => {
              const parcalar = asama.baslik.replace('[ASAMA]', '').trim().split('|');
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
                        {parcalar[1]?.trim()}
                      </div>
                      <div className="text-left">
                        <p className={`${renk.text} font-bold text-sm`}>{parcalar[0]?.trim()}</p>
                        {parcalar[2] && <p className="text-zinc-500 text-xs">{parcalar[2].trim()}</p>}
                      </div>
                    </div>
                    <span className="text-zinc-500 text-xs">{acik ? '▲' : '▼'}</span>
                  </button>
                  {acik && (
                    <div className="px-4 pb-4 space-y-2">
                      {asama.satirlar.map((satir, si) => satirRender(satir, si))}
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

export default function Lansman() {
  const [profil, setProfil] = useState<any>(null);
  const [sonuc, setSonuc] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);
  const [form, setForm] = useState({
    urunAdi: '',
    urunAciklama: '',
    fiyat: '',
    hedefKitle: '',
    lansmanTarihi: '',
    butce: '',
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

  function formGuncelle(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function stratejiOlustur() {
    if (!form.urunAdi.trim() || yukleniyor) return;
    setYukleniyor(true);
    setSonuc('');

    try {
      const res = await fetch('/api/lansman', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, profil }),
      });
      const data = await res.json();
      setSonuc(data.cevap);
    } catch {
      setSonuc('[IPUCU] Bir hata oluştu, tekrar dene.');
    }
    setYukleniyor(false);
  }

  const ornekler = [
    { urunAdi: 'Yaz Koleksiyonu 2025', urunAciklama: 'Yeni sezon kadın giyim koleksiyonu, 30 parça', fiyat: '299-899 TL', hedefKitle: '22-35 yaş moda takipçisi kadınlar', butce: '5000 TL' },
    { urunAdi: 'Özel Menü Paketi', urunAciklama: 'Restoranın özel 5 çeşit akşam yemeği paketi', fiyat: '450 TL/kişi', hedefKitle: 'Özel gün kutlamak isteyen çiftler', butce: '2000 TL' },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-black/90 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <a href="/dashboard" className="text-zinc-500 hover:text-white transition text-sm">← Dashboard</a>
          <div className="text-lg font-bold">via<span className="text-violet-500">.ai</span></div>
        </div>
        <p className="text-xs text-zinc-500">Lansman Stratejisti</p>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Lansman Stratejisti 🚀</h1>
          <p className="text-zinc-400 text-sm">Ürün daha çıkmadan talep yarat. 2 haftalık gün gün lansman planı.</p>
        </div>

        {!sonuc && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-6">
            <p className="text-sm font-semibold mb-4 text-zinc-300">Ürün / Hizmet Bilgileri</p>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Ürün / Hizmet Adı *</label>
                <input
                  type="text"
                  value={form.urunAdi}
                  onChange={e => formGuncelle('urunAdi', e.target.value)}
                  placeholder="Örn: Yaz Koleksiyonu 2025"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Açıklama</label>
                <textarea
                  value={form.urunAciklama}
                  onChange={e => formGuncelle('urunAciklama', e.target.value)}
                  placeholder="Ürün/hizmet nedir, ne işe yarar, ne fark yaratır?"
                  rows={3}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Fiyat</label>
                  <input
                    type="text"
                    value={form.fiyat}
                    onChange={e => formGuncelle('fiyat', e.target.value)}
                    placeholder="299 TL"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Reklam Bütçesi</label>
                  <input
                    type="text"
                    value={form.butce}
                    onChange={e => formGuncelle('butce', e.target.value)}
                    placeholder="3000 TL"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Hedef Kitle</label>
                <input
                  type="text"
                  value={form.hedefKitle}
                  onChange={e => formGuncelle('hedefKitle', e.target.value)}
                  placeholder="Örn: 25-40 yaş arası kadınlar, İstanbul"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Lansman Tarihi</label>
                <input
                  type="date"
                  value={form.lansmanTarihi}
                  onChange={e => formGuncelle('lansmanTarihi', e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500 transition"
                />
              </div>
            </div>

            <button
              onClick={stratejiOlustur}
              disabled={yukleniyor || !form.urunAdi.trim()}
              className="w-full mt-4 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 disabled:from-zinc-700 disabled:to-zinc-700 disabled:text-zinc-500 py-3 rounded-xl text-sm font-semibold transition"
            >
              {yukleniyor ? 'Strateji hazırlanıyor...' : '🚀 Lansman Stratejisi Oluştur'}
            </button>

            {!form.urunAdi && (
              <div className="mt-4">
                <p className="text-xs text-zinc-500 mb-2">Hızlı başlangıç:</p>
                <div className="space-y-2">
                  {ornekler.map((ornek, i) => (
                    <button
                      key={i}
                      onClick={() => setForm(prev => ({ ...prev, ...ornek, lansmanTarihi: prev.lansmanTarihi }))}
                      className="w-full text-left bg-zinc-800 border border-zinc-700 hover:border-violet-500 px-4 py-3 rounded-xl transition"
                    >
                      <p className="text-white text-sm font-medium">{ornek.urunAdi}</p>
                      <p className="text-zinc-500 text-xs mt-0.5">{ornek.urunAciklama}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {yukleniyor && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center mb-4">
            <div className="flex justify-center gap-1 mb-3">
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}/>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}/>
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}/>
            </div>
            <p className="text-zinc-400 text-sm">Apple, Tesla ve Gymshark lansman stratejileri analiz ediliyor...</p>
            <p className="text-zinc-600 text-xs mt-1">14 günlük gün gün plan hazırlanıyor</p>
          </div>
        )}

        {sonuc && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-zinc-400">Lansman stratejin hazır 🎉</p>
              <button
                onClick={() => setSonuc('')}
                className="text-xs text-zinc-500 hover:text-white transition"
              >
                ← Yeni Strateji
              </button>
            </div>
            <SonucKarti icerik={sonuc} />
          </div>
        )}
      </div>
    </main>
  );
}