'use client';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';

const AYLAR = ['', 'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

function RaporKarti({ icerik, profil, veriler }: { icerik: string; profil: any; veriler: any }) {
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
        if (satir.startsWith('[OZET]')) {
          const metin = satir.replace('[OZET]', '').trim();
          const parcalar = metin.split('|');
          const skor = parseInt(parcalar[2]?.trim() || '0');
          const skorRenk = skor >= 70 ? 'text-green-400' : skor >= 40 ? 'text-amber-400' : 'text-red-400';
          const cubukRenk = skor >= 70 ? 'bg-green-500' : skor >= 40 ? 'bg-amber-500' : 'bg-red-500';
          return (
            <div key={i} className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 mt-2">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white font-semibold">{parcalar[0]?.trim()}</p>
                <p className={`${skorRenk} font-bold text-2xl`}>{parcalar[2]?.trim()}/100</p>
              </div>
              <div className="w-full bg-zinc-700 rounded-full h-2 mb-3">
                <div className={`${cubukRenk} h-2 rounded-full`} style={{ width: `${skor}%` }} />
              </div>
              {parcalar[1] && <p className="text-zinc-400 text-sm">{parcalar[1].trim()}</p>}
            </div>
          );
        }
        if (satir.startsWith('[METRIK]')) {
          const metin = satir.replace('[METRIK]', '').trim();
          const parcalar = metin.split('|');
          const deger = parcalar[3]?.trim() || '';
          const degerRenk = deger.toLowerCase().includes('iyi') || deger.toLowerCase().includes('üstün')
            ? 'text-green-400' : deger.toLowerCase().includes('zayıf') || deger.toLowerCase().includes('düşük')
            ? 'text-red-400' : 'text-amber-400';
          return (
            <div key={i} className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-xs mb-1">{parcalar[0]?.trim()}</p>
                  <p className="text-white font-bold text-lg">{parcalar[1]?.trim()}</p>
                  {parcalar[2] && <p className="text-zinc-500 text-xs">Sektör ort: {parcalar[2].trim()}</p>}
                </div>
                <span className={`${degerRenk} text-xs font-semibold bg-zinc-900 px-2 py-1 rounded-lg`}>
                  {parcalar[3]?.trim()}
                </span>
              </div>
            </div>
          );
        }
        if (satir.startsWith('[BASARI]')) {
          const metin = satir.replace('[BASARI]', '').trim();
          const parcalar = metin.split('|');
          return (
            <div key={i} className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 mt-1">
              <p className="text-green-400 font-semibold text-sm mb-1">🏆 {parcalar[0]?.trim()}</p>
              {parcalar[1] && <p className="text-zinc-400 text-xs">{parcalar[1].trim()}</p>}
            </div>
          );
        }
        if (satir.startsWith('[ZAYIF]')) {
          const metin = satir.replace('[ZAYIF]', '').trim();
          const parcalar = metin.split('|');
          return (
            <div key={i} className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mt-1">
              <p className="text-red-400 font-semibold text-sm mb-1">⚠️ {parcalar[0]?.trim()}</p>
              {parcalar[1] && <p className="text-zinc-400 text-xs mb-1">{parcalar[1].trim()}</p>}
              {parcalar[2] && <p className="text-zinc-300 text-xs">Çözüm: {parcalar[2].trim()}</p>}
            </div>
          );
        }
        if (satir.startsWith('[STRATEJI]')) {
          const metin = satir.replace('[STRATEJI]', '').trim();
          const parcalar = metin.split('|');
          return (
            <div key={i} className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 mt-1">
              <p className="text-blue-400 font-semibold text-sm mb-1">🚀 {parcalar[0]?.trim()}</p>
              {parcalar[1] && <p className="text-zinc-300 text-xs mb-1">{parcalar[1].trim()}</p>}
              {parcalar[2] && <p className="text-blue-300 text-xs">Beklenen: {parcalar[2].trim()}</p>}
            </div>
          );
        }
        if (satir.startsWith('[HEDEF]')) {
          const metin = satir.replace('[HEDEF]', '').trim();
          const parcalar = metin.split('|');
          return (
            <div key={i} className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-3 mt-1">
              <div className="flex items-center justify-between">
                <p className="text-violet-400 font-semibold text-sm">🎯 {parcalar[0]?.trim()}</p>
                <p className="text-violet-300 font-bold">{parcalar[1]?.trim()}</p>
              </div>
              {parcalar[2] && <p className="text-zinc-400 text-xs mt-1">{parcalar[2].trim()}</p>}
            </div>
          );
        }
        if (satir.startsWith('[TAVSIYE]')) {
          const metin = satir.replace('[TAVSIYE]', '').trim();
          const parcalar = metin.split('|');
          return (
            <div key={i} className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mt-1">
              <p className="text-amber-400 font-semibold text-sm mb-1">💡 {parcalar[0]?.trim()}</p>
              {parcalar[1] && <p className="text-zinc-400 text-xs mb-1">{parcalar[1].trim()}</p>}
              {parcalar[2] && <p className="text-zinc-300 text-xs">{parcalar[2].trim()}</p>}
            </div>
          );
        }
        if (satir.startsWith('[IPUCU]')) {
          const metin = satir.replace('[IPUCU]', '').trim();
          return (
            <div key={i} className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl px-3 py-2 mt-1">
              <p className="text-cyan-400 text-sm">📌 {metin}</p>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

export default function AylikRapor() {
  const [profil, setProfil] = useState<any>(null);
  const [userId, setUserId] = useState('');
  const [mevcutRaporlar, setMevcutRaporlar] = useState<any[]>([]);
  const [seciliRapor, setSeciliRapor] = useState<any>(null);
  const [yeniRaporAc, setYeniRaporAc] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [raporUretiliyor, setRaporUretiliyor] = useState(false);
  const raporRef = useRef<HTMLDivElement>(null);

  const bugunkiAy = new Date().getMonth() + 1;
  const bugunkiYil = new Date().getFullYear();

  const [veriler, setVeriler] = useState({
    takipci_artis: '',
    toplam_izlenme: '',
    toplam_begeni: '',
    toplam_yorum: '',
    icerik_sayisi: '',
    en_iyi_icerik: '',
    ay: bugunkiAy,
    yil: bugunkiYil,
  });

  useEffect(() => {
    async function yukle() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/giris'; return; }
      setUserId(user.id);
      const { data: profilData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfil(profilData);

      const res = await fetch(`/api/aylik-rapor?userId=${user.id}`);
      const { raporlar } = await res.json();
      setMevcutRaporlar(raporlar);
    }
    yukle();
  }, []);

  async function raporUret() {
    if (raporUretiliyor) return;
    setRaporUretiliyor(true);

    try {
      const res = await fetch('/api/aylik-rapor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profil,
          userId,
          veriler: {
            ...veriler,
            takipci_artis: parseInt(veriler.takipci_artis) || 0,
            toplam_izlenme: parseInt(veriler.toplam_izlenme) || 0,
            toplam_begeni: parseInt(veriler.toplam_begeni) || 0,
            toplam_yorum: parseInt(veriler.toplam_yorum) || 0,
            icerik_sayisi: parseInt(veriler.icerik_sayisi) || 0,
          }
        }),
      });
      const data = await res.json();

      const yeniRapor = {
  ...veriler,
  ay: veriler.ay,
  yil: veriler.yil,
  ai_analiz: data.aiAnaliz,
}
      setSeciliRapor(yeniRapor);
      setYeniRaporAc(false);

      const res2 = await fetch(`/api/aylik-rapor?userId=${userId}`);
      const { raporlar } = await res2.json();
      setMevcutRaporlar(raporlar);
    } catch {
      alert('Hata oluştu, tekrar dene.');
    }
    setRaporUretiliyor(false);
  }

  async function pdfIndir() {
    setYukleniyor(true);
    const { default: html2pdf } = await import('html2pdf.js');
    const element = raporRef.current;
    if (!element) return;

    html2pdf().set({
      margin: 10,
      filename: `via-ai-rapor-${AYLAR[seciliRapor.ay]}-${seciliRapor.yil}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, backgroundColor: '#09090b' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).from(element).save();

    setYukleniyor(false);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-black/90 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <a href="/dashboard" className="text-zinc-500 hover:text-white transition text-sm">← Dashboard</a>
          <div className="text-lg font-bold">via<span className="text-violet-500">.ai</span></div>
        </div>
        <p className="text-xs text-zinc-500">Aylık Büyüme Raporu</p>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Aylık Büyüme Raporu 📊</h1>
            <p className="text-zinc-400 text-sm">Ajans kalitesinde büyüme analizi ve strateji raporu.</p>
          </div>
          <button
            onClick={() => setYeniRaporAc(true)}
            className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-xl text-sm font-semibold transition"
          >
            + Yeni Rapor
          </button>
        </div>

        {/* Mevcut Raporlar */}
        {mevcutRaporlar.length > 0 && !seciliRapor && !yeniRaporAc && (
          <div className="space-y-3 mb-6">
            <p className="text-xs text-zinc-500">Geçmiş Raporlar</p>
            {mevcutRaporlar.map((rapor, i) => (
              <button
                key={i}
                onClick={() => setSeciliRapor(rapor)}
                className="w-full bg-zinc-900 border border-zinc-800 hover:border-violet-500 rounded-2xl p-4 text-left transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{AYLAR[rapor.ay]} {rapor.yil} Raporu</p>
                    <p className="text-zinc-500 text-xs mt-1">
                      +{rapor.takipci_artis} takipçi · {rapor.toplam_izlenme} izlenme · {rapor.icerik_sayisi} içerik
                    </p>
                  </div>
                  <span className="text-violet-400 text-sm">Görüntüle →</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Yeni Rapor Formu */}
        {yeniRaporAc && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-6">
            <p className="font-semibold mb-4">Bu Ayın Verilerini Gir</p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { key: 'takipci_artis', label: 'Takipçi Artışı', placeholder: '150' },
                { key: 'toplam_izlenme', label: 'Toplam İzlenme', placeholder: '25000' },
                { key: 'toplam_begeni', label: 'Toplam Beğeni', placeholder: '3200' },
                { key: 'toplam_yorum', label: 'Toplam Yorum', placeholder: '180' },
                { key: 'icerik_sayisi', label: 'Paylaşılan İçerik', placeholder: '12' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="text-xs text-zinc-500 mb-1 block">{label}</label>
                  <input
                    type="number"
                    value={(veriler as any)[key]}
                    onChange={e => setVeriler(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition"
                  />
                </div>
              ))}
            </div>

            <div className="mb-4">
              <label className="text-xs text-zinc-500 mb-1 block">En İyi İçerik (opsiyonel)</label>
              <input
                type="text"
                value={veriler.en_iyi_icerik}
                onChange={e => setVeriler(prev => ({ ...prev, en_iyi_icerik: e.target.value }))}
                placeholder="Bu ay en çok izlenen içeriğini anlat"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setYeniRaporAc(false)}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-3 rounded-xl text-sm transition"
              >
                İptal
              </button>
              <button
                onClick={raporUret}
                disabled={raporUretiliyor}
                className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-700 py-3 rounded-xl text-sm font-semibold transition"
              >
                {raporUretiliyor ? 'Rapor hazırlanıyor...' : 'Raporu Oluştur →'}
              </button>
            </div>

            {raporUretiliyor && (
              <div className="flex items-center gap-3 text-zinc-400 text-sm mt-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}/>
                  <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}/>
                  <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}/>
                </div>
                AI rapor analiz ediyor, sektör verileri araştırılıyor...
              </div>
            )}
          </div>
        )}

        {/* Rapor Görünümü */}
        {seciliRapor && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setSeciliRapor(null)}
                className="text-zinc-500 hover:text-white text-sm transition"
              >
                ← Geri
              </button>
              <button
                onClick={pdfIndir}
                disabled={yukleniyor}
                className="bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-700 px-4 py-2 rounded-xl text-sm font-semibold transition"
              >
                {yukleniyor ? 'Hazırlanıyor...' : '⬇ PDF İndir'}
              </button>
            </div>

            <div ref={raporRef} className="bg-zinc-950 rounded-2xl p-6">
              {/* Rapor Başlık */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
                <div>
                  <p className="text-2xl font-bold">via<span className="text-violet-500">.ai</span></p>
                  <p className="text-zinc-400 text-sm">Büyüme Raporu</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">{profil?.isletme_adi}</p>
                  <p className="text-zinc-400 text-sm">{AYLAR[seciliRapor.ay]} {seciliRapor.yil}</p>
                </div>
              </div>

              {/* Özet Metrikler */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                {[
                  { label: 'Takipçi Artışı', deger: `+${seciliRapor.takipci_artis}`, renk: 'text-green-400' },
                  { label: 'Toplam İzlenme', deger: seciliRapor.toplam_izlenme?.toLocaleString(), renk: 'text-blue-400' },
                  { label: 'Toplam Beğeni', deger: seciliRapor.toplam_begeni?.toLocaleString(), renk: 'text-pink-400' },
                  { label: 'İçerik Sayısı', deger: seciliRapor.icerik_sayisi, renk: 'text-violet-400' },
                ].map((m, i) => (
                  <div key={i} className="bg-zinc-900 rounded-xl p-3 text-center">
                    <p className={`${m.renk} font-bold text-xl`}>{m.deger}</p>
                    <p className="text-zinc-500 text-xs mt-1">{m.label}</p>
                  </div>
                ))}
              </div>

              {/* AI Analiz */}
              <RaporKarti
                icerik={seciliRapor.ai_analiz}
                profil={profil}
                veriler={seciliRapor}
              />

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-zinc-800 text-center">
                <p className="text-zinc-600 text-xs">Bu rapor via.ai tarafından otomatik olarak oluşturulmuştur.</p>
                <p className="text-zinc-600 text-xs">via.ai · {profil?.sektor} · {profil?.sehir}</p>
              </div>
            </div>
          </div>
        )}

        {!yeniRaporAc && !seciliRapor && mevcutRaporlar.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">📊</p>
            <p className="text-zinc-400 mb-2">Henüz rapor yok</p>
            <p className="text-zinc-600 text-sm mb-6">İlk aylık raporunu oluştur</p>
            <button
              onClick={() => setYeniRaporAc(true)}
              className="bg-violet-600 hover:bg-violet-700 px-6 py-3 rounded-xl text-sm font-semibold transition"
            >
              İlk Raporu Oluştur →
            </button>
          </div>
        )}
      </div>
    </main>
  );
}