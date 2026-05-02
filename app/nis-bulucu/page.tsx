'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

function SonucKarti({ icerik }: { icerik: string }) {
  const satirlar = icerik.split('\n').filter(s => s.trim());

  function satirRender(satir: string, i: number) {
    if (satir.startsWith('[BASLIK]')) {
      return (
        <div key={i} className="bg-gradient-to-r from-violet-600/20 to-blue-600/20 border border-violet-500/40 rounded-xl px-4 py-3 mt-4">
          <p className="text-violet-300 font-semibold">{satir.replace('[BASLIK]', '').trim()}</p>
        </div>
      );
    }
    if (satir.startsWith('[NIS]')) {
      const p = satir.replace('[NIS]', '').trim().split('|');
      const rekabet = p[1]?.trim();
      const rekaberRenk = rekabet === 'Düşük' ? 'text-green-400 bg-green-500/20' : rekabet === 'Orta' ? 'text-amber-400 bg-amber-500/20' : 'text-red-400 bg-red-500/20';
      const puan = parseInt(p[2]?.trim() || '0');
      return (
        <div key={i} className="bg-zinc-900 border border-zinc-700 rounded-2xl p-4 mt-2">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white font-bold text-base">🎯 {p[0]?.trim()}</p>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${rekaberRenk}`}>
              {rekabet} rekabet
            </span>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 bg-zinc-800 rounded-xl p-3 text-center">
              <p className="text-xs text-zinc-500 mb-1">Para Potansiyeli</p>
              <p className="text-lg font-bold text-amber-400">{puan}/10</p>
            </div>
            <div className="flex-1 bg-zinc-800 rounded-xl p-3 text-center">
              <p className="text-xs text-zinc-500 mb-1">Büyüme Hızı</p>
              <p className="text-sm font-bold text-violet-400">{p[3]?.trim() || '-'}</p>
            </div>
          </div>
        </div>
      );
    }
    if (satir.startsWith('[NEDEN]')) {
      const p = satir.replace('[NEDEN]', '').trim().split('|');
      return (
        <div key={i} className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 mt-1">
          <p className="text-blue-400 text-xs font-semibold mb-1">✅ Neden sana uygun?</p>
          <p className="text-zinc-300 text-sm">{p[0]?.trim()}</p>
          {p[1] && <p className="text-zinc-500 text-xs mt-1">Güçlü yönlerin: {p[1].trim()}</p>}
        </div>
      );
    }
    if (satir.startsWith('[ICERIK]')) {
      const p = satir.replace('[ICERIK]', '').trim().split('|');
      return (
        <div key={i} className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-violet-400 text-xs font-bold bg-violet-500/20 px-2 py-0.5 rounded-full">{p[1]?.trim()}</span>
            <span className="text-zinc-500 text-xs">{p[2]?.trim()}</span>
          </div>
          <p className="text-zinc-300 text-sm">🎬 {p[0]?.trim()}</p>
        </div>
      );
    }
    if (satir.startsWith('[RAKIP]')) {
      const p = satir.replace('[RAKIP]', '').trim().split('|');
      return (
        <div key={i} className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1">
          <div className="flex items-center justify-between mb-1">
            <p className="text-white text-sm font-semibold">👤 {p[0]?.trim()}</p>
            <span className="text-green-400 text-xs">{p[1]?.trim()}</span>
          </div>
          {p[2] && <p className="text-zinc-400 text-xs">{p[2].trim()}</p>}
        </div>
      );
    }
    if (satir.startsWith('[PARA]')) {
      const p = satir.replace('[PARA]', '').trim().split('|');
      return (
        <div key={i} className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mt-1">
          <p className="text-amber-400 font-semibold text-sm mb-1">💰 {p[0]?.trim()}</p>
          {p[1] && <p className="text-zinc-400 text-xs mb-1">Ne zaman: {p[1].trim()}</p>}
          {p[2] && <p className="text-amber-300 text-xs font-bold">{p[2].trim()}</p>}
        </div>
      );
    }
    if (satir.startsWith('[KACIN]')) {
      const p = satir.replace('[KACIN]', '').trim().split('|');
      return (
        <div key={i} className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mt-1">
          <p className="text-red-400 font-semibold text-sm">❌ {p[0]?.trim()}</p>
          {p[1] && <p className="text-zinc-400 text-xs mt-1">{p[1].trim()}</p>}
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
    <div className="space-y-1">
      {satirlar.map((satir, i) => satirRender(satir, i))}
    </div>
  );
}

export default function NisBulucu() {
  const [profil, setProfil] = useState<any>(null);
  const [sonuc, setSonuc] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);
  const [form, setForm] = useState({
    ilgiAlanlari: '',
    yetenekler: '',
    hedef: 'Para kazanmak',
    zaman: 'Haftada 10 saat',
    deneyim: 'Yeni başlıyorum',
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

  async function nisiBul() {
    if (!form.ilgiAlanlari.trim() || yukleniyor) return;
    setYukleniyor(true);
    setSonuc('');

    try {
      const res = await fetch('/api/sahis-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tip: 'nis-bulucu', profil, ...form }),
      });
      const data = await res.json();
      setSonuc(data.cevap);
    } catch {
      setSonuc('[IPUCU] Bir hata oluştu, tekrar dene.');
    }
    setYukleniyor(false);
  }

  const hedefler = ['Para kazanmak', 'Marka oluşturmak', 'Takipçi kazanmak', 'Eğlence & hobi'];
  const zamanlar = ['Haftada 5 saat', 'Haftada 10 saat', 'Haftada 20 saat', 'Tam zamanlı'];
  const deneyimler = ['Yeni başlıyorum', '1-6 ay deneyim', '6-12 ay deneyim', '1 yıldan fazla'];

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-black/90 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <a href="/sahis-dashboard" className="text-zinc-500 hover:text-white transition text-sm">← Dashboard</a>
          <div className="text-lg font-bold">VIA<span className="text-violet-500">.AI</span></div>
        </div>
        <p className="text-xs text-zinc-500">Niş Bulucu</p>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Niş Bulucu 🎯</h1>
          <p className="text-zinc-400 text-sm">Sana özel en karlı ve büyüme potansiyeli yüksek içerik nişini bul.</p>
        </div>

        {!sonuc && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-6 space-y-4">

            {profil && (
              <div className="bg-zinc-800 rounded-xl p-3">
                <p className="text-xs text-zinc-500 mb-1">Mevcut bilgilerin</p>
                <p className="text-white font-semibold text-sm">{profil.isletme_adi}</p>
                <p className="text-zinc-400 text-xs">{profil.sektor} · {profil.sehir}</p>
              </div>
            )}

            <div>
              <label className="text-xs text-zinc-500 mb-2 block">İlgi Alanların *</label>
              <textarea
                value={form.ilgiAlanlari}
                onChange={e => setForm(prev => ({ ...prev, ilgiAlanlari: e.target.value }))}
                placeholder="Örn: moda, teknoloji, spor, yemek pişirme, oyun, seyahat, kişisel gelişim..."
                rows={2}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition resize-none"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-500 mb-2 block">Yeteneklerin / Güçlü Yönlerin</label>
              <textarea
                value={form.yetenekler}
                onChange={e => setForm(prev => ({ ...prev, yetenekler: e.target.value }))}
                placeholder="Örn: video düzenleme, konuşma, yazma, dans, müzik, spor, yemek yapma..."
                rows={2}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition resize-none"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-500 mb-2 block">Ana Hedefin</label>
              <div className="flex flex-wrap gap-2">
                {hedefler.map(h => (
                  <button key={h} onClick={() => setForm(prev => ({ ...prev, hedef: h }))}
                    className={`px-3 py-1.5 rounded-xl text-sm transition ${
                      form.hedef === h ? 'bg-violet-600 text-white font-semibold' : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}>
                    {h}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-zinc-500 mb-2 block">Haftada Ne Kadar Zaman Ayırabilirsin?</label>
              <div className="flex flex-wrap gap-2">
                {zamanlar.map(z => (
                  <button key={z} onClick={() => setForm(prev => ({ ...prev, zaman: z }))}
                    className={`px-3 py-1.5 rounded-xl text-sm transition ${
                      form.zaman === z ? 'bg-blue-600 text-white font-semibold' : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}>
                    {z}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-zinc-500 mb-2 block">İçerik Üretme Deneyimin</label>
              <div className="flex flex-wrap gap-2">
                {deneyimler.map(d => (
                  <button key={d} onClick={() => setForm(prev => ({ ...prev, deneyim: d }))}
                    className={`px-3 py-1.5 rounded-xl text-sm transition ${
                      form.deneyim === d ? 'bg-green-600 text-white font-semibold' : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={nisiBul}
              disabled={yukleniyor || !form.ilgiAlanlari.trim()}
              className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:opacity-90 disabled:from-zinc-700 disabled:to-zinc-700 disabled:text-zinc-500 py-3 rounded-xl text-sm font-semibold transition"
            >
              {yukleniyor ? 'Niş analizi yapılıyor...' : '🎯 Nişimi Bul'}
            </button>
          </div>
        )}

        {yukleniyor && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center mb-4">
            <div className="flex justify-center gap-1 mb-3">
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}/>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}/>
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}/>
            </div>
            <p className="text-zinc-400 text-sm">Güncel trend nişler araştırılıyor...</p>
            <p className="text-zinc-600 text-xs mt-1">Sana özel karlı nişler analiz ediliyor</p>
          </div>
        )}

        {sonuc && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-zinc-400">Sana özel niş analizin hazır 🎯</p>
              <button onClick={() => setSonuc('')} className="text-xs text-zinc-500 hover:text-white transition">
                ← Yeniden Analiz Et
              </button>
            </div>
            <SonucKarti icerik={sonuc} />
          </div>
        )}
      </div>
    </main>
  );
}