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

  function satirRender(satir: string, i: number) {
    if (satir.startsWith('[BASLIK]')) {
      return (
        <div key={i} className="bg-gradient-to-r from-green-600/20 to-violet-600/20 border border-green-500/40 rounded-xl px-4 py-3 mt-3">
          <p className="text-green-300 font-semibold">{satir.replace('[BASLIK]', '').trim()}</p>
        </div>
      );
    }
    if (satir.startsWith('[MARKA_ANALIZ]')) {
      const p = satir.replace('[MARKA_ANALIZ]', '').trim().split('|');
      const skor = parseInt(p[1]?.trim() || '0');
      const skorRenk = skor >= 8 ? 'text-green-400' : skor >= 5 ? 'text-amber-400' : 'text-red-400';
      return (
        <div key={i} className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 mt-2">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white font-semibold text-sm">🏢 Marka Analizi</p>
            <span className={`${skorRenk} font-bold`}>Uyum: {p[1]?.trim()}/10</span>
          </div>
          {p[0] && <p className="text-zinc-300 text-xs mb-1">{p[0].trim()}</p>}
          {p[2] && <p className="text-zinc-400 text-xs italic">{p[2].trim()}</p>}
        </div>
      );
    }
    if (satir.startsWith('[FIYAT]')) {
      const p = satir.replace('[FIYAT]', '').trim().split('|');
      return (
        <div key={i} className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mt-2">
          <p className="text-amber-400 font-bold text-lg mb-1">💰 {p[0]?.trim()}</p>
          {p[1] && <p className="text-zinc-400 text-xs mb-1">{p[1].trim()}</p>}
          {p[2] && <p className="text-amber-300 text-xs">Müzakere: {p[2].trim()}</p>}
        </div>
      );
    }

    // Teklif kartları
    for (const [tag, label, renk, bg, border] of [
      ['[TEKLIF1]', 'Profesyonel', 'text-blue-400', 'bg-blue-500/10', 'border-blue-500/30'],
      ['[TEKLIF2]', 'Samimi & Kişisel', 'text-pink-400', 'bg-pink-500/10', 'border-pink-500/30'],
      ['[TEKLIF3]', 'Kısa & Net', 'text-green-400', 'bg-green-500/10', 'border-green-500/30'],
    ]) {
      if (satir.startsWith(tag)) {
        const metin = satir.replace(tag, '').trim();
        const p = metin.split('|');
        const teklifMetni = p[2]?.trim() || '';
        return (
          <div key={i} className={`${bg} border ${border} rounded-xl p-4 mt-2`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className={`${renk} font-bold text-sm`}>{label}</span>
                {p[1] && <p className="text-zinc-500 text-xs mt-0.5">Konu: {p[1].trim()}</p>}
              </div>
              <button
                onClick={() => kopyala(teklifMetni, `teklif-${i}`)}
                className={`text-xs px-2 py-1 rounded-lg transition ${bg} ${renk} hover:opacity-80`}
              >
                {kopyalanan === `teklif-${i}` ? '✓ Kopyalandı' : 'Kopyala'}
              </button>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">{teklifMetni}</p>
          </div>
        );
      }
    }

    if (satir.startsWith('[TAKIP]')) {
      const p = satir.replace('[TAKIP]', '').trim().split('|');
      const takipMetni = p[0]?.trim() || '';
      return (
        <div key={i} className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4 mt-2">
          <div className="flex items-center justify-between mb-2">
            <p className="text-violet-400 font-semibold text-sm">📩 Takip Mesajı</p>
            <button
              onClick={() => kopyala(takipMetni, `takip-${i}`)}
              className="text-xs bg-violet-500/20 text-violet-400 px-2 py-1 rounded-lg"
            >
              {kopyalanan === `takip-${i}` ? '✓ Kopyalandı' : 'Kopyala'}
            </button>
          </div>
          <p className="text-zinc-300 text-sm leading-relaxed">{takipMetni}</p>
          {p[1] && <p className="text-zinc-500 text-xs mt-2 italic">⏰ {p[1].trim()}</p>}
        </div>
      );
    }
    if (satir.startsWith('[GUCLENDIR]')) {
      const p = satir.replace('[GUCLENDIR]', '').trim().split('|');
      return (
        <div key={i} className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1">
          <p className="text-white font-semibold text-sm mb-1">📊 {p[0]?.trim()}</p>
          {p[1] && <p className="text-zinc-400 text-xs">{p[1].trim()}</p>}
        </div>
      );
    }
    if (satir.startsWith('[IPUCU]')) {
      return (
        <div key={i} className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 mt-1">
          <p className="text-zinc-300 text-xs">📌 {satir.replace('[IPUCU]', '').trim()}</p>
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

export default function IsbírligiTeklif() {
  const [profil, setProfil] = useState<any>(null);
  const [sonuc, setSonuc] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);
  const [form, setForm] = useState({
    markaAdi: '',
    markaAlani: '',
    teklifTuru: 'Sponsorlu içerik',
    takipciSayisi: '',
    ortalamaIzlenme: '',
  });

  useEffect(() => {
    async function profilGetir() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/giris'; return; }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfil(data);
      if (data) {
        setForm(prev => ({
          ...prev,
          takipciSayisi: '10.000',
          ortalamaIzlenme: '25.000',
        }));
      }
    }
    profilGetir();
  }, []);

  async function teklifOlustur() {
    if (!form.markaAdi.trim() || yukleniyor) return;
    setYukleniyor(true);
    setSonuc('');

    try {
      const res = await fetch('/api/isbirligi-teklif', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profil, ...form }),
      });
      const data = await res.json();
      setSonuc(data.cevap);
    } catch {
      setSonuc('[IPUCU] Bir hata oluştu, tekrar dene.');
    }
    setYukleniyor(false);
  }

  const teklifTurleri = [
    'Sponsorlu içerik',
    'Ürün tanıtımı',
    'Uzun vadeli marka elçisi',
    'Etkinlik daveti',
    'Affiliate / Komisyon',
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-black/90 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <a href="/sahis-dashboard" className="text-zinc-500 hover:text-white transition text-sm">← Dashboard</a>
          <div className="text-lg font-bold">VIA<span className="text-violet-500">.AI</span></div>
        </div>
        <p className="text-xs text-zinc-500">İşbirliği Teklif Yazıcı</p>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">İşbirliği Teklif Yazıcı 🤝</h1>
          <p className="text-zinc-400 text-sm">Markaya gönderecek profesyonel teklif metnini AI yazar, sen kopyala gönder.</p>
        </div>

        {!sonuc && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Marka Adı *</label>
                  <input
                    type="text"
                    value={form.markaAdi}
                    onChange={e => setForm(prev => ({ ...prev, markaAdi: e.target.value }))}
                    placeholder="Örn: Nike, Lcw, Gratis..."
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-green-500 transition"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Marka Alanı</label>
                  <input
                    type="text"
                    value={form.markaAlani}
                    onChange={e => setForm(prev => ({ ...prev, markaAlani: e.target.value }))}
                    placeholder="Örn: spor giyim, kozmetik..."
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-green-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-500 mb-2 block">Teklif Türü</label>
                <div className="flex flex-wrap gap-2">
                  {teklifTurleri.map(t => (
                    <button
                      key={t}
                      onClick={() => setForm(prev => ({ ...prev, teklifTuru: t }))}
                      className={`px-3 py-1.5 rounded-xl text-xs transition ${
                        form.teklifTuru === t
                          ? 'bg-green-600 text-white font-semibold'
                          : 'bg-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Takipçi Sayısı</label>
                  <input
                    type="text"
                    value={form.takipciSayisi}
                    onChange={e => setForm(prev => ({ ...prev, takipciSayisi: e.target.value }))}
                    placeholder="10.000"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-green-500 transition"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Ort. İzlenme</label>
                  <input
                    type="text"
                    value={form.ortalamaIzlenme}
                    onChange={e => setForm(prev => ({ ...prev, ortalamaIzlenme: e.target.value }))}
                    placeholder="25.000"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-green-500 transition"
                  />
                </div>
              </div>

              <button
                onClick={teklifOlustur}
                disabled={yukleniyor || !form.markaAdi.trim()}
                className="w-full bg-gradient-to-r from-green-600 to-violet-600 hover:opacity-90 disabled:from-zinc-700 disabled:to-zinc-700 disabled:text-zinc-500 py-3 rounded-xl text-sm font-semibold transition"
              >
                {yukleniyor ? 'Teklif yazılıyor...' : '🤝 Teklif Oluştur'}
              </button>
            </div>
          </div>
        )}

        {yukleniyor && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center mb-4">
            <div className="flex justify-center gap-1 mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}/>
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}/>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}/>
            </div>
            <p className="text-zinc-400 text-sm">{form.markaAdi} araştırılıyor...</p>
            <p className="text-zinc-600 text-xs mt-1">Profesyonel teklif metni hazırlanıyor</p>
          </div>
        )}

        {sonuc && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-zinc-400">Teklifin hazır, kopyala gönder! 🤝</p>
              <button onClick={() => setSonuc('')} className="text-xs text-zinc-500 hover:text-white transition">
                ← Yeni Teklif
              </button>
            </div>
            <SonucKarti icerik={sonuc} />
          </div>
        )}
      </div>
    </main>
  );
}