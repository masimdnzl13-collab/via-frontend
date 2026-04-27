'use client';
import { useState } from 'react';

export default function IcerikUret() {
  const [yukleniyor, setYukleniyor] = useState(false);
  const [sonuc, setSonuc] = useState('');
  const [form, setForm] = useState({
    isletme_adi: '',
    sektor: 'Berber',
    sehir: '',
    hedef: 'Daha fazla müşteri',
  });

  const sektorler = ['Berber', 'Güzellik Salonu', 'Kafe', 'Restoran', 'Spor Salonu', 'Butik Mağaza'];
  const hedefler = ['Daha fazla müşteri', 'Daha fazla takipçi', 'Randevu almak', 'Ürün satmak'];

  async function icerikUret() {
    setYukleniyor(true);
    setSonuc('');
    try {
      const res = await fetch('http://localhost:8000/icerik-uret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setSonuc(data.plan);
    } catch (err) {
      setSonuc('API bağlantısı kurulamadı. Backend çalışıyor mu?');
    }
    setYukleniyor(false);
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-2xl mx-auto">

        <div className="mb-8">
          <a href="/dashboard" className="text-zinc-500 text-sm hover:text-white transition">← Dashboard</a>
          <h1 className="text-3xl font-bold mt-4">✨ İçerik Üret</h1>
          <p className="text-zinc-400 mt-2">İşletme bilgilerini gir, AI haftalık planını oluştursun.</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 mb-6">
          
          <div>
            <label className="text-sm text-zinc-400 mb-2 block">İşletme adın</label>
            <input
              type="text"
              placeholder="örn. Mustafa Berber"
              value={form.isletme_adi}
              onChange={e => setForm({...form, isletme_adi: e.target.value})}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400 mb-2 block">Şehir</label>
            <input
              type="text"
              placeholder="örn. İstanbul"
              value={form.sehir}
              onChange={e => setForm({...form, sehir: e.target.value})}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400 mb-2 block">Sektör</label>
            <div className="grid grid-cols-3 gap-2">
              {sektorler.map(s => (
                <button
                  key={s}
                  onClick={() => setForm({...form, sektor: s})}
                  className={`py-2 px-3 rounded-xl text-sm border transition ${
                    form.sektor === s
                      ? 'border-violet-500 bg-violet-600/20 text-white'
                      : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-500'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-zinc-400 mb-2 block">Hedef</label>
            <div className="grid grid-cols-2 gap-2">
              {hedefler.map(h => (
                <button
                  key={h}
                  onClick={() => setForm({...form, hedef: h})}
                  className={`py-2 px-3 rounded-xl text-sm border transition ${
                    form.hedef === h
                      ? 'border-violet-500 bg-violet-600/20 text-white'
                      : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-500'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={icerikUret}
            disabled={yukleniyor || !form.isletme_adi || !form.sehir}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-700 disabled:text-zinc-500 py-3 rounded-xl font-semibold transition"
          >
            {yukleniyor ? '⏳ AI içerik üretiyor...' : '✨ Haftalık Plan Oluştur'}
          </button>
        </div>

        {sonuc && (
          <div className="bg-zinc-900 border border-violet-500/30 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4 text-violet-400">✅ Haftalık İçerik Planın</h2>
            <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
              {sonuc}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}