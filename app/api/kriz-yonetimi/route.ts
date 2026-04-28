'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

function SonucKarti({ icerik }: { icerik: string }) {
  const satirlar = icerik.split('\n').filter(s => s.trim());
  const [kopyalanan, setKopyalanan] = useState<number | null>(null);

  function kopyala(metin: string, index: number) {
    navigator.clipboard.writeText(metin);
    setKopyalanan(index);
    setTimeout(() => setKopyalanan(null), 2000);
  }

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

        if (satir.startsWith('[ANALIZ]')) {
          const metin = satir.replace('[ANALIZ]', '').trim();
          const parcalar = metin.split('|');
          const aciliyet = parcalar[1]?.trim() || '';
          const aciliyetRenk = aciliyet.toLowerCase().includes('yüksek') ? 'text-red-400 bg-red-500/20' :
            aciliyet.toLowerCase().includes('orta') ? 'text-amber-400 bg-amber-500/20' : 'text-green-400 bg-green-500/20';
          return (
            <div key={i} className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 mt-2">
              <p className="text-xs text-zinc-500 mb-3">🔍 Kriz Analizi</p>
              <div className="grid grid-cols-3 gap-2">
                {parcalar[0] && (
                  <div className="bg-zinc-900 rounded-lg p-2 text-center">
                    <p className="text-xs text-zinc-500 mb-1">Boyut</p>
                    <p className="text-white text-xs font-semibold">{parcalar[0].trim()}</p>
                  </div>
                )}
                {parcalar[1] && (
                  <div className={`${aciliyetRenk} rounded-lg p-2 text-center`}>
                    <p className="text-xs opacity-70 mb-1">Aciliyet</p>
                    <p className="text-xs font-bold">{parcalar[1].trim()}</p>
                  </div>
                )}
                {parcalar[2] && (
                  <div className="bg-zinc-900 rounded-lg p-2 text-center">
                    <p className="text-xs text-zinc-500 mb-1">Temel Sorun</p>
                    <p className="text-white text-xs font-semibold">{parcalar[2].trim()}</p>
                  </div>
                )}
              </div>
            </div>
          );
        }

        if (satir.startsWith('[CEVAP1]')) {
          const metin = satir.replace('[CEVAP1]', '').trim();
          const parcalar = metin.split('|');
          const cevapMetni = parcalar[1]?.trim() || '';
          return (
            <div key={i} className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mt-2">
              <div className="flex items-center justify-between mb-2">
                <p className="text-blue-400 font-semibold text-sm">🤝 {parcalar[0]?.trim()}</p>
                <button
                  onClick={() => kopyala(cevapMetni, i)}
                  className="text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-2 py-1 rounded-lg transition"
                >
                  {kopyalanan === i ? '✓ Kopyalandı' : 'Kopyala'}
                </button>
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed">{cevapMetni}</p>
            </div>
          );
        }

        if (satir.startsWith('[CEVAP2]')) {
          const metin = satir.replace('[CEVAP2]', '').trim();
          const parcalar = metin.split('|');
          const cevapMetni = parcalar[1]?.trim() || '';
          return (
            <div key={i} className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mt-2">
              <div className="flex items-center justify-between mb-2">
                <p className="text-green-400 font-semibold text-sm">🙏 {parcalar[0]?.trim()}</p>
                <button
                  onClick={() => kopyala(cevapMetni, i)}
                  className="text-xs bg-green-500/20 hover:bg-green-500/30 text-green-400 px-2 py-1 rounded-lg transition"
                >
                  {kopyalanan === i ? '✓ Kopyalandı' : 'Kopyala'}
                </button>
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed">{cevapMetni}</p>
            </div>
          );
        }

        if (satir.startsWith('[CEVAP3]')) {
          const metin = satir.replace('[CEVAP3]', '').trim();
          const parcalar = metin.split('|');
          const cevapMetni = parcalar[1]?.trim() || '';
          return (
            <div key={i} className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mt-2">
              <div className="flex items-center justify-between mb-2">
                <p className="text-amber-400 font-semibold text-sm">💪 {parcalar[0]?.trim()}</p>
                <button
                  onClick={() => kopyala(cevapMetni, i)}
                  className="text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 px-2 py-1 rounded-lg transition"
                >
                  {kopyalanan === i ? '✓ Kopyalandı' : 'Kopyala'}
                </button>
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed">{cevapMetni}</p>
            </div>
          );
        }

        if (satir.startsWith('[KURTARMA]')) {
          const metin = satir.replace('[KURTARMA]', '').trim();
          const parcalar = metin.split('|');
          return (
            <div key={i} className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-3 mt-1">
              <p className="text-violet-400 font-semibold text-sm mb-1">🎯 {parcalar[0]?.trim()}</p>
              {parcalar[1] && <p className="text-zinc-300 text-xs">{parcalar[1].trim()}</p>}
            </div>
          );
        }

        if (satir.startsWith('[ONLEM]')) {
          const metin = satir.replace('[ONLEM]', '').trim();
          const parcalar = metin.split('|');
          return (
            <div key={i} className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1">
              <p className="text-white font-semibold text-sm mb-1">🛡️ {parcalar[0]?.trim()}</p>
              {parcalar[1] && <p className="text-zinc-400 text-xs">{parcalar[1].trim()}</p>}
            </div>
          );
        }

        if (satir.startsWith('[ITIBAR]')) {
          const metin = satir.replace('[ITIBAR]', '').trim();
          const parcalar = metin.split('|');
          return (
            <div key={i} className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-3 mt-1">
              <p className="text-cyan-400 font-semibold text-sm mb-1">📈 {parcalar[0]?.trim()}</p>
              {parcalar[1] && <p className="text-zinc-300 text-xs">{parcalar[1].trim()}</p>}
            </div>
          );
        }

        if (satir.startsWith('[IPUCU]')) {
          const metin = satir.replace('[IPUCU]', '').trim();
          return (
            <div key={i} className="bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2 mt-1">
              <p className="text-red-400 text-sm font-semibold">🚨 {metin}</p>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}

export default function KrizYonetimi() {
  const [durum, setDurum] = useState('');
  const [krizTipi, setKrizTipi] = useState('Kötü yorum');
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

  async function cozumUret() {
    if (!durum.trim() || yukleniyor) return;
    setYukleniyor(true);
    setSonuc('');

    try {
      const res = await fetch('/api/kriz-yonetimi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ durum, krizTipi, profil }),
      });
      const data = await res.json();
      setSonuc(data.cevap);
    } catch {
      setSonuc('[IPUCU] Bir hata oluştu, tekrar dene.');
    }
    setYukleniyor(false);
  }

  const krizTipleri = [
    'Kötü yorum',
    'Müşteri şikayeti',
    'Sosyal medya krizi',
    'Ürün/hizmet sorunu',
    'Geç teslimat',
    'Fiyat şikayeti',
    'Çalışan davranışı',
    'Diğer',
  ];

  const ornekler = [
    '"Berbat hizmet, bir daha gelmem. Herkese tavsiye etmem" yorumu geldi.',
    'Müşteri ürünün bozuk geldiğini söyleyip para iadesi istiyor.',
    'Bir gönderimiz sosyal medyada yanlış anlaşıldı ve tepki çekiyor.',
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-black/90 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <a href="/dashboard" className="text-zinc-500 hover:text-white transition text-sm">← Dashboard</a>
          <div className="text-lg font-bold">via<span className="text-violet-500">.ai</span></div>
        </div>
        <p className="text-xs text-zinc-500">Kriz Yönetimi</p>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Kriz Yönetimi 🚨</h1>
          <p className="text-zinc-400 text-sm">Zor durumu anlat, AI sana 3 farklı profesyonel cevap seçeneği sunsun.</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-4">
          <label className="text-xs text-zinc-500 mb-2 block">Kriz Tipi</label>
          <div className="flex flex-wrap gap-2 mb-4">
            {krizTipleri.map((tip) => (
              <button
                key={tip}
                onClick={() => setKrizTipi(tip)}
                className={`text-xs px-3 py-1.5 rounded-lg transition ${
                  krizTipi === tip
                    ? 'bg-violet-600 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {tip}
              </button>
            ))}
          </div>

          <label className="text-xs text-zinc-500 mb-2 block">Ne oldu? Durumu anlat</label>
          <textarea
            value={durum}
            onChange={e => setDurum(e.target.value)}
            placeholder="Yaşanan durumu detaylıca anlat. Müşteri ne dedi, ne yazdı, ne oldu?"
            rows={4}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition resize-none mb-3"
          />
          <button
            onClick={cozumUret}
            disabled={yukleniyor || !durum.trim()}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 disabled:text-zinc-500 py-3 rounded-xl text-sm font-semibold transition"
          >
            {yukleniyor ? 'Çözüm üretiliyor...' : 'Krizi Çöz →'}
          </button>
        </div>

        {!sonuc && !yukleniyor && (
          <div className="mb-6">
            <p className="text-xs text-zinc-500 mb-2">Örnek durumlar:</p>
            <div className="space-y-2">
              {ornekler.map((ornek, i) => (
                <button
                  key={i}
                  onClick={() => setDurum(ornek)}
                  className="w-full text-left text-xs bg-zinc-900 border border-zinc-800 hover:border-red-500/50 px-3 py-2 rounded-xl text-zinc-400 hover:text-white transition"
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
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}/>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}/>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}/>
            </div>
            Kriz analiz ediliyor, çözüm üretiliyor...
          </div>
        )}

        {sonuc && <SonucKarti icerik={sonuc} />}
      </div>
    </main>
  );
}