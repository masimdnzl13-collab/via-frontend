'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

function SonucKarti({ icerik }: { icerik: string }) {
  const satirlar = icerik.split('\n').filter(s => s.trim());

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

        if (satir.startsWith('[PERSONA]')) {
          const metin = satir.replace('[PERSONA]', '').trim();
          const parcalar = metin.split('|');
          return (
            <div key={i} className="bg-gradient-to-r from-violet-600/20 to-blue-600/20 border border-violet-500/40 rounded-xl p-4 mt-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-violet-600 rounded-full flex items-center justify-center text-xl">
                  👤
                </div>
                <div>
                  <p className="text-white font-bold">{parcalar[0]?.trim()}</p>
                  <p className="text-zinc-400 text-xs">{parcalar[1]?.trim()} · {parcalar[2]?.trim()}</p>
                </div>
              </div>
              {parcalar[3] && (
                <div className="bg-black/20 rounded-lg px-3 py-2">
                  <p className="text-zinc-300 text-xs">💼 {parcalar[3].trim()}</p>
                </div>
              )}
            </div>
          );
        }

        if (satir.startsWith('[DEMOGRAFIK]')) {
          const metin = satir.replace('[DEMOGRAFIK]', '').trim();
          const parcalar = metin.split('|');
          return (
            <div key={i} className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 mt-1">
              <p className="text-blue-400 font-semibold text-xs mb-1">📊 {parcalar[0]?.trim()}</p>
              {parcalar[1] && <p className="text-zinc-300 text-sm">{parcalar[1].trim()}</p>}
            </div>
          );
        }

        if (satir.startsWith('[PSIKOLOJI]')) {
          const metin = satir.replace('[PSIKOLOJI]', '').trim();
          const parcalar = metin.split('|');
          return (
            <div key={i} className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-3 mt-1">
              <p className="text-purple-400 font-semibold text-xs mb-1">🧠 {parcalar[0]?.trim()}</p>
              {parcalar[1] && <p className="text-zinc-300 text-sm">{parcalar[1].trim()}</p>}
            </div>
          );
        }

        if (satir.startsWith('[DIJITAL]')) {
          const metin = satir.replace('[DIJITAL]', '').trim();
          const parcalar = metin.split('|');
          return (
            <div key={i} className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-3 mt-1">
              <p className="text-cyan-400 font-semibold text-sm mb-1">📱 {parcalar[0]?.trim()}</p>
              {parcalar[1] && <p className="text-zinc-400 text-xs mb-1">⏰ {parcalar[1].trim()}</p>}
              {parcalar[2] && <p className="text-zinc-300 text-xs">{parcalar[2].trim()}</p>}
            </div>
          );
        }

        if (satir.startsWith('[PARA]')) {
          const metin = satir.replace('[PARA]', '').trim();
          const parcalar = metin.split('|');
          return (
            <div key={i} className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1">
              <p className="text-xs text-zinc-500 mb-2">💰 Harcama Davranışı</p>
              {parcalar[0] && (
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-green-400 text-xs mt-0.5 flex-shrink-0">✓ Verir:</span>
                  <p className="text-zinc-300 text-xs">{parcalar[0].trim()}</p>
                </div>
              )}
              {parcalar[1] && (
                <div className="flex items-start gap-2">
                  <span className="text-red-400 text-xs mt-0.5 flex-shrink-0">✗ Vermez:</span>
                  <p className="text-zinc-300 text-xs">{parcalar[1].trim()}</p>
                </div>
              )}
            </div>
          );
        }

        if (satir.startsWith('[MESAJ]')) {
          const metin = satir.replace('[MESAJ]', '').trim();
          const parcalar = metin.split('|');
          return (
            <div key={i} className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 mt-1">
              <p className="text-green-400 font-semibold text-sm mb-1">🎯 {parcalar[0]?.trim()}</p>
              {parcalar[1] && <p className="text-zinc-400 text-xs">{parcalar[1].trim()}</p>}
            </div>
          );
        }

        if (satir.startsWith('[KACIRAN]')) {
          const metin = satir.replace('[KACIRAN]', '').trim();
          const parcalar = metin.split('|');
          return (
            <div key={i} className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mt-1">
              <p className="text-red-400 font-semibold text-sm mb-1">⚠️ {parcalar[0]?.trim()}</p>
              {parcalar[1] && <p className="text-zinc-400 text-xs">{parcalar[1].trim()}</p>}
            </div>
          );
        }

        if (satir.startsWith('[STRATEJI]')) {
          const metin = satir.replace('[STRATEJI]', '').trim();
          const parcalar = metin.split('|');
          return (
            <div key={i} className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-3 mt-1">
              <p className="text-violet-400 font-semibold text-sm mb-1">🚀 {parcalar[0]?.trim()}</p>
              {parcalar[1] && <p className="text-zinc-300 text-xs mb-1">{parcalar[1].trim()}</p>}
              {parcalar[2] && (
                <div className="bg-violet-500/10 rounded-lg px-2 py-1 mt-1">
                  <p className="text-violet-300 text-xs">📈 {parcalar[2].trim()}</p>
                </div>
              )}
            </div>
          );
        }

        if (satir.startsWith('[IPUCU]')) {
          const metin = satir.replace('[IPUCU]', '').trim();
          return (
            <div key={i} className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2 mt-1">
              <p className="text-amber-400 text-sm">⚡ {metin}</p>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}

export default function MusteriAnalizi() {
  const [ekBilgi, setEkBilgi] = useState('');
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

  async function analizeEt() {
    if (yukleniyor || !profil) return;
    setYukleniyor(true);
    setSonuc('');

    try {
      const res = await fetch('/api/musteri-analizi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profil, ekBilgi }),
      });
      const data = await res.json();
      setSonuc(data.cevap);
    } catch {
      setSonuc('[IPUCU] Bir hata oluştu, tekrar dene.');
    }
    setYukleniyor(false);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-black/90 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <a href="/dashboard" className="text-zinc-500 hover:text-white transition text-sm">← Dashboard</a>
          <div className="text-lg font-bold">via<span className="text-violet-500">.ai</span></div>
        </div>
        <p className="text-xs text-zinc-500">Müşteri Kitlesi Analizi</p>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Müşteri Kitlesi Analizi 👥</h1>
          <p className="text-zinc-400 text-sm">Müşterinin kim olduğunu, ne istediğini ve nasıl düşündüğünü öğren.</p>
        </div>

        {profil && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-4">
            <p className="text-xs text-zinc-500 mb-3">Analiz bilgileri profil bilgilerinden otomatik alınacak:</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-zinc-800 rounded-xl p-2 text-center">
                <p className="text-xs text-zinc-500">Sektör</p>
                <p className="text-white text-xs font-semibold mt-1">{profil.sektor}</p>
              </div>
              <div className="bg-zinc-800 rounded-xl p-2 text-center">
                <p className="text-xs text-zinc-500">Şehir</p>
                <p className="text-white text-xs font-semibold mt-1">{profil.sehir}</p>
              </div>
              <div className="bg-zinc-800 rounded-xl p-2 text-center">
                <p className="text-xs text-zinc-500">Hedef</p>
                <p className="text-white text-xs font-semibold mt-1 truncate">{profil.hedef}</p>
              </div>
            </div>

            <label className="text-xs text-zinc-500 mb-2 block">Eklemek istediğin bilgi var mı? (opsiyonel)</label>
            <textarea
              value={ekBilgi}
              onChange={e => setEkBilgi(e.target.value)}
              placeholder="Örn: Orta-üst gelir segmenti hedefliyorum, 25-35 yaş arası çalışan kadınlar..."
              rows={2}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition resize-none mb-3"
            />
            <button
              onClick={analizeEt}
              disabled={yukleniyor}
              className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-700 disabled:text-zinc-500 py-3 rounded-xl text-sm font-semibold transition"
            >
              {yukleniyor ? 'Analiz ediliyor...' : 'Müşteri Kitlesini Analiz Et →'}
            </button>
          </div>
        )}

        {yukleniyor && (
          <div className="flex items-center gap-3 text-zinc-400 text-sm px-2 mb-4">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}/>
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}/>
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}/>
            </div>
            Müşteri kitlesi araştırılıyor...
          </div>
        )}

        {sonuc && <SonucKarti icerik={sonuc} />}
      </div>
    </main>
  );
}