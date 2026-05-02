'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

function SonucKarti({ icerik }: { icerik: string }) {
  const satirlar = icerik.split('\n').filter(s => s.trim());
  const [kopyalanan, setKopyalanan] = useState<string | null>(null);
  const [acikKancalar, setAcikKancalar] = useState<number[]>([0]);

  function kopyala(metin: string, key: string) {
    navigator.clipboard.writeText(metin);
    setKopyalanan(key);
    setTimeout(() => setKopyalanan(null), 2000);
  }

  const kancalar: { baslik: string; index: number; satirlar: string[] }[] = [];
  let mevcutKanca: { baslik: string; index: number; satirlar: string[] } | null = null;
  const genelSatirlar: { satir: string; i: number }[] = [];

  satirlar.forEach((satir, i) => {
    if (satir.startsWith('[KANCA]')) {
      if (mevcutKanca) kancalar.push(mevcutKanca);
      mevcutKanca = { baslik: satir, index: kancalar.length, satirlar: [] };
    } else if (mevcutKanca) {
      mevcutKanca.satirlar.push(satir);
    } else {
      genelSatirlar.push({ satir, i });
    }
  });
  if (mevcutKanca) kancalar.push(mevcutKanca);

  function satirRender(satir: string, i: number) {
    if (satir.startsWith('[BASLIK]')) {
      return (
        <div key={i} className="bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-500/40 rounded-xl px-4 py-3 mt-3">
          <p className="text-red-300 font-semibold">{satir.replace('[BASLIK]', '').trim()}</p>
        </div>
      );
    }
    if (satir.startsWith('[SAHNE]')) {
      const p = satir.replace('[SAHNE]', '').trim().split('|');
      return (
        <div key={i} className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1">
          <p className="text-xs text-zinc-500 mb-2">🎥 Görsel Sahne</p>
          {p[0] && <p className="text-zinc-300 text-sm mb-1">{p[0].trim()}</p>}
          {p[1] && <p className="text-zinc-500 text-xs mb-1">Kamera: {p[1].trim()}</p>}
          {p[2] && <p className="text-zinc-500 text-xs">Hareket: {p[2].trim()}</p>}
        </div>
      );
    }
    if (satir.startsWith('[SES]')) {
      const p = satir.replace('[SES]', '').trim().split('|');
      return (
        <div key={i} className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-3 mt-1">
          <p className="text-violet-400 font-semibold text-sm mb-1">🎵 {p[0]?.trim()}</p>
          {p[1] && <p className="text-zinc-400 text-xs">{p[1].trim()}</p>}
        </div>
      );
    }
    if (satir.startsWith('[NEDEN]')) {
      const p = satir.replace('[NEDEN]', '').trim().split('|');
      return (
        <div key={i} className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 mt-1">
          <p className="text-blue-400 font-semibold text-sm mb-1">🧠 {p[0]?.trim()}</p>
          {p[1] && <p className="text-zinc-400 text-xs">{p[1].trim()}</p>}
        </div>
      );
    }
    if (satir.startsWith('[ALTERNATIF]')) {
      const p = satir.replace('[ALTERNATIF]', '').trim().split('|');
      return (
        <div key={i} className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1">
          <p className="text-xs text-zinc-500 mb-2">🔀 A/B Test Versiyonları</p>
          <div className="grid grid-cols-2 gap-2">
            {p[0] && (
              <div className="bg-green-500/10 rounded-lg p-2">
                <p className="text-green-400 text-xs font-bold mb-1">A</p>
                <p className="text-zinc-300 text-xs">{p[0].trim()}</p>
              </div>
            )}
            {p[1] && (
              <div className="bg-blue-500/10 rounded-lg p-2">
                <p className="text-blue-400 text-xs font-bold mb-1">B</p>
                <p className="text-zinc-300 text-xs">{p[1].trim()}</p>
              </div>
            )}
          </div>
        </div>
      );
    }
    if (satir.startsWith('[TEST]')) {
      const p = satir.replace('[TEST]', '').trim().split('|');
      return (
        <div key={i} className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mt-1">
          <p className="text-amber-400 font-semibold text-sm mb-1">🏆 {p[0]?.trim()}</p>
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

  const tipRenkleri: Record<string, string> = {
    'merak': 'bg-purple-600',
    'şok': 'bg-red-600',
    'empati': 'bg-pink-600',
    'sosyal': 'bg-blue-600',
    'tehdit': 'bg-orange-600',
    'zıtlık': 'bg-violet-600',
    'hikaye': 'bg-green-600',
    'soru': 'bg-cyan-600',
    'liste': 'bg-amber-600',
    'meydan': 'bg-rose-600',
  };

  function tipRenk(tip: string): string {
    const key = Object.keys(tipRenkleri).find(k => tip.toLowerCase().includes(k));
    return key ? tipRenkleri[key] : 'bg-zinc-600';
  }

  return (
    <div className="space-y-2">
      {genelSatirlar.map(({ satir, i }) => satirRender(satir, i))}

      {kancalar.length > 0 && (
        <div className="mt-6">
          <p className="text-xs text-zinc-500 mb-3">⚡ {kancalar.length} Viral Kanca Hazır</p>
          <div className="space-y-3">
            {kancalar.map((kanca, ki) => {
              const p = kanca.baslik.replace('[KANCA]', '').trim().split('|');
              const kancaMetni = p[2]?.trim() || '';
              const tip = p[1]?.trim() || '';
              const acik = acikKancalar.includes(ki);
              return (
                <div key={ki} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3">
                    <button
                      onClick={() => setAcikKancalar(prev =>
                        prev.includes(ki) ? prev.filter(x => x !== ki) : [...prev, ki]
                      )}
                      className="flex items-center gap-3 flex-1 text-left"
                    >
                      <div className={`${tipRenk(tip)} text-white text-xs font-bold w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0`}>
                        {p[0]?.trim()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs text-zinc-500">{tip}</span>
                        </div>
                        <p className="text-white text-sm font-medium leading-tight line-clamp-1">{kancaMetni}</p>
                      </div>
                    </button>
                    <div className="flex items-center gap-2 ml-2">
                      <button
                        onClick={() => kopyala(kancaMetni, `kanca-${ki}`)}
                        className="text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 px-2 py-1 rounded-lg transition flex-shrink-0"
                      >
                        {kopyalanan === `kanca-${ki}` ? '✓' : 'Kopyala'}
                      </button>
                      <span className="text-zinc-500 text-xs">{acik ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {acik && (
                    <div className="px-4 pb-4 space-y-2 border-t border-zinc-800 pt-3">
                      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">İLK 3 SANİYE</div>
                          </div>
                          <button
                            onClick={() => kopyala(kancaMetni, `kanca-full-${ki}`)}
                            className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-lg"
                          >
                            {kopyalanan === `kanca-full-${ki}` ? '✓ Kopyalandı' : 'Kopyala'}
                          </button>
                        </div>
                        <p className="text-white font-semibold text-lg leading-tight">"{kancaMetni}"</p>
                      </div>
                      {kanca.satirlar.map((satir, si) => satirRender(satir, si + ki * 100))}
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

export default function ViralKanca() {
  const [profil, setProfil] = useState<any>(null);
  const [sonuc, setSonuc] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);
  const [form, setForm] = useState({
    icerikKonusu: '',
    platform: 'Instagram & TikTok',
    hedefDuygu: 'Merak',
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

  async function kancaUret() {
    if (!form.icerikKonusu.trim() || yukleniyor) return;
    setYukleniyor(true);
    setSonuc('');

    try {
      const res = await fetch('/api/sahis-ai', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ tip: 'viral-kanca', profil, ...form }),
});
      const data = await res.json();
      setSonuc(data.cevap);
    } catch {
      setSonuc('[IPUCU] Bir hata oluştu, tekrar dene.');
    }
    setYukleniyor(false);
  }

  const platformlar = ['Instagram & TikTok', 'Sadece Instagram', 'Sadece TikTok', 'YouTube Shorts'];
  const duygular = ['Merak', 'Şok', 'Empati', 'Heyecan', 'Korku/Aciliyet', 'Güldürme', 'İlham'];

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-black/90 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <a href="/sahis-dashboard" className="text-zinc-500 hover:text-white transition text-sm">← Dashboard</a>
          <div className="text-lg font-bold">VIA<span className="text-violet-500">.AI</span></div>
        </div>
        <p className="text-xs text-zinc-500">Viral Kanca Üretici</p>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Viral Kanca Üretici ⚡</h1>
          <p className="text-zinc-400 text-sm">İlk 3 saniyede izleyiciyi durdur. 10 farklı kanca formatı, kopyala yapıştır.</p>
        </div>

        {!sonuc && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs text-zinc-500 mb-2 block">İçerik Konusu *</label>
                <textarea
                  value={form.icerikKonusu}
                  onChange={e => setForm(prev => ({ ...prev, icerikKonusu: e.target.value }))}
                  placeholder="Örn: sabah rutini, saç boyama, yemek tarifi, spor motivasyonu, günlük vlog..."
                  rows={2}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition resize-none"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-500 mb-2 block">Platform</label>
                <div className="flex flex-wrap gap-2">
                  {platformlar.map(p => (
                    <button
                      key={p}
                      onClick={() => setForm(prev => ({ ...prev, platform: p }))}
                      className={`px-3 py-1.5 rounded-xl text-sm transition ${
                        form.platform === p
                          ? 'bg-red-600 text-white font-semibold'
                          : 'bg-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-500 mb-2 block">Hedef Duygu</label>
                <div className="flex flex-wrap gap-2">
                  {duygular.map(d => (
                    <button
                      key={d}
                      onClick={() => setForm(prev => ({ ...prev, hedefDuygu: d }))}
                      className={`px-3 py-1.5 rounded-xl text-sm transition ${
                        form.hedefDuygu === d
                          ? 'bg-pink-600 text-white font-semibold'
                          : 'bg-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={kancaUret}
                disabled={yukleniyor || !form.icerikKonusu.trim()}
                className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:opacity-90 disabled:from-zinc-700 disabled:to-zinc-700 disabled:text-zinc-500 py-3 rounded-xl text-sm font-semibold transition"
              >
                {yukleniyor ? 'Kancalar üretiliyor...' : '⚡ 10 Viral Kanca Üret'}
              </button>
            </div>
          </div>
        )}

        {yukleniyor && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center mb-4">
            <div className="flex justify-center gap-1 mb-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}/>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}/>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}/>
            </div>
            <p className="text-zinc-400 text-sm">Viral kanca formatları araştırılıyor...</p>
            <p className="text-zinc-600 text-xs mt-1">10 farklı psikolojik tetikleyici hazırlanıyor</p>
          </div>
        )}

        {sonuc && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-zinc-400">Kancaların hazır, kullan! ⚡</p>
              <button onClick={() => setSonuc('')} className="text-xs text-zinc-500 hover:text-white transition">
                ← Yeni Kanca
              </button>
            </div>
            <SonucKarti icerik={sonuc} />
          </div>
        )}
      </div>
    </main>
  );
}