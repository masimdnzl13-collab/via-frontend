'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

function SonucKarti({ icerik }: { icerik: string }) {
  const satirlar = icerik.split('\n').filter(s => s.trim());

  function satirRender(satir: string, i: number) {
    if (satir.startsWith('[BASLIK]')) {
      return (
        <div key={i} className="bg-gradient-to-r from-amber-600/20 to-green-600/20 border border-amber-500/40 rounded-xl px-4 py-3 mt-3">
          <p className="text-amber-300 font-semibold">{satir.replace('[BASLIK]', '').trim()}</p>
        </div>
      );
    }
    if (satir.startsWith('[OZET]')) {
      const p = satir.replace('[OZET]', '').trim().split('|');
      return (
        <div key={i} className="bg-gradient-to-r from-amber-600/20 to-green-600/20 border border-amber-500/30 rounded-xl p-5 mt-2">
          <p className="text-xs text-zinc-500 mb-1">Toplam Aylık Gelir Tahmini</p>
          <p className="text-amber-400 font-black text-3xl mb-3">{p[0]?.trim()}</p>
          {p[1] && (
            <div className="bg-green-500/20 rounded-lg px-3 py-2 mb-2">
              <p className="text-green-400 text-sm font-semibold">🚀 En yüksek potansiyel: {p[1].trim()}</p>
            </div>
          )}
          {p[2] && <p className="text-zinc-400 text-xs">{p[2].trim()}</p>}
        </div>
      );
    }
    if (satir.startsWith('[KANAL]')) {
      const p = satir.replace('[KANAL]', '').trim().split('|');
      const zorluk = p[3]?.trim() || '';
      const zorlukRenk = zorluk.toLowerCase().includes('kolay') ? 'text-green-400 bg-green-500/20' :
        zorluk.toLowerCase().includes('orta') ? 'text-amber-400 bg-amber-500/20' : 'text-red-400 bg-red-500/20';
      return (
        <div key={i} className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 mt-2">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white font-semibold text-sm">💰 {p[0]?.trim()}</p>
            <div className="flex items-center gap-2">
              {p[3] && <span className={`text-xs px-2 py-0.5 rounded-full ${zorlukRenk}`}>{zorluk}</span>}
              {p[1] && <p className="text-amber-400 font-bold text-sm">{p[1].trim()}</p>}
            </div>
          </div>
          {p[2] && <p className="text-zinc-400 text-xs">{p[2].trim()}</p>}
        </div>
      );
    }
    if (satir.startsWith('[HESAP]')) {
      const p = satir.replace('[HESAP]', '').trim().split('|');
      return (
        <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 mt-1 font-mono">
          <p className="text-zinc-400 text-xs mb-1">{p[0]?.trim()}</p>
          {p[1] && <p className="text-zinc-500 text-xs mb-1">{p[1].trim()}</p>}
          {p[2] && <p className="text-amber-400 font-bold text-sm">= {p[2].trim()}</p>}
        </div>
      );
    }
    if (satir.startsWith('[HEDEF_ANALIZ]')) {
      const p = satir.replace('[HEDEF_ANALIZ]', '').trim().split('|');
      return (
        <div key={i} className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4 mt-2">
          <p className="text-violet-400 font-semibold text-sm mb-2">🎯 Hedefe Uzaklık</p>
          {p[0] && <p className="text-zinc-300 text-sm mb-1">{p[0].trim()}</p>}
          {p[1] && <p className="text-zinc-400 text-xs mb-1">Eksik: {p[1].trim()}</p>}
          {p[2] && (
            <div className="bg-violet-500/10 rounded-lg px-2 py-1 mt-1">
              <p className="text-violet-300 text-xs">⏱ {p[2].trim()}</p>
            </div>
          )}
        </div>
      );
    }
    if (satir.startsWith('[BUYUME]')) {
      const p = satir.replace('[BUYUME]', '').trim().split('|');
      return (
        <div key={i} className="flex items-center justify-between bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 mt-1">
          <div>
            <p className="text-zinc-400 text-xs">Takipçi</p>
            <p className="text-white font-bold">{p[0]?.trim()}</p>
          </div>
          <div className="text-center">
            <p className="text-zinc-400 text-xs">Aylık Gelir</p>
            <p className="text-amber-400 font-bold">{p[1]?.trim()}</p>
          </div>
          {p[2] && (
            <div className="text-right">
              <p className="text-zinc-400 text-xs">Not</p>
              <p className="text-green-400 text-xs">{p[2].trim()}</p>
            </div>
          )}
        </div>
      );
    }
    if (satir.startsWith('[VERGI]')) {
      const p = satir.replace('[VERGI]', '').trim().split('|');
      return (
        <div key={i} className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mt-2">
          <p className="text-red-400 font-semibold text-sm mb-1">⚠️ Vergi & Kesintiler</p>
          {p[0] && <p className="text-zinc-300 text-xs mb-1">{p[0].trim()}</p>}
          {p[1] && <p className="text-zinc-400 text-xs italic">{p[1].trim()}</p>}
        </div>
      );
    }
    if (satir.startsWith('[AKSIYON]')) {
      const p = satir.replace('[AKSIYON]', '').trim().split('|');
      return (
        <div key={i} className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 mt-1">
          <p className="text-green-400 font-semibold text-sm mb-1">⚡ {p[0]?.trim()}</p>
          {p[1] && <p className="text-zinc-400 text-xs mb-1">{p[1].trim()}</p>}
          {p[2] && (
            <div className="bg-green-500/10 rounded-lg px-2 py-1 mt-1">
              <p className="text-green-300 text-xs">Beklenen: {p[2].trim()}</p>
            </div>
          )}
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

export default function GelirHesaplayici() {
  const [profil, setProfil] = useState<any>(null);
  const [sonuc, setSonuc] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);
  const [form, setForm] = useState({
    takipciSayisi: '10000',
    ortalamaIzlenme: '25000',
    etkilesimOrani: '4',
    platform: 'Instagram',
    gelirHedefi: '20.000 TL/ay',
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

  async function hesapla() {
    if (yukleniyor) return;
    setYukleniyor(true);
    setSonuc('');

    try {
      const res = await fetch('/api/gelir-hesaplayici', {
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

  const platformlar = ['Instagram', 'TikTok', 'YouTube', 'Instagram + TikTok'];
  const gelirHedefleri = ['5.000 TL/ay', '10.000 TL/ay', '20.000 TL/ay', '50.000 TL/ay', '100.000 TL/ay'];

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-black/90 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <a href="/sahis-dashboard" className="text-zinc-500 hover:text-white transition text-sm">← Dashboard</a>
          <div className="text-lg font-bold">VIA<span className="text-violet-500">.AI</span></div>
        </div>
        <p className="text-xs text-zinc-500">Gelir Hesaplayıcı</p>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Gelir Hesaplayıcı 💰</h1>
          <p className="text-zinc-400 text-sm">Takipçi sayına ve etkileşimine göre gerçekçi kazanç potansiyelini öğren.</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs text-zinc-500 mb-2 block">Platform</label>
              <div className="flex flex-wrap gap-2">
                {platformlar.map(p => (
                  <button
                    key={p}
                    onClick={() => setForm(prev => ({ ...prev, platform: p }))}
                    className={`px-3 py-1.5 rounded-xl text-sm transition ${
                      form.platform === p
                        ? 'bg-amber-600 text-white font-semibold'
                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Takipçi Sayısı</label>
                <input
                  type="number"
                  value={form.takipciSayisi}
                  onChange={e => setForm(prev => ({ ...prev, takipciSayisi: e.target.value }))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Ort. İzlenme</label>
                <input
                  type="number"
                  value={form.ortalamaIzlenme}
                  onChange={e => setForm(prev => ({ ...prev, ortalamaIzlenme: e.target.value }))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Etkileşim %</label>
                <input
                  type="number"
                  value={form.etkilesimOrani}
                  onChange={e => setForm(prev => ({ ...prev, etkilesimOrani: e.target.value }))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-zinc-500 mb-2 block">Aylık Gelir Hedefin</label>
              <div className="flex flex-wrap gap-2">
                {gelirHedefleri.map(g => (
                  <button
                    key={g}
                    onClick={() => setForm(prev => ({ ...prev, gelirHedefi: g }))}
                    className={`px-3 py-1.5 rounded-xl text-sm transition ${
                      form.gelirHedefi === g
                        ? 'bg-green-600 text-white font-semibold'
                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={hesapla}
              disabled={yukleniyor}
              className="w-full bg-gradient-to-r from-amber-600 to-green-600 hover:opacity-90 disabled:from-zinc-700 disabled:to-zinc-700 disabled:text-zinc-500 py-3 rounded-xl text-sm font-semibold transition"
            >
              {yukleniyor ? 'Hesaplanıyor...' : '💰 Gelir Potansiyelimi Hesapla'}
            </button>
          </div>
        </div>

        {yukleniyor && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center mb-4">
            <div className="flex justify-center gap-1 mb-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}/>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}/>
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}/>
            </div>
            <p className="text-zinc-400 text-sm">Türkiye influencer pazar verileri analiz ediliyor...</p>
            <p className="text-zinc-600 text-xs mt-1">Tüm gelir kanalları hesaplanıyor</p>
          </div>
        )}

        {sonuc && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-zinc-400">Gelir analizi hazır 💰</p>
              <button onClick={() => setSonuc('')} className="text-xs text-zinc-500 hover:text-white transition">
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